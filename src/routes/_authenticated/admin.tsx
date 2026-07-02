import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
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
import { listLeads, updateLeadStatus, LEAD_STATUSES, type LeadStatus } from "@/lib/leads.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
  updated_at: string;
  created_at: string;
};

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
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetchLeads(),
    refetchInterval: 15000,
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
      await updateStatus({ data: { id: leadId, status: newStatus } });
    } catch {
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              ← site
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">CRM · Casa Prime Eventos</h1>
            <p className="text-sm text-muted-foreground">
              Arraste os cards entre as colunas. {leads.length} lead(s).
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>Atualizar</Button>
            <Button variant="ghost" onClick={signOut}>Sair</Button>
          </div>
        </header>

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
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
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
  const wa = lead
    ? waLink(
        lead.telefone,
        `Olá ${lead.responsavel_nome}! Aqui é da Casa Prime Eventos, sobre a festa${
          lead.crianca_nome ? ` ${guessArticlePtBr(lead.crianca_nome)} ${lead.crianca_nome}` : ""
        }. 🎉`,
      )
    : "#";
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
              <Field label="E-mail" value={lead.email} />
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
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button asChild>
                <a href={wa} target="_blank" rel="noreferrer">
                  Iniciar conversa com {lead.responsavel_nome.split(" ")[0]}
                </a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
