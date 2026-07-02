import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { listLeads } from "@/lib/leads.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios · Casa Prime Eventos" }] }),
  component: ReportsPage,
});

type Lead = {
  id: string;
  status: string;
  responsavel_nome: string;
  pacote: string | null;
  valor: number | string | null;
  data_festa: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo contato",
  em_atendimento: "Em atendimento",
  agendada: "Festa agendada",
  finalizada: "Finalizada",
  nao_fechou: "Não fechou",
};

function toNum(v: number | string | null | undefined): number {
  if (v === null || v === undefined || v === "") return 0;
  const n = typeof v === "number" ? v : Number(v);
  return isFinite(n) ? n : 0;
}
function fmtBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ReportsPage() {
  const fetchLeads = useServerFn(listLeads);
  const { data, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetchLeads(),
  });

  const [range, setRange] = useState<"7" | "30" | "90" | "all">("30");

  const leads = (data?.leads ?? []) as Lead[];

  const filtered = useMemo(() => {
    if (range === "all") return leads;
    const days = Number(range);
    const cutoff = Date.now() - days * 86400_000;
    return leads.filter((l) => new Date(l.created_at).getTime() >= cutoff);
  }, [leads, range]);

  const stats = useMemo(() => {
    const byStatus: Record<string, { count: number; valor: number }> = {};
    for (const s of Object.keys(STATUS_LABEL)) byStatus[s] = { count: 0, valor: 0 };
    let total = 0;
    let receita = 0;
    let fechadas = 0;
    let agendadas = 0;
    let ticketSoma = 0;
    let ticketQtd = 0;
    const byPacote: Record<string, { count: number; valor: number }> = {};

    for (const l of filtered) {
      total += 1;
      const status = l.status in byStatus ? l.status : "novo";
      const v = toNum(l.valor);
      byStatus[status].count += 1;
      byStatus[status].valor += v;
      if (status === "finalizada" || status === "agendada") {
        receita += v;
        if (status === "finalizada") fechadas += 1;
        if (status === "agendada") agendadas += 1;
        if (v > 0) { ticketSoma += v; ticketQtd += 1; }
      }
      const pac = l.pacote ?? "Sem pacote";
      byPacote[pac] = byPacote[pac] ?? { count: 0, valor: 0 };
      byPacote[pac].count += 1;
      byPacote[pac].valor += v;
    }

    const conv = total > 0 ? ((fechadas + agendadas) / total) * 100 : 0;
    const ticket = ticketQtd > 0 ? ticketSoma / ticketQtd : 0;

    return { byStatus, byPacote, total, receita, fechadas, agendadas, conv, ticket };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-muted/20 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/admin" className="text-sm text-muted-foreground hover:underline">
              ← CRM
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Relatórios</h1>
            <p className="text-sm text-muted-foreground">Visão geral dos leads e receita.</p>
          </div>
          <div className="flex gap-2">
            {(["7", "30", "90", "all"] as const).map((r) => (
              <Button
                key={r}
                variant={range === r ? "default" : "outline"}
                size="sm"
                onClick={() => setRange(r)}
              >
                {r === "all" ? "Tudo" : `${r} dias`}
              </Button>
            ))}
          </div>
        </header>

        {isLoading && <p className="text-muted-foreground">Carregando…</p>}

        {data && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 mb-6">
              <Kpi label="Leads no período" value={String(stats.total)} />
              <Kpi label="Festas agendadas" value={String(stats.agendadas)} />
              <Kpi label="Festas fechadas" value={String(stats.fechadas)} />
              <Kpi label="Receita" value={fmtBRL(stats.receita)} accent />
              <Kpi label="Ticket médio" value={fmtBRL(stats.ticket)} />
            </div>
            <div className="mb-2 text-xs text-muted-foreground">
              Taxa de conversão: <b>{stats.conv.toFixed(1)}%</b>
            </div>

            <section className="rounded-2xl bg-white p-4 shadow-sm mb-6">
              <h2 className="mb-3 font-semibold">Por status</h2>
              <div className="space-y-2">
                {Object.entries(stats.byStatus).map(([s, v]) => {
                  const pct = stats.total > 0 ? (v.count / stats.total) * 100 : 0;
                  return (
                    <div key={s}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{STATUS_LABEL[s]}</span>
                        <span className="text-muted-foreground">
                          {v.count} · {fmtBRL(v.valor)}
                        </span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold">Por pacote</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2">Pacote</th>
                      <th className="py-2">Leads</th>
                      <th className="py-2">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.byPacote)
                      .sort((a, b) => b[1].valor - a[1].valor)
                      .map(([p, v]) => (
                        <tr key={p} className="border-t">
                          <td className="py-2">{p}</td>
                          <td className="py-2">{v.count}</td>
                          <td className="py-2 font-medium">{fmtBRL(v.valor)}</td>
                        </tr>
                      ))}
                    {Object.keys(stats.byPacote).length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-muted-foreground">
                          Nenhum lead no período.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-bold ${accent ? "text-emerald-600" : ""}`}>{value}</p>
    </div>
  );
}
