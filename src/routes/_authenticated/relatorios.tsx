import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { listLeads } from "@/lib/leads.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CrmNav } from "@/components/admin/CrmNav";
import { waLink } from "@/lib/whatsapp";
import {
  Trophy,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Percent,
  Search,
  MessageCircle,
  Filter,
  FileSpreadsheet,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios & Valores · Casa Prime Eventos" }] }),
  component: ReportsPage,
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
  valor: number | string | null;
  restricoes: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; badgeBg: string; textCol: string }
> = {
  novo: {
    label: "Novo contato",
    color: "#eab308",
    badgeBg: "bg-amber-100",
    textCol: "text-amber-800",
  },
  em_atendimento: {
    label: "Em atendimento",
    color: "#8641df",
    badgeBg: "bg-purple-100",
    textCol: "text-purple-800",
  },
  agendada: {
    label: "Festa agendada",
    color: "#3b82f6",
    badgeBg: "bg-blue-100",
    textCol: "text-blue-800",
  },
  finalizada: {
    label: "Fechada / Realizada",
    color: "#10b981",
    badgeBg: "bg-emerald-100",
    textCol: "text-emerald-800",
  },
  nao_fechou: {
    label: "Não fechou / Perdido",
    color: "#ef4444",
    badgeBg: "bg-rose-100",
    textCol: "text-rose-800",
  },
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
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data: directLeads, error } = await supabase
        .from("leads_festas")
        .select("*")
        .order("updated_at", { ascending: false });
      if (!error && directLeads) {
        return { leads: directLeads as Lead[] };
      }
      return await fetchLeads();
    },
  });

  const [range, setRange] = useState<"7" | "30" | "90" | "365" | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const leads = (data?.leads ?? []) as Lead[];

  // 1. Filtragem por Período
  const leadsInPeriod = useMemo(() => {
    if (range === "all") return leads;
    const days = Number(range);
    const cutoff = Date.now() - days * 86400_000;
    return leads.filter((l) => new Date(l.created_at).getTime() >= cutoff);
  }, [leads, range]);

  // 2. Estatísticas Consolidadas
  const stats = useMemo(() => {
    let totalLeads = 0;
    let fechadosQtd = 0;
    let fechadosValor = 0;
    let perdidosQtd = 0;
    let perdidosValor = 0;
    let emAndamentoQtd = 0;
    let emAndamentoValor = 0;

    const byStatus: Record<string, { count: number; valor: number }> = {
      novo: { count: 0, valor: 0 },
      em_atendimento: { count: 0, valor: 0 },
      agendada: { count: 0, valor: 0 },
      finalizada: { count: 0, valor: 0 },
      nao_fechou: { count: 0, valor: 0 },
    };

    const byPacote: Record<string, { count: number; valor: number; fechados: number }> = {};

    for (const l of leadsInPeriod) {
      totalLeads += 1;
      const st = l.status in byStatus ? l.status : "novo";
      const v = toNum(l.valor);

      byStatus[st].count += 1;
      byStatus[st].valor += v;

      if (st === "finalizada") {
        fechadosQtd += 1;
        fechadosValor += v;
      } else if (st === "nao_fechou") {
        perdidosQtd += 1;
        perdidosValor += v;
      } else {
        emAndamentoQtd += 1;
        emAndamentoValor += v;
      }

      const pacoteNome = l.pacote || "Não especificado";
      if (!byPacote[pacoteNome]) {
        byPacote[pacoteNome] = { count: 0, valor: 0, fechados: 0 };
      }
      byPacote[pacoteNome].count += 1;
      byPacote[pacoteNome].valor += v;
      if (st === "finalizada") {
        byPacote[pacoteNome].fechados += 1;
      }
    }

    const taxaConversao = totalLeads > 0 ? (fechadosQtd / totalLeads) * 100 : 0;
    const taxaPerda = totalLeads > 0 ? (perdidosQtd / totalLeads) * 100 : 0;
    const ticketMedio = fechadosQtd > 0 ? fechadosValor / fechadosQtd : 0;

    return {
      totalLeads,
      fechadosQtd,
      fechadosValor,
      perdidosQtd,
      perdidosValor,
      emAndamentoQtd,
      emAndamentoValor,
      taxaConversao,
      taxaPerda,
      ticketMedio,
      byStatus,
      byPacote,
    };
  }, [leadsInPeriod]);

  // 3. Filtragem para a Tabela Detalhada de Valores
  const leadsTabela = useMemo(() => {
    return leadsInPeriod.filter((l) => {
      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "em_andamento"
            ? l.status === "novo" || l.status === "em_atendimento" || l.status === "agendada"
            : l.status === statusFilter;

      if (!matchStatus) return false;

      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        l.responsavel_nome?.toLowerCase().includes(term) ||
        l.telefone?.includes(term) ||
        l.email?.toLowerCase().includes(term) ||
        l.pacote?.toLowerCase().includes(term) ||
        l.crianca_nome?.toLowerCase().includes(term)
      );
    });
  }, [leadsInPeriod, statusFilter, searchTerm]);

  const exportToCSV = () => {
    if (leadsTabela.length === 0) return;
    const headers = [
      "ID",
      "Responsável",
      "Telefone",
      "E-mail",
      "Aniversariante",
      "Idade",
      "Data Festa",
      "Convidados",
      "Pacote",
      "Tema",
      "Status",
      "Valor (R$)",
      "Criado em",
    ];

    const rows = leadsTabela.map((l) => [
      l.id,
      `"${l.responsavel_nome || ""}"`,
      `"${l.telefone || ""}"`,
      `"${l.email || ""}"`,
      `"${l.crianca_nome || ""}"`,
      l.idade ?? "",
      `"${l.data_festa || ""}"`,
      l.qtd_pessoas ?? "",
      `"${l.pacote || ""}"`,
      `"${l.tema || ""}"`,
      l.status,
      toNum(l.valor),
      `"${new Date(l.created_at).toLocaleString("pt-BR")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_leads_casaprime_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-muted/20 p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px] w-full">
        {/* Navegação Compartilhada do CRM */}
        <CrmNav
          totalLeads={leads.length}
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
        />

        {/* Topo do Relatório: Título e Filtro de Período */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
              Relatórios & Análise de Vendas
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe leads fechados, perdidos, taxas de conversão e faturamento em tempo real.
            </p>
          </div>

          {/* Filtro de Período */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-white p-1.5 shadow-sm border border-purple-100">
            <span className="px-2.5 text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Período:
            </span>
            {[
              { id: "7", label: "7 dias" },
              { id: "30", label: "30 dias" },
              { id: "90", label: "90 dias" },
              { id: "365", label: "Este ano" },
              { id: "all", label: "Todo o histórico" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setRange(p.id as any)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  range === p.id
                    ? "bg-[#8641df] text-white shadow-sm"
                    : "text-gray-600 hover:text-purple-900 hover:bg-purple-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <p className="text-muted-foreground">Carregando métricas e relatórios do Supabase…</p>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-6">
            {/* 1. CARDS DE DESTAQUE (KPIS EXECUTIVOS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Card 1: Leads Fechados */}
              <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Leads Fechados
                  </span>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Trophy className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-emerald-950">
                    {stats.fechadosQtd}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    ({stats.taxaConversao.toFixed(1)}% de conversão)
                  </span>
                </div>
                <div className="mt-2 text-xs font-semibold text-emerald-800">
                  Total fechado: <strong>{fmtBRL(stats.fechadosValor)}</strong>
                </div>
              </div>

              {/* Card 2: Leads Perdidos */}
              <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/70 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    Leads Perdidos
                  </span>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-100 text-rose-700">
                    <XCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-rose-950">
                    {stats.perdidosQtd}
                  </span>
                  <span className="text-xs font-bold text-rose-700">
                    ({stats.taxaPerda.toFixed(1)}% perda)
                  </span>
                </div>
                <div className="mt-2 text-xs font-semibold text-rose-800">
                  Perda estimada: <strong>{fmtBRL(stats.perdidosValor)}</strong>
                </div>
              </div>

              {/* Card 3: Leads em Negociação */}
              <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50/70 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                    Em Negociação
                  </span>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-100 text-purple-700">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-purple-950">
                    {stats.emAndamentoQtd}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    leads ativos
                  </span>
                </div>
                <div className="mt-2 text-xs font-semibold text-purple-800">
                  Potencial: <strong>{fmtBRL(stats.emAndamentoValor)}</strong>
                </div>
              </div>

              {/* Card 4: Faturamento Fechado Total */}
              <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                    Receita Fechada
                  </span>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-blue-700">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-display text-2xl sm:text-3xl font-black text-blue-950">
                    {fmtBRL(stats.fechadosValor)}
                  </span>
                </div>
                <div className="mt-2 text-xs font-semibold text-blue-800">
                  Festas contratadas
                </div>
              </div>

              {/* Card 5: Ticket Médio Fechado */}
              <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/70 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Ticket Médio
                  </span>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700">
                    <Percent className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-display text-2xl sm:text-3xl font-black text-amber-950">
                    {fmtBRL(stats.ticketMedio)}
                  </span>
                </div>
                <div className="mt-2 text-xs font-semibold text-amber-800">
                  Média por festa fechada
                </div>
              </div>
            </div>

            {/* 2. FUNIL DE VENDAS & DESEMPENHO POR PACOTE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribuição por Status */}
              <section className="rounded-3xl bg-white p-6 shadow-sm border border-purple-100">
                <h2 className="font-display text-lg font-bold text-gray-900 mb-1">
                  Distribuição do Funil de Leads
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Volume de leads e valor associado a cada etapa do atendimento
                </p>

                <div className="space-y-4">
                  {Object.entries(STATUS_CONFIG).map(([statusKey, cfg]) => {
                    const st = stats.byStatus[statusKey] || { count: 0, valor: 0 };
                    const pct = stats.totalLeads > 0 ? (st.count / stats.totalLeads) * 100 : 0;
                    return (
                      <div key={statusKey}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: cfg.color }}
                            />
                            <span className="font-semibold text-gray-800">{cfg.label}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-900">{st.count} leads</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({fmtBRL(st.valor)}) · {pct.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: cfg.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Vendas por Pacote */}
              <section className="rounded-3xl bg-white p-6 shadow-sm border border-purple-100">
                <h2 className="font-display text-lg font-bold text-gray-900 mb-1">
                  Desempenho por Pacote de Festa
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Volume de interesse e faturamento total por modalidade de buffet
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3">Pacote</th>
                        <th className="pb-3 text-center">Leads</th>
                        <th className="pb-3 text-center">Fechados</th>
                        <th className="pb-3 text-right">Valor Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {Object.entries(stats.byPacote)
                        .sort((a, b) => b[1].valor - a[1].valor)
                        .map(([nome, pData]) => (
                          <tr key={nome} className="hover:bg-purple-50/40 transition">
                            <td className="py-3 font-semibold text-gray-900">{nome}</td>
                            <td className="py-3 text-center text-gray-700">{pData.count}</td>
                            <td className="py-3 text-center">
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                                {pData.fechados}
                              </span>
                            </td>
                            <td className="py-3 text-right font-bold text-[#8641df]">
                              {fmtBRL(pData.valor)}
                            </td>
                          </tr>
                        ))}
                      {Object.keys(stats.byPacote).length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-muted-foreground">
                            Nenhum lead encontrado neste período.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* 3. RELATÓRIO DETALHADO DE VALORES & CLIENTES */}
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-purple-100">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-gray-900">
                    Relatório Detalhado de Valores por Lead
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Exibindo {leadsTabela.length} de {leadsInPeriod.length} lead(s) filtrados.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Busca Rápida */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, telefone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-10 rounded-xl pl-9 text-xs sm:text-sm border-purple-100"
                    />
                  </div>

                  {/* Exportar CSV */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCSV}
                    disabled={leadsTabela.length === 0}
                    className="rounded-xl border-purple-200 text-purple-900 font-bold gap-1.5 h-10 hover:bg-purple-50"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Exportar CSV</span>
                  </Button>
                </div>
              </div>

              {/* Filtros de Status (Tabs Rápidas) */}
              <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-2">
                  <Filter className="h-3.5 w-3.5" /> Filtrar:
                </span>
                {[
                  { id: "all", label: "Todos os leads" },
                  { id: "finalizada", label: "🏆 Fechados" },
                  { id: "nao_fechou", label: "❌ Perdidos" },
                  { id: "em_andamento", label: "⏳ Em negociação" },
                  { id: "agendada", label: "📅 Agendadas" },
                  { id: "em_atendimento", label: "💬 Em atendimento" },
                  { id: "novo", label: "🆕 Novos" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      statusFilter === f.id
                        ? "bg-[#8641df] text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-900"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Tabela de Leads */}
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3.5">Cliente / Contato</th>
                      <th className="p-3.5">Aniversariante</th>
                      <th className="p-3.5">Data Festa</th>
                      <th className="p-3.5">Pacote & Convidados</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Valor Registrado</th>
                      <th className="p-3.5 text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leadsTabela.map((lead) => {
                      const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.novo;
                      const val = toNum(lead.valor);
                      return (
                        <tr key={lead.id} className="hover:bg-purple-50/40 transition">
                          <td className="p-3.5">
                            <div className="font-bold text-gray-900">
                              {lead.responsavel_nome}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {lead.telefone}
                            </div>
                            {lead.email && (
                              <div className="text-[11px] text-purple-700 font-medium">
                                {lead.email}
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            {lead.crianca_nome ? (
                              <div>
                                <span className="font-medium text-gray-800">
                                  {lead.crianca_nome}
                                </span>
                                {lead.idade && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    ({lead.idade} anos)
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="font-medium text-gray-800">
                              {lead.data_festa || "A definir"}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-gray-900">
                              {lead.pacote || "Sem pacote"}
                            </div>
                            {lead.qtd_pessoas && (
                              <div className="text-xs text-muted-foreground">
                                {lead.qtd_pessoas} convidados
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${cfg.badgeBg} ${cfg.textCol}`}
                            >
                              {cfg.label}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {val > 0 ? (
                              <span className="font-display font-extrabold text-emerald-600 text-base">
                                {fmtBRL(val)}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">
                                Não informado
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-center">
                            <a
                              href={waLink(
                                lead.telefone,
                                `Olá ${lead.responsavel_nome}! Aqui é da Casa Prime Eventos, sobre a festa no nosso espaço. 🎉`,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition shadow-sm"
                              title="Iniciar conversa no WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}

                    {leadsTabela.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                          Nenhum lead encontrado para os filtros selecionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
