import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChefHat, Sparkles, PartyPopper, Check, MessageCircle, CalendarCheck, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/pacotes/")({
  head: () => ({
    meta: [
      { title: "Pacotes — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Conheça os pacotes da Casa Prime Eventos: com buffet, sem buffet e festa completa. Escolha o formato ideal para a sua celebração.",
      },
      { property: "og:title", content: "Pacotes — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Formatos de festa para todos os estilos.",
      },
    ],
  }),
  component: PacotesHub,
});

const opcoes = [
  {
    to: "/pacotes/com-buffet",
    titulo: "Pacotes com Buffet",
    descricao:
      "Pirulito, Diversão e Churrasco: cardápios completos, prontos para servir.",
    icon: ChefHat,
    inclui: ["Cardápio completo", "Equipe de cozinha", "Bebidas inclusas"],
  },
  {
    to: "/pacotes/sem-buffet",
    titulo: "Pacotes sem Buffet",
    descricao:
      "Aluguel do espaço com estrutura, sem a parte de alimentação. Você organiza o cardápio.",
    icon: Sparkles,
    inclui: ["Espaço completo", "Piscina aquecida", "Brinquedos inclusos"],
  },
  {
    to: "/pacotes/festa-completa",
    titulo: "Festa Completa",
    descricao:
      "Tudo em um só lugar: decoração, buffet, brinquedos, equipe e mais.",
    icon: PartyPopper,
    inclui: ["Decoração temática", "Buffet + bebidas", "Recreação e monitores"],
  },
] as const;

const beneficios = [
  { icon: CalendarCheck, titulo: "Data garantida", texto: "Reserva confirmada no ato, sem stress." },
  { icon: Users, titulo: "Equipe dedicada", texto: "Recepção, cozinha e recreação treinadas." },
  { icon: ShieldCheck, titulo: "Estrutura segura", texto: "Espaço fechado com piscina aquecida e monitores." },
];

function PacotesHub() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#bfa2ff]">
          Pacotes 2026
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Escolha o formato da sua festa
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
          Três formatos pensados para celebrar do seu jeito. Clique em um deles
          para ver todos os detalhes.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {opcoes.map((o) => (
          <Link
            key={o.to}
            to={o.to}
            className="hover-lift group relative flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white p-8 shadow-xl shadow-purple-900/5 hover:border-[#bfa2ff]/30"
          >
            <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-[#bfa2ff]/10 text-[#bfa2ff] transition-colors group-hover:bg-[#bfa2ff] group-hover:text-white">
              <o.icon className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#14092e]">
              {o.titulo}
            </h2>
            <p className="mt-2 text-sm text-[#14092e]/70">{o.descricao}</p>
            <ul className="mt-5 space-y-2 text-sm text-[#14092e]/80">
              {o.inclui.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#bfa2ff]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[#bfa2ff]">
              Ver detalhes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Benefícios */}
      <div className="mt-20">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#bfa2ff]">
            Por que a Casa Prime
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Tudo pronto pro grande dia
          </h2>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {beneficios.map((b) => (
            <div key={b.titulo} className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-md">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#bfa2ff]/10 text-[#bfa2ff]">
                <b.icon className="h-6 w-6" />
              </div>
              <div className="mt-3 font-display text-lg font-bold text-[#14092e]">{b.titulo}</div>
              <p className="mt-1 text-sm text-[#14092e]/70">{b.texto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ rápido */}
      <div className="mt-20 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-md">
          <div className="font-display text-lg font-bold text-[#14092e]">Posso personalizar o pacote?</div>
          <p className="mt-2 text-sm text-[#14092e]/70">Sim! Todos os formatos aceitam ajustes de cardápio, decoração e serviços extras.</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-md">
          <div className="font-display text-lg font-bold text-[#14092e]">Qual a duração da festa?</div>
          <p className="mt-2 text-sm text-[#14092e]/70">4 horas de festa, com tempo extra para montagem e desmontagem da equipe.</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-md">
          <div className="font-display text-lg font-bold text-[#14092e]">Quantos convidados cabem?</div>
          <p className="mt-2 text-sm text-[#14092e]/70">Nosso espaço acomoda confortavelmente até 120 convidados entre adultos e crianças.</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-md">
          <div className="font-display text-lg font-bold text-[#14092e]">Como reservo a data?</div>
          <p className="mt-2 text-sm text-[#14092e]/70">Fale com a gente no WhatsApp — confirmamos disponibilidade e enviamos o contrato na hora.</p>
        </div>
      </div>

      {/* CTA final */}
      <div className="mt-16 rounded-3xl bg-gradient-to-br from-[#bfa2ff] to-[#14092e] p-8 text-center text-white shadow-2xl sm:p-12">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Ainda em dúvida sobre qual pacote escolher?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">Nosso time monta uma proposta sob medida em poucos minutos.</p>
        <Button asChild size="lg" className="mt-6 rounded-full bg-white font-display text-[#bfa2ff] hover:bg-white/90">
          <a href={waLink("Olá! Quero ajuda para escolher o pacote ideal.")} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-5 w-5" />
            Falar no WhatsApp
          </a>
        </Button>
      </div>
    </section>
  );
}
