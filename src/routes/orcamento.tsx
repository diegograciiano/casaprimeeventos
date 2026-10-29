import { createFileRoute } from "@tanstack/react-router";
import { ChatbotUI } from "@/components/site/ChatbotUI";
import { Sparkles, ShieldCheck, HeartHandshake, Gift, Clock, Waves } from "lucide-react";

export const Route = createFileRoute("/orcamento")({
  component: OrcamentoPage,
  head: () => ({
    meta: [
      { title: "Simular Orçamento — Casa Prime Eventos Goiânia" },
      {
        name: "description",
        content:
          "Simule seu orçamento de festa infantil na Casa Prime em Goiânia com valores transparentes, brinquedos, piscina aquecida e buffet completo.",
      },
      { property: "og:title", content: "Simulador de Orçamento de Festa Infantil — Casa Prime" },
      {
        property: "og:description",
        content: "Valores tabelados e simulação interativa direto com a nossa consultoria.",
      },
    ],
  }),
});

function OrcamentoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f9f5ff] via-white to-[#fffbeb] py-8 sm:py-12">
      {/* Elementos decorativos infantis de fundo */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* Cabeçalho acolhedor focado nos pais */}
        <div className="text-left mb-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcb03] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#14092e] shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>Simulador de Orçamento Online</span>
          </div>

          <h1 className="mt-3.5 font-display text-3xl sm:text-5xl font-bold text-[#14092e] leading-tight">
            A festa dos sonhos do seu filho,{" "}
            <span className="text-[#8641df]">sem surpresas no orçamento</span>
          </h1>

          <p className="mt-3.5 max-w-2xl text-base sm:text-lg text-gray-600 leading-relaxed">
            Responda algumas perguntinhas rápidas com a <strong>Sofia</strong>, veja o valor de referência oficial na hora e envie o resumo completo direto para o WhatsApp do dono da Casa Prime.
          </p>

          {/* Destaques rápidos */}
          <div className="mt-5 flex flex-wrap items-center justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-sm border border-purple-100">
              <Clock className="h-4 w-4 text-purple-600" /> 12h de locação exclusiva
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-sm border border-purple-100">
              <Waves className="h-4 w-4 text-blue-500" /> Piscina aquecida
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-sm border border-purple-100">
              <Gift className="h-4 w-4 text-pink-500" /> Algodão doce & pipoca liberados
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-sm border border-purple-100">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Monitores e equipe completa
            </span>
          </div>
        </div>

        {/* Chatbot interativo em destaque */}
        <ChatbotUI mode="page" />
      </div>
    </div>
  );
}
