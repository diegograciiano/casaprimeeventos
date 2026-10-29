import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/site/ChatbotContext";
import { pacotes, FAIXAS_PESSOAS, inclusoEmTodos } from "@/data/pacotes";
import { useState } from "react";
import { TabelaPacotesValores } from "@/components/site/TabelaPacotesValores";

export const Route = createFileRoute("/pacotes/com-buffet")({
  head: () => ({
    meta: [
      { title: "Pacotes com Buffet & Valores — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Cardápios e valores oficiais dos pacotes Pirulito, Diversão e Churrasco da Casa Prime Eventos em Goiânia. 12h de festa, buffet e brinquedos.",
      },
      { property: "og:title", content: "Pacotes de Festa com Buffet — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Cardápio completo de cada pacote, do buffet aos brinquedos com valores de referência.",
      },
    ],
  }),
  component: PacotesComBuffet,
});

function PacotesComBuffet() {
  const { openChat } = useChatbot();
  const [pessoas, setPessoas] = useState<number>(70);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
      {/* Top Header */}
      <div className="text-left max-w-4xl">
        <span className="rounded-full bg-purple-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-purple-700">
          Tabela Oficial 2026
        </span>
        <h1 className="mt-3.5 font-display text-3xl sm:text-5xl font-bold text-[#14092e] leading-tight">
          Cardápio completo &amp; valores dos pacotes
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-gray-600 leading-relaxed">
          Todos os nossos pacotes incluem <strong>12 horas de locação</strong> do espaço exclusivo, <strong>piscina aquecida</strong>, <strong>brinquedos com monitores</strong>, <strong>barraquinha de algodão doce e pipoca ilimitados</strong> e equipe Prime completa.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row justify-start gap-3.5">
          <Link
            to="/orcamento"
            className="w-full sm:w-auto text-center rounded-2xl bg-[#ffcb03] px-7 py-3.5 font-display text-base font-bold text-[#14092e] shadow-md hover:bg-[#ebd200] transition-all"
          >
            <Sparkles className="mr-2 inline-block h-4 w-4" />
            Simular Orçamento no Chatbot
          </Link>
          <a
            href="#lista-pacotes"
            className="w-full sm:w-auto text-center rounded-2xl border border-gray-200 bg-white px-7 py-3.5 text-base font-bold text-gray-700 hover:bg-gray-50"
          >
            Ver Cardápio Detalhado ↓
          </a>
        </div>
      </div>

      {/* Simulador sutil de convidados e valores */}
      <div className="mt-12">
        <TabelaPacotesValores />
      </div>

      {/* Lista detalhada dos pacotes */}
      <div id="lista-pacotes" className="mt-20 space-y-16">
        <div className="text-left">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#14092e] leading-tight">
            O que está incluso em cada opção:
          </h2>
          <div className="mt-2.5 h-1.5 w-16 rounded-full bg-[#8641df]" />
        </div>

        {pacotes.map((p, idx) => (
          <div
            key={p.id}
            className={`hover-lift grid gap-8 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:p-10 ${
              idx % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src={p.img}
                alt={`Pacote ${p.nome}`}
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 rounded-full bg-[#14092e]/80 px-4 py-1.5 text-xs font-bold uppercase text-[#ffcb03] backdrop-blur-sm">
                {p.tag}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8641df]">
                {p.subtitulo}
              </div>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#14092e] leading-snug">
                {p.nome}
              </h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {p.secoes.map((sec) => (
                  <div key={sec.titulo} className="rounded-2xl bg-purple-50/50 p-4">
                    <div className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-[#8641df]">
                      {sec.titulo}
                    </div>
                    <ul className="space-y-1.5">
                      {sec.itens.map((i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-normal">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Tabela de valores resumida */}
              <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50/70 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2">
                  Valores tabelados para este pacote:
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {p.valores.map((v) => (
                    <div key={v.pessoas} className="rounded-xl bg-white p-2 text-center shadow-xs">
                      <div className="text-[11px] text-gray-500">{v.pessoas} pessoas</div>
                      <div className="font-display text-xs font-bold text-purple-900">{v.valorFormatado}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => openChat(p.id)}
                  size="lg"
                  className="rounded-2xl bg-[#ffcb03] font-display font-black text-[#14092e] shadow-md hover:bg-[#ebd200]"
                >
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                  Simular este pacote no Chatbot
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-2xl"
                >
                  <Link to="/orcamento">
                    Ir para o Simulador Completo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
