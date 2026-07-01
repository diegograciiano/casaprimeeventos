import { createFileRoute } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/site/ChatbotContext";

import salaoAzul from "@/assets/salao-azul.jpg.asset.json";
import salaoRosa from "@/assets/salao-rosa.jpg.asset.json";
import algodaoDoce from "@/assets/algodao-doce.jpg.asset.json";

export const Route = createFileRoute("/pacotes")({
  head: () => ({
    meta: [
      { title: "Pacotes de Festa — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Conheça os pacotes da Casa Prime: Pirulito (sem buffet), Diversão (com buffet) e Churrasco. A partir de R$ 5.890 para 80 pessoas.",
      },
      { property: "og:title", content: "Pacotes de Festa — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Três pacotes pensados para todos os tipos de festa infantil.",
      },
    ],
  }),
  component: Pacotes,
});

const pacotes = [
  {
    id: "Pacote Pirulito (Sem Buffet)",
    nome: "Pirulito",
    subtitulo: "Sem Buffet",
    preco: "R$ 5.890",
    pessoas: "80 pessoas",
    img: algodaoDoce.url,
    cor: "from-gold to-accent",
    inclui: [
      "12h de locação",
      "Piscina aquecida",
      "Brinquedos por 4h",
      "Algodão doce e pipoca (4h)",
      "Estacionamento",
      "Equipe completa",
    ],
    precos: [
      { qtd: 80, valor: "R$ 5.890" },
      { qtd: 100, valor: "R$ 6.590" },
      { qtd: 120, valor: "R$ 7.290" },
      { qtd: 150, valor: "R$ 8.190" },
    ],
  },
  {
    id: "Pacote Diversão (Com Buffet)",
    nome: "Diversão",
    subtitulo: "Com Buffet Completo",
    preco: "Consulte",
    pessoas: "a partir de 80",
    img: salaoAzul.url,
    destaque: true,
    cor: "from-pink to-[oklch(0.72_0.22_320)]",
    inclui: [
      "Tudo do Pirulito",
      "Entradas variadas",
      "Prato principal quente",
      "Bebidas (refrigerante e suco)",
      "Sobremesa",
      "Decoração básica",
    ],
    precos: [
      { qtd: 80, valor: "Consulte" },
      { qtd: 100, valor: "Consulte" },
      { qtd: 120, valor: "Consulte" },
      { qtd: 150, valor: "Consulte" },
    ],
  },
  {
    id: "Pacote Churrasco (Festa Completa)",
    nome: "Churrasco",
    subtitulo: "Festa Completa",
    preco: "Premium",
    pessoas: "a partir de 80",
    img: salaoRosa.url,
    cor: "from-aqua-deep to-[oklch(0.5_0.15_240)]",
    inclui: [
      "Tudo do Diversão",
      "Churrasco premium",
      "Variedade de carnes nobres",
      "Buffet completo",
      "Bebidas + sobremesas",
      "Churrasqueiro incluso",
    ],
    precos: [
      { qtd: 80, valor: "Consulte" },
      { qtd: 100, valor: "Consulte" },
      { qtd: 120, valor: "Consulte" },
      { qtd: 150, valor: "Consulte" },
    ],
  },
];

function Pacotes() {
  const { openChat } = useChatbot();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-pink">
          Pacotes 2026
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Escolha o pacote perfeito 🎁
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-foreground/70">
          Três opções pensadas para todos os tipos de festa. Você personaliza com a gente.
        </p>
      </div>

      <div className="mt-12 space-y-16">
        {pacotes.map((p, idx) => (
          <div
            key={p.id}
            className={`grid gap-6 rounded-3xl bg-white p-4 shadow-xl ring-2 ring-white/60 md:grid-cols-2 md:items-center md:p-8 ${
              idx % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.cor} aspect-[4/3]`}>
              <img
                src={p.img}
                alt={`Pacote ${p.nome}`}
                loading="lazy"
                className="h-full w-full object-cover mix-blend-multiply"
              />
              {p.destaque && (
                <div className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-foreground shadow">
                  ⭐ Mais escolhido
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-pink">
                {p.subtitulo}
              </div>
              <h2 className="mt-1 font-display text-3xl font-bold">Pacote {p.nome}</h2>
              <div className="mt-3 text-sm text-foreground/70">
                Para <span className="font-semibold text-foreground">{p.pessoas}</span> convidados
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {p.inclui.map((i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua-deep" />
                    <span>{i}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-pink-soft/40 px-4 py-3 text-center text-sm">
                <div className="font-display font-semibold text-pink">Valores sob consulta</div>
                <div className="text-xs text-foreground/70">Solicite seu orçamento personalizado pelo WhatsApp</div>
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
