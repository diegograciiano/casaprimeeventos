import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  CreditCard,
  Calendar,
  ShieldCheck,
  Waves,
  Gamepad2,
  Car,
  Users,
  IceCream,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/site/ChatbotContext";
import { Reveal } from "@/hooks/use-reveal";


import decoracaoSafari from "@/assets/decoracao-safari.jpg.asset.json";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre & Informações — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Horário, formas de pagamento, reservas, caução e todas as informações úteis da Casa Prime Eventos.",
      },
      { property: "og:title", content: "Sobre & Informações — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Estrutura, diferenciais e informações práticas do nosso espaço.",
      },
    ],
  }),
  component: Sobre,
});

const estrutura = [
  { icon: Waves, title: "Piscina aquecida", desc: "Aquecida o ano todo, com brinquedos infláveis." },
  { icon: Gamepad2, title: "Área de brinquedos", desc: "Brinquedão, camas elásticas, piscina de bolinhas." },
  { icon: UtensilsCrossed, title: "Cozinha e buffet", desc: "Cozinha equipada para o buffet operar com tranquilidade." },
  { icon: IceCream, title: "Algodão doce e pipoca", desc: "Carrinhos de doces por 4h para a garotada." },
  { icon: Car, title: "Estacionamento", desc: "Amplo, com espaço para todos os convidados." },
  { icon: Users, title: "Equipe completa", desc: "Recepção, monitores e limpeza incluídos." },
];

const informacoes = [
  { icon: Clock, title: "Horário", desc: "12h de locação. Combine o horário que melhor se encaixa no seu evento." },
  { icon: CreditCard, title: "Pagamento", desc: "PIX, cartão de crédito (parcelado), dinheiro. Sinal para reserva + saldo antes da festa." },
  { icon: Calendar, title: "Reservas", desc: "Confirmação da data com pagamento do sinal. Datas disponíveis por ordem de chegada." },
  { icon: ShieldCheck, title: "Caução", desc: "Caução simbólica devolvida após o evento, condicionada à conservação do espaço." },
];

function Sobre() {
  const { openChat } = useChatbot();
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-widest text-pink">
              Nossa história
            </div>
            <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
              A sua casa de diversão
            </h1>
            <p className="mt-4 text-foreground/80">
              A Casa Prime Eventos nasceu do desejo de oferecer festas infantis inesquecíveis
              em um espaço pensado para as crianças e confortável para os pais. Todo o nosso
              trabalho é feito com carinho, atenção aos detalhes e respeito ao seu momento.
            </p>
            <p className="mt-3 text-foreground/80">
              Aqui, cada aniversário é único. Nossa equipe cuida de tudo para você
              simplesmente aproveitar.
            </p>
            <div className="mt-6">
              <Button onClick={() => openChat()} size="lg" className="btn-shine rounded-full font-display">
                Quero fazer minha festa
              </Button>
            </div>
          </Reveal>
          <Reveal className="hover-lift overflow-hidden rounded-3xl shadow-xl ring-4 ring-purple/10">
            <img
              src={decoracaoSafari.url}
              alt="Decoração safari na Casa Prime"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-bold">Nossa estrutura</h2>
        </Reveal>
        <Reveal stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {estrutura.map((e) => (
            <div
              key={e.title}
              className="hover-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 backdrop-blur"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-pink-soft to-aqua/50 text-pink">
                <e.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 font-display text-lg font-semibold">{e.title}</div>
              <p className="mt-1 text-sm text-foreground/70">{e.desc}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-bold">Informações úteis</h2>
        </Reveal>
        <Reveal stagger className="mt-6 grid gap-4 sm:grid-cols-2">
          {informacoes.map((i) => (
            <div
              key={i.title}
              className="hover-lift flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-soft text-foreground">
                <i.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-lg font-semibold">{i.title}</div>
                <p className="mt-1 text-sm text-foreground/70">{i.desc}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>
    </>
  );
}
