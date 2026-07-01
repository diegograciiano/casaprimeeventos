import { createFileRoute } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/site/ChatbotContext";

import salaoAzul from "@/assets/salao-azul.jpg.asset.json";
import salaoRosa from "@/assets/salao-rosa.jpg.asset.json";
import algodaoDoce from "@/assets/algodao-doce.jpg.asset.json";

export const Route = createFileRoute("/pacotes/festa-completa")({
  head: () => ({
    meta: [
      { title: "Festa Completa — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Cardápio detalhado dos pacotes Festa Completa Pirulito, Chiclete e Alegria da Casa Prime Eventos.",
      },
      { property: "og:title", content: "Festa Completa — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Cardápio completo com decoração, buffet, bebidas, sobremesa e brinquedos.",
      },
    ],
  }),
  component: FestaCompleta,
});

type Secao = { titulo: string; itens: string[] };
type Pacote = {
  id: string;
  nome: string;
  subtitulo: string;
  img: string;
  destaque?: boolean;
  secoes: Secao[];
};

const decoracao = ["Decoração de 8 metros", "Personalizados e centro de mesa"];
const bebidas = [
  "Coca-Cola",
  "Coca-Cola Zero",
  "Guaraná Antarctica",
  "Água mineral",
  "Suco La Fruit de uva",
  "Suco La Fruit de caju",
];
const sobremesa = [
  "5 docinhos tradicionais por convidado",
  "Torta",
  "Sorvete Ninho com morango",
];
const brinquedosBase = [
  "Futebol de sabão",
  "Pula-pula",
  "Castelinho com escorrega na piscina",
  "Brinquedoteca",
];
const brinquedosCompletos = [...brinquedosBase, "Mini Circuito"];

const entradasClassicas = [
  "Mussarela e presunto em cubos",
  "Azeitona sem caroço",
  "Tomate cereja",
  "Salame italiano",
  "Provolone fatiado",
  "Batata frita",
  "Patê de frango",
  "Torradas",
  "Barraquinha de algodão doce e pipoca",
];

const pacotes: Pacote[] = [
  {
    id: "Festa Completa Pirulito",
    nome: "Pirulito",
    subtitulo: "Festa completa",
    img: algodaoDoce.url,
    secoes: [
      { titulo: "Decoração", itens: decoracao },
      { titulo: "Entradas", itens: entradasClassicas },
      {
        titulo: "Prato principal",
        itens: [
          "Arroz branco",
          "Maminha ao molho limão",
          "Frango ao molho 4 queijos",
          "Batata palha",
          "Salada tropical (molho de mostarda e mel)",
        ],
      },
      { titulo: "Bebidas", itens: bebidas },
      { titulo: "Sobremesa", itens: sobremesa },
      { titulo: "Brinquedos", itens: brinquedosBase },
    ],
  },
  {
    id: "Festa Completa Chiclete",
    nome: "Chiclete",
    subtitulo: "Festa completa",
    img: salaoAzul.url,
    destaque: true,
    secoes: [
      { titulo: "Decoração", itens: decoracao },
      { titulo: "Entradas", itens: entradasClassicas },
      {
        titulo: "Prato principal",
        itens: [
          "Arroz branco",
          "Lagarto ao molho madeira",
          "Frango à parmegiana",
          "Batata sauté",
          "Salada tropical (molho de mostarda e mel)",
        ],
      },
      { titulo: "Bebidas", itens: bebidas },
      { titulo: "Sobremesa", itens: sobremesa },
      { titulo: "Brinquedos", itens: brinquedosCompletos },
    ],
  },
  {
    id: "Festa Completa Alegria",
    nome: "Alegria",
    subtitulo: "Festa completa com churrasco",
    img: salaoRosa.url,
    secoes: [
      { titulo: "Decoração", itens: decoracao },
      {
        titulo: "Entradas",
        itens: [
          "Patê de frango com torradas",
          "Batata frita",
          "Torresmo",
          "Mandioca",
          "Abacaxi com raspinha de limão",
          "Barraquinha de algodão doce e pipoca",
        ],
      },
      {
        titulo: "Prato principal",
        itens: ["Arroz branco", "Feijão tropeiro", "Vinagrete", "Mandioca cozida"],
      },
      {
        titulo: "Carnes e acompanhamentos",
        itens: [
          "Picanha",
          "Contra filé (ancho)",
          "Cupim Grill",
          "Linguiça toscana",
          "Tulipa de frango",
          "Pão de alho",
        ],
      },
      { titulo: "Bebidas", itens: bebidas },
      { titulo: "Sobremesa", itens: sobremesa },
      { titulo: "Brinquedos", itens: brinquedosCompletos },
    ],
  },
];

function FestaCompleta() {
  const { openChat } = useChatbot();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#8641df]">
          Festa Completa 2026
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Cardápio completo da Festa Completa
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
          Todos os pacotes incluem 12h de locação, piscina aquecida, brinquedos por 4h,
          decoração de 8 metros e equipe Prime.
        </p>
      </div>

      <div className="mt-12 space-y-16">
        {pacotes.map((p, idx) => (
          <div
            key={p.id}
            className={`grid gap-6 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-black/5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:p-8 ${
              idx % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={p.img}
                alt={`Festa Completa ${p.nome}`}
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-[#8641df]">
                {p.subtitulo}
              </div>
              <h2 className="mt-1 font-display text-3xl font-bold text-[#14092e]">
                Festa Completa {p.nome}
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
                className="mt-6 rounded-full font-display"
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
