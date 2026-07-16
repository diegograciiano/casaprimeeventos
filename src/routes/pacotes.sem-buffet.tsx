import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/site/ChatbotContext";

import salaoAzul from "@/assets/salao-azul.jpg.asset.json";
import salaoRosa from "@/assets/salao-rosa.jpg.asset.json";
import decoracaoSafari from "@/assets/decoracao-safari.jpg.asset.json";
import algodaoDoce from "@/assets/algodao-doce.jpg.asset.json";

export const Route = createFileRoute("/pacotes/sem-buffet")({
  head: () => ({
    meta: [
      { title: "Pacotes sem Buffet — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Pacotes Bombom, Chiclete, Sorvete e Churros da Casa Prime Eventos: aluguel do espaço com estrutura completa e brinquedos, sem buffet.",
      },
      { property: "og:title", content: "Pacotes sem Buffet — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Estrutura completa com brinquedos para você montar sua festa.",
      },
    ],
  }),
  component: SemBuffet,
});

type Secao = { titulo: string; itens: string[] };
type Pacote = {
  id: string;
  nome: string;
  capacidade: string;
  img: string;
  secoes: Secao[];
};

const pacotes: Pacote[] = [
  {
    id: "Pacote Bombom (Sem Buffet)",
    nome: "Bombom",
    capacidade: "Até 60 pessoas",
    img: salaoRosa.url,
    secoes: [
      {
        titulo: "Espaço e mobiliário",
        itens: [
          "10 jogos de mesas com forros",
          "Cadeiras Dior",
          "Prataria completa",
        ],
      },
      {
        titulo: "Brinquedos",
        itens: [
          "Futebol de sabão",
          "Castelinho com escorrega",
          "Pula-pula",
          "Brinquedoteca",
        ],
      },
      {
        titulo: "Extras",
        itens: ["Pipoca e algodão doce"],
      },
    ],
  },
  {
    id: "Pacote Chiclete (Sem Buffet)",
    nome: "Chiclete",
    capacidade: "Até 80 pessoas",
    img: decoracaoSafari.url,
    secoes: [
      {
        titulo: "Espaço e mobiliário",
        itens: [
          "14 jogos de mesas com forros",
          "Cadeiras Dior",
          "Prataria completa",
        ],
      },
      {
        titulo: "Brinquedos",
        itens: [
          "Futebol de sabão",
          "Castelinho com escorrega",
          "Pula-pula",
          "Brinquedoteca",
        ],
      },
    ],
  },
  {
    id: "Pacote Sorvete (Sem Buffet)",
    nome: "Sorvete",
    capacidade: "Até 90 pessoas",
    img: algodaoDoce.url,
    secoes: [
      {
        titulo: "Espaço e mobiliário",
        itens: [
          "15 jogos de mesas com forros",
          "Cadeiras Dior",
          "Prataria completa",
        ],
      },
      {
        titulo: "Brinquedos",
        itens: [
          "Futebol de sabão",
          "Castelinho com escorrega",
          "Pula-pula",
          "Brinquedoteca",
          "Mini Circuito",
        ],
      },
      {
        titulo: "Extras",
        itens: ["Pipoca e algodão doce"],
      },
    ],
  },
  {
    id: "Pacote Churros (Sem Buffet)",
    nome: "Churros",
    capacidade: "Até 120 pessoas",
    img: salaoAzul.url,
    secoes: [
      {
        titulo: "Espaço e mobiliário",
        itens: [
          "20 jogos de mesas com forros",
          "Cadeiras Dior",
          "Prataria completa",
        ],
      },
      {
        titulo: "Brinquedos",
        itens: [
          "Futebol de sabão",
          "Castelinho com escorrega",
          "Pula-pula",
        ],
      },
      {
        titulo: "Extras",
        itens: ["Pipoca e algodão doce"],
      },
    ],
  },
];

function SemBuffet() {
  const { openChat } = useChatbot();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
      <Link
        to="/pacotes"
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#8641df] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar aos pacotes
      </Link>

      <div className="mt-6 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#8641df]">
          Pacotes 2026
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Pacotes sem Buffet
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
          Todos os pacotes incluem 12h de locação do espaço, piscina aquecida e
          brinquedos infláveis por 4h. Você fica livre para escolher o buffet.
        </p>
      </div>

      <div className="mt-12 space-y-16">
        {pacotes.map((p, idx) => (
          <div
            key={p.id}
            className={`hover-lift grid gap-6 rounded-3xl bg-[#ffec6f] p-4 shadow-xl ring-1 ring-black/5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:p-8 ${
              idx % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={p.img}
                alt={`Pacote ${p.nome}`}
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8641df]">
                <Users className="h-3.5 w-3.5" /> {p.capacidade}
              </div>
              <h2 className="mt-1 font-display text-3xl font-bold text-[#14092e]">
                Pacote {p.nome}
              </h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {p.secoes.map((sec) => (
                  <div key={sec.titulo}>
                    <div className="mb-2 inline-block rounded-full bg-[#8641df]/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-[#8641df]">
                      {sec.titulo}
                    </div>
                    <ul className="space-y-1.5">
                      {sec.itens.map((i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#14092e]/80">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8641df]" />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-[#8641df]/20 bg-[#8641df]/5 px-4 py-3 text-center text-sm">
                <div className="font-display font-semibold text-[#8641df]">
                  Valores sob consulta
                </div>
                <div className="text-xs text-foreground/70">
                  Solicite seu orçamento personalizado pelo WhatsApp
                </div>
              </div>

              <Button
                onClick={() => openChat(p.id)}
                size="lg"
                className="btn-shine mt-6 rounded-full font-display"
              >
                Fazer Reserva <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
