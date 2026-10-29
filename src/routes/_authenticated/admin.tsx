import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  listLeads,
  updateLeadStatus,
  updateLeadValor,
  deleteLead,
  createLeadManual,
  LEAD_STATUSES,
  type LeadStatus,
} from "@/lib/leads.functions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CrmNav } from "@/components/admin/CrmNav";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "CRM · Casa Prime Eventos" }] }),
  component: AdminPage,
});

type Lead = {
  id: string;
  status: string;
  responsavel_nome: string;
  telefone: string;
  email: string | null;
  crianca_nome: string | null;
  idade: number | null;
  data_festa: string | null;
  qtd_pessoas: number | null;
  pacote: string | null;
  tema: string | null;
  restricoes: string | null;
  session_id: string | null;
  valor: number | string | null;
  updated_at: string;
  created_at: string;
};

function formatBRL(v: number | string | null | undefined) {
  if (v === null || v === undefined || v === "") return "—";
  const n = typeof v === "number" ? v : Number(v);
  if (!isFinite(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const COLUMNS: { id: LeadStatus; title: string; accent: string }[] = [
  { id: "novo", title: "Novo contato", accent: "bg-blue-500" },
  { id: "em_atendimento", title: "Em atendimento", accent: "bg-amber-500" },
  { id: "agendada", title: "Festa agendada", accent: "bg-violet-500" },
  { id: "finalizada", title: "Finalizada", accent: "bg-emerald-500" },
  { id: "nao_fechou", title: "Não fechou", accent: "bg-rose-500" },
];

function normalizeStatus(s: string): LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(s) ? (s as LeadStatus) : "novo";
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchLeads = useServerFn(listLeads);
  const updateStatus = useServerFn(updateLeadStatus);
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      // 1. Tenta buscar direto pelo cliente Supabase com a sessão do usuário
      const { data: directLeads, error: directErr } = await supabase
        .from("leads_festas")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(500);

      if (!directErr && directLeads) {
        return { leads: directLeads as Lead[] };
      }

      // 2. Se falhar, tenta via server function de fallback
      try {
        return await fetchLeads();
      } catch (err) {
        if (directErr) throw directErr;
        throw err;
      }
    },
    refetchInterval: 15000,
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const leads = (data?.leads ?? []) as Lead[];
  const grouped = useMemo(() => {
    const g: Record<LeadStatus, Lead[]> = {
      novo: [], em_atendimento: [], agendada: [], finalizada: [], nao_fechou: [],
    };
    for (const l of leads) g[normalizeStatus(l.status)].push(l);
    return g;
  }, [leads]);

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const onDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const overId = e.over?.id;
    const leadId = String(e.active.id);
    if (!overId) return;
    const newStatus = String(overId) as LeadStatus;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || normalizeStatus(lead.status) === newStatus) return;

    // optimistic
    qc.setQueryData<{ leads: Lead[] }>(["leads"], (old) =>
      old ? { leads: old.leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)) } : old,
    );
    try {
      const { error: updErr } = await supabase
        .from("leads_festas")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", leadId);
      if (updErr) {
        await updateStatus({ data: { id: leadId, status: newStatus } });
      }
    } catch {
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px] w-full">
        <CrmNav
          totalLeads={leads.length}
          onNewLead={() => setNewOpen(true)}
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
        />

        {isLoading && <p className="text-muted-foreground">Carregando…</p>}
        {error && (
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Erro ao carregar"}
          </p>
        )}

        {data && (
          <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {COLUMNS.map((col) => (
                <Column key={col.id} col={col} leads={grouped[col.id]} onOpen={setSelectedId} />
              ))}
            </div>
            <DragOverlay>
              {activeLead ? <LeadCard lead={activeLead} dragging /> : null}
            </DragOverlay>
          </DndContext>
        )}

        <LeadDialog
          lead={selectedId ? leads.find((l) => l.id === selectedId) ?? null : null}
          onClose={() => setSelectedId(null)}
        />
        <NewLeadDialog open={newOpen} onClose={() => setNewOpen(false)} />
      </div>
    </div>
  );
}

function Column({
  col,
  leads,
  onOpen,
}: {
  col: { id: LeadStatus; title: string; accent: string };
  leads: Lead[];
  onOpen: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-2xl bg-white shadow-sm transition ${
        isOver ? "ring-2 ring-primary/50" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${col.accent}`} />
          <h2 className="text-sm font-semibold">{col.title}</h2>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {leads.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2 min-h-[200px]">
        {leads.length === 0 && (
          <p className="p-4 text-center text-xs text-muted-foreground">Sem leads</p>
        )}
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function waLink(phone: string | null | undefined, text?: string) {
  let digits = (phone ?? "").replace(/\D/g, "");
  // Normalize BR numbers: strip leading 0, add country code if missing
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!digits.startsWith("55")) digits = `55${digits}`;
  const base = `https://api.whatsapp.com/send/?phone=${digits}`;
  return text ? `${base}&text=${encodeURIComponent(text)}` : base;
}

function LeadCard({
  lead,
  dragging,
  onOpen,
}: {
  lead: Lead;
  dragging?: boolean;
  onOpen?: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onOpen?.(lead.id)}
      className={`cursor-pointer rounded-xl border bg-white p-3 shadow-sm hover:border-primary/40 ${
        isDragging ? "opacity-40" : ""
      } ${dragging ? "shadow-lg" : ""}`}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <p className="text-sm font-semibold">{lead.responsavel_nome}</p>
        <span className="text-[10px] text-muted-foreground">
          {new Date(lead.updated_at ?? lead.created_at).toLocaleDateString("pt-BR")}
        </span>
      </div>
      <a
        href={waLink(lead.telefone)}
        target="_blank"
        rel="noreferrer"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="text-xs text-primary hover:underline"
      >
        {lead.telefone}
      </a>
      <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
        {lead.crianca_nome && <p>🎂 {lead.crianca_nome}{lead.idade ? ` · ${lead.idade} anos` : ""}</p>}
        {lead.data_festa && <p>📅 {lead.data_festa}</p>}
        {lead.qtd_pessoas && <p>👥 {lead.qtd_pessoas} pessoas</p>}
        {lead.pacote && <p>🎁 {lead.pacote}</p>}
        {lead.valor != null && lead.valor !== "" && (
          <p className="font-semibold text-emerald-600">💰 {formatBRL(lead.valor)}</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm">{value ?? "—"}</p>
    </div>
  );
}

function guessArticlePtBr(nome: string): "do" | "da" {
  const first = nome.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const clean = first.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const femExceptions = new Set(["beatriz", "isis", "iris", "ines", "carmen", "miriam", "cris", "mercedes", "dolores"]);
  const mascExceptions = new Set(["luca", "noa", "isa", "juca", "cassia", "costa"]);
  const endsA = /a$/.test(clean);
  if (femExceptions.has(clean)) return "da";
  if (mascExceptions.has(clean)) return "do";
  return endsA ? "da" : "do";
}

function LeadDialog({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  const open = !!lead;
  const qc = useQueryClient();
  const saveValor = useServerFn(updateLeadValor);
  const [valorInput, setValorInput] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValorInput(lead?.valor != null && lead.valor !== "" ? String(lead.valor) : "");
  }, [lead?.id, lead?.valor]);

  const wa = lead
    ? waLink(
        lead.telefone,
        `Olá ${lead.responsavel_nome}! Aqui é da Casa Prime Eventos, sobre a festa${
          lead.crianca_nome ? ` ${guessArticlePtBr(lead.crianca_nome)} ${lead.crianca_nome}` : ""
        }. 🎉`,
      )
    : "#";

  const removeLead = useServerFn(deleteLead);
  const onDelete = async () => {
    if (!lead) return;
    if (!confirm(`Excluir o lead de ${lead.responsavel_nome}? Esta ação não pode ser desfeita.`)) return;
    try {
      const { error: delErr } = await supabase.from("leads_festas").delete().eq("id", lead.id);
      if (delErr) {
        await removeLead({ data: { id: lead.id } });
      }
      qc.setQueryData<{ leads: Lead[] }>(["leads"], (old) =>
        old ? { leads: old.leads.filter((l) => l.id !== lead.id) } : old,
      );
      onClose();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao excluir");
    }
  };

  const onSaveValor = async () => {
    if (!lead) return;
    const raw = valorInput.replace(/\./g, "").replace(",", ".").trim();
    const v = raw === "" ? null : Number(raw);
    if (v !== null && (!isFinite(v) || v < 0)) return;
    setSaving(true);
    try {
      const { error: valErr } = await supabase
        .from("leads_festas")
        .update({ valor: v, updated_at: new Date().toISOString() })
        .eq("id", lead.id);
      if (valErr) {
        await saveValor({ data: { id: lead.id, valor: v } });
      }
      qc.setQueryData<{ leads: Lead[] }>(["leads"], (old) =>
        old ? { leads: old.leads.map((l) => (l.id === lead.id ? { ...l, valor: v } : l)) } : old,
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        {lead && (
          <>
            <DialogHeader>
              <DialogTitle>{lead.responsavel_nome}</DialogTitle>
              <DialogDescription>
                Lead recebido em{" "}
                {new Date(lead.created_at).toLocaleString("pt-BR")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-2">
              <Field
                label="WhatsApp"
                value={
                  <a
                    href={waLink(lead.telefone)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {lead.telefone}
                  </a>
                }
              />
              <Field
                label="E-mail"
                value={
                  lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-primary hover:underline break-all"
                    >
                      {lead.email}
                    </a>
                  ) : null
                }
              />
              <Field label="Aniversariante" value={lead.crianca_nome} />
              <Field label="Idade" value={lead.idade} />
              <Field label="Data da festa" value={lead.data_festa} />
              <Field label="Nº de convidados" value={lead.qtd_pessoas} />
              <Field label="Pacote" value={lead.pacote} />
              <Field label="Status" value={lead.status} />
              <div className="col-span-2">
                <Field label="Tema / sonho" value={lead.tema} />
              </div>
              <div className="col-span-2">
                <Field label="Restrições / observações" value={lead.restricoes} />
              </div>
              <div className="col-span-2 rounded-lg border bg-muted/30 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                  Valor fechado
                </p>
                <div className="flex gap-2">
                  <Input
                    inputMode="decimal"
                    placeholder="Ex: 3500,00"
                    value={valorInput}
                    onChange={(e) => setValorInput(e.target.value)}
                    className="max-w-[180px]"
                  />
                  <Button onClick={onSaveValor} disabled={saving}>
                    {saving ? "Salvando…" : "Salvar valor"}
                  </Button>
                </div>
                {lead.valor != null && lead.valor !== "" && (
                  <p className="mt-2 text-sm text-emerald-600 font-semibold">
                    Atual: {formatBRL(lead.valor)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2 pt-2">
              <Button variant="destructive" onClick={onDelete}>
                Excluir lead
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Fechar
                </Button>
                <Button asChild>
                  <a href={wa} target="_blank" rel="noreferrer">
                    Iniciar conversa com {lead.responsavel_nome.split(" ")[0]}
                  </a>
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function NewLeadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const create = useServerFn(createLeadManual);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    responsavel_nome: "",
    telefone: "",
    email: "",
    crianca_nome: "",
    idade: "",
    data_festa: "",
    qtd_pessoas: "",
    pacote: "",
    tema: "",
    restricoes: "",
    valor: "",
    status: "novo" as LeadStatus,
  });

  useEffect(() => {
    if (!open) {
      setForm({
        responsavel_nome: "", telefone: "", email: "", crianca_nome: "",
        idade: "", data_festa: "", qtd_pessoas: "", pacote: "", tema: "",
        restricoes: "", valor: "", status: "novo",
      });
    }
  }, [open]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (form.responsavel_nome.trim().length < 2) return alert("Nome do responsável é obrigatório");
    if (form.telefone.trim().length < 8) return alert("Telefone inválido");
    setSaving(true);
    try {
      const valorNum = form.valor
        ? Number(form.valor.replace(/\./g, "").replace(",", "."))
        : null;
      await create({
        data: {
          responsavel_nome: form.responsavel_nome,
          telefone: form.telefone,
          email: form.email || null,
          crianca_nome: form.crianca_nome || null,
          idade: form.idade ? Number(form.idade) : null,
          data_festa: form.data_festa || null,
          qtd_pessoas: form.qtd_pessoas ? Number(form.qtd_pessoas) : null,
          pacote: form.pacote || null,
          tema: form.tema || null,
          restricoes: form.restricoes || null,
          valor: valorNum !== null && isFinite(valorNum) ? valorNum : null,
          status: form.status,
        },
      });
      qc.invalidateQueries({ queryKey: ["leads"] });
      onClose();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao cadastrar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo lead manual</DialogTitle>
          <DialogDescription>Cadastre um lead manualmente no CRM.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          <Input className="col-span-2" placeholder="Nome do responsável *" value={form.responsavel_nome} onChange={set("responsavel_nome")} />
          <Input placeholder="WhatsApp *" value={form.telefone} onChange={set("telefone")} />
          <Input placeholder="E-mail" type="email" value={form.email} onChange={set("email")} />
          <Input placeholder="Aniversariante" value={form.crianca_nome} onChange={set("crianca_nome")} />
          <Input placeholder="Idade" inputMode="numeric" value={form.idade} onChange={set("idade")} />
          <Input placeholder="Data da festa" value={form.data_festa} onChange={set("data_festa")} />
          <Input placeholder="Nº convidados" inputMode="numeric" value={form.qtd_pessoas} onChange={set("qtd_pessoas")} />
          <Input className="col-span-2" placeholder="Pacote" value={form.pacote} onChange={set("pacote")} />
          <Input className="col-span-2" placeholder="Tema / sonho" value={form.tema} onChange={set("tema")} />
          <Textarea className="col-span-2" placeholder="Restrições / observações" value={form.restricoes} onChange={set("restricoes")} />
          <Input placeholder="Valor (R$)" inputMode="decimal" value={form.valor} onChange={set("valor")} />
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.status}
            onChange={set("status")}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? "Salvando…" : "Cadastrar lead"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
