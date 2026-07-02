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
        <div className="text-xs font-semibold uppercase tracking-widest text-[#8641df]">
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
            className="hover-lift group relative flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white p-8 shadow-xl shadow-purple-900/5 hover:border-[#8641df]/30"
          >
            <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-[#8641df]/10 text-[#8641df] transition-colors group-hover:bg-[#8641df] group-hover:text-white">
              <o.icon className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#14092e]">
              {o.titulo}
            </h2>
            <p className="mt-2 text-sm text-[#14092e]/70">{o.descricao}</p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[#8641df]">
              Ver detalhes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
