import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { listLeads } from "@/lib/leads.functions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/agenda")({
  head: () => ({ meta: [{ title: "Agenda · Casa Prime Eventos" }] }),
  component: AgendaPage,
});

type Lead = {
  id: string;
  status: string;
  responsavel_nome: string;
  telefone: string;
  crianca_nome: string | null;
  qtd_pessoas: number | null;
  pacote: string | null;
  data_festa: string | null;
  created_at: string;
};

const MESES: Record<string, number> = {
  janeiro: 0, jan: 0,
  fevereiro: 1, fev: 1,
  marco: 2, "março": 2, mar: 2,
  abril: 3, abr: 3,
  maio: 4, mai: 4,
  junho: 5, jun: 5,
  julho: 6, jul: 6,
  agosto: 7, ago: 7,
  setembro: 8, set: 8,
  outubro: 9, out: 9,
  novembro: 10, nov: 10,
  dezembro: 11, dez: 11,
};

function parseDataFesta(s: string | null): Date | null {
  if (!s) return null;
  const raw = s.trim().toLowerCase();
  const now = new Date();
  const currentYear = now.getFullYear();
  const rollYear = (mo: number, d: number) => {
    const dt = new Date(currentYear, mo, d);
    return dt.getTime() < new Date(currentYear, now.getMonth(), now.getDate()).getTime()
      ? currentYear + 1
      : currentYear;
  };
  // dd/mm/yyyy or dd-mm-yyyy
  let m = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (m) {
    const d = +m[1], mo = +m[2] - 1;
    let y = +m[3];
    if (y < 100) y += 2000;
    const dt = new Date(y, mo, d);
    return isNaN(dt.getTime()) ? null : dt;
  }
  // dd/mm (sem ano) → assume próximo ano se já passou
  m = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})$/);
  if (m) {
    const d = +m[1], mo = +m[2] - 1;
    if (mo < 0 || mo > 11 || d < 1 || d > 31) return null;
    const dt = new Date(rollYear(mo, d), mo, d);
    return isNaN(dt.getTime()) ? null : dt;
  }
  // yyyy-mm-dd
  m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const dt = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(dt.getTime()) ? null : dt;
  }
  // "30 de agosto de 2026" | "30 agosto" | "agosto 30"
  m = raw.match(/(\d{1,2})\s*(?:de\s+)?([a-zç]+)(?:\s*(?:de\s+)?(\d{2,4}))?/);
  if (m) {
    const mesKey = m[2].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const mo = MESES[mesKey];
    if (mo === undefined) return null;
    const d = +m[1];
    let y = m[3] ? +m[3] : rollYear(mo, d);
    if (y < 100) y += 2000;
    const dt = new Date(y, mo, d);
    return isNaN(dt.getTime()) ? null : dt;
  }
  // "agosto 30" / "agosto de 2026"
  m = raw.match(/^([a-zç]+)\s*(?:de\s+)?(\d{1,2})(?:\s*(?:de\s+)?(\d{2,4}))?$/);
  if (m) {
    const mesKey = m[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const mo = MESES[mesKey];
    if (mo === undefined) return null;
    const d = +m[2];
    let y = m[3] ? +m[3] : rollYear(mo, d);
    if (y < 100) y += 2000;
    const dt = new Date(y, mo, d);
    return isNaN(dt.getTime()) ? null : dt;
  }
  return null;

}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function AgendaPage() {
  const fetchLeads = useServerFn(listLeads);
  const { data, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetchLeads(),
  });
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  const leads = (data?.leads ?? []) as Lead[];

  const dated = useMemo(
    () =>
      leads
        .map((l) => ({ lead: l, date: parseDataFesta(l.data_festa) }))
        .filter((x): x is { lead: Lead; date: Date } => x.date !== null),
    [leads],
  );

  const eventDays = useMemo(
    () => dated.filter((d) => d.lead.status !== "agendada").map((d) => d.date),
    [dated],
  );
  const reservedDays = useMemo(
    () => dated.filter((d) => d.lead.status === "agendada").map((d) => d.date),
    [dated],
  );
  const semData = useMemo(() => leads.filter((l) => !parseDataFesta(l.data_festa)), [leads]);

  const doDia = useMemo(
    () => (selected ? dated.filter((d) => sameDay(d.date, selected)) : []),
    [dated, selected],
  );

  return (
    <div className="min-h-screen bg-muted/20 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/admin" className="text-sm text-muted-foreground hover:underline">← CRM</Link>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Agenda de festas</h1>
            <p className="text-sm text-muted-foreground">
              {reservedDays.length} reservadas · {eventDays.length} em negociação · {semData.length} sem data.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/relatorios">Relatórios</Link></Button>
            <Button variant="outline" asChild><Link to="/admin">CRM</Link></Button>
          </div>
        </header>

        {isLoading && <p className="text-muted-foreground">Carregando…</p>}

        {data && (
          <div className="grid gap-4 md:grid-cols-[auto_1fr]">
            <div className="rounded-2xl bg-white p-2 shadow-sm">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={selected}
                onSelect={setSelected}
                modifiers={{ hasEvent: eventDays, reserved: reservedDays }}
                modifiersClassNames={{
                  hasEvent:
                    "relative font-semibold text-primary after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
                  reserved:
                    "relative font-bold text-white bg-emerald-600 hover:bg-emerald-600 focus:bg-emerald-600 rounded-md",
                }}
                className={cn("p-3 pointer-events-auto")}
              />
              <div className="mt-2 flex flex-wrap gap-3 px-2 pb-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded bg-emerald-600" /> Reservada
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" /> Em negociação
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold">
                {selected
                  ? selected.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
                  : "Selecione uma data"}
              </h2>
              {doDia.length === 0 && (
                <p className="rounded-xl bg-white p-4 text-sm text-muted-foreground shadow-sm">
                  Nenhuma festa nesta data.
                </p>
              )}
              {doDia.map(({ lead }) => (
                <div key={lead.id} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{lead.responsavel_nome}</p>
                      {lead.crianca_nome && (
                        <p className="text-sm text-muted-foreground">🎂 {lead.crianca_nome}</p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs",
                        lead.status === "agendada"
                          ? "bg-emerald-600 text-white"
                          : "bg-muted",
                      )}
                    >
                      {lead.status === "agendada" ? "Reservada" : lead.status}
                    </span>
                  </div>
                  <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                    {lead.qtd_pessoas && <p>👥 {lead.qtd_pessoas} pessoas</p>}
                    {lead.pacote && <p>🎁 {lead.pacote}</p>}
                    <p>📱 {lead.telefone}</p>
                  </div>
                </div>
              ))}

              {semData.length > 0 && (
                <details className="rounded-xl bg-white p-4 shadow-sm">
                  <summary className="cursor-pointer text-sm font-medium">
                    Leads sem data definida ({semData.length})
                  </summary>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {semData.map((l) => (
                      <li key={l.id}>
                        {l.responsavel_nome}
                        {l.data_festa ? ` — "${l.data_festa}"` : ""}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
