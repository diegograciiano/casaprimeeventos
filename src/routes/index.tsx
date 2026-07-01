import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Waves,
  Clock,
  IceCream,
  Car,
  Users,
  PartyPopper,
  Check,
  ArrowRight,
  Camera,
  UtensilsCrossed,
  Palette,
  MessageCircle,
  Gamepad2,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/site/ChatbotContext";
import { waLink } from "@/lib/whatsapp";

import heroPiscina from "@/assets/hero-piscina.jpg";
import salaoAzul from "@/assets/salao-azul.jpg.asset.json";
import salaoRosa from "@/assets/salao-rosa.jpg.asset.json";
import decoracaoSafari from "@/assets/decoracao-safari.jpg.asset.json";
import algodaoDoce from "@/assets/algodao-doce.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const diferenciais = [
  { icon: Waves, text: "Piscina aquecida" },
  { icon: Clock, text: "12h de locação" },
  { icon: Gamepad2, text: "Brinquedos por 4h" },
  { icon: IceCream, text: "Algodão doce e pipoca 4h" },
  { icon: Car, text: "Estacionamento amplo" },
  { icon: Users, text: "Equipe completa" },
];

const pacotes = [
  {
    id: "Pacote Pirulito (Sem Buffet)",
    nome: "Pirulito",
    subtitulo: "Sem Buffet",
    preco: "Consulte",
    pessoas: "80 pessoas",
    cor: "from-gold to-accent",
    ring: "ring-gold",
    img: algodaoDoce.url,
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
    ],
  },
  {
    id: "Pacote Diversão (Com Buffet)",
    nome: "Diversão",
    subtitulo: "Com Buffet Completo",
    preco: "Consulte",
    pessoas: "a partir de 80",
    cor: "from-pink to-[oklch(0.72_0.22_320)]",
    ring: "ring-pink",
    destaque: true,
    img: salaoAzul.url,
    inclui: [
      "Tudo do Pirulito",
      "Entradas variadas",
      "Prato principal quente",
      "Bebidas (refrigerante e suco)",
      "Sobremesa",
      "Decoração básica inclusa",
    ],
    precos: [
      { qtd: 80, valor: "Consulte" },
      { qtd: 100, valor: "Consulte" },
      { qtd: 120, valor: "Consulte" },
    ],
  },
  {
    id: "Pacote Churrasco (Festa Completa)",
    nome: "Churrasco",
    subtitulo: "Festa Completa",
    preco: "Premium",
    pessoas: "a partir de 80",
    cor: "from-aqua-deep to-[oklch(0.5_0.15_240)]",
    ring: "ring-aqua-deep",
    img: salaoRosa.url,
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
    ],
  },
];

const colmeia = [
  { icon: Gift, label: "Pacotes", to: "/pacotes" },
  { icon: Camera, label: "Galeria", to: "/galeria" },
  { icon: Gamepad2, label: "Brinquedos", to: "/sobre" },
  { icon: UtensilsCrossed, label: "Buffet", to: "/pacotes" },
  { icon: Palette, label: "Decoração", to: "/galeria" },
  { icon: MessageCircle, label: "WhatsApp", href: waLink("Olá Casa Prime! Quero informações.") },
];

function Index() {
  const { openChat } = useChatbot();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-6 pb-12 sm:px-6 md:grid-cols-2 md:pt-10 md:pb-20">
          <div className="animate-pop-in">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-pink shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Espaço premium em Goiânia
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
              A melhor{" "}
              <span className="bg-gradient-to-r from-pink via-[oklch(0.72_0.22_320)] to-aqua-deep bg-clip-text text-transparent">
                festa infantil
              </span>{" "}
              da sua vida acontece aqui!
            </h1>
            <p className="mt-4 max-w-lg text-base text-foreground/80 sm:text-lg">
              Piscina aquecida, brinquedos, buffet, decoração e uma equipe apaixonada por
              transformar o dia do seu filho(a) em uma memória inesquecível.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => openChat()}
                className="rounded-full font-display text-base shadow-lg shadow-pink/30"
              >
                Escolher Pacote <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full font-display text-base"
              >
                <Link to="/galeria">Ver Galeria</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-3 text-xs text-foreground/70">
              <div className="flex -space-x-2">
                {["#FF69B4", "#5CE1E6", "#FFD700"].map((c) => (
                  <div
                    key={c}
                    className="h-7 w-7 rounded-full border-2 border-white"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span>+ de 500 festas realizadas com carinho</span>
            </div>
          </div>

          <div className="relative">
            <div className="animate-float relative overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-white/60">
              <img
                src={heroPiscina}
                alt="Piscina com brinquedos infláveis coloridos"
                width={1600}
                height={1024}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-4">
                <div className="rounded-2xl bg-white/90 p-3 backdrop-blur">
                  <div className="text-xs font-semibold text-pink">Pacote Pirulito</div>
                  <div className="font-display text-xl font-bold">12h de festa completa</div>
                  <div className="text-xs text-foreground/70">Consulte valores no WhatsApp</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 hidden rounded-full bg-gold px-4 py-2 font-display font-bold text-foreground shadow-lg md:block">
              🎉 12h de festa
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE + DIFERENCIAIS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-pink">
              Quem somos
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              A sua casa de diversão
            </h2>
            <p className="mt-4 text-foreground/80">
              A Casa Prime Eventos é um espaço pensado para ser inesquecível para as
              crianças e tranquilo para os pais. Estrutura completa, ambientes climatizados,
              piscina aquecida e uma equipe experiente cuidando de cada detalhe.
            </p>
            <p className="mt-3 text-foreground/80">
              Aqui, cada festa é única. Você escolhe o pacote, a gente cuida do resto.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {diferenciais.map((d) => (
              <div
                key={d.text}
                className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-pink-soft to-aqua/50 text-pink">
                  <d.icon className="h-5 w-5" />
                </div>
                <div className="mt-2 text-sm font-semibold">{d.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACOTES */}
      <section id="pacotes" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-pink">
            Nossos pacotes
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Escolha o pacote perfeito 🎁
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground/70">
            Três opções pensadas para todos os tipos de festa. Personalize com a gente.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pacotes.map((p) => (
            <div
              key={p.id}
              className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-xl ring-2 ring-white/60 transition-transform duration-300 hover:-translate-y-1 ${
                p.destaque ? "md:-mt-4 md:mb-4" : ""
              }`}
            >
              {p.destaque && (
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gold px-3 py-1 text-xs font-bold text-foreground shadow">
                  ⭐ Mais escolhido
                </div>
              )}
              <div className={`relative h-40 w-full bg-gradient-to-br ${p.cor}`}>
                <img
                  src={p.img}
                  alt={`Pacote ${p.nome}`}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 mix-blend-multiply"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="font-display text-2xl font-bold">Pacote {p.nome}</div>
                <div className="text-sm text-foreground/70">{p.subtitulo}</div>

                <div className="mt-4 text-sm text-foreground/70">
                  Para <span className="font-semibold text-foreground">{p.pessoas}</span> convidados
                </div>

                <ul className="mt-4 space-y-2 text-sm">
                  {p.inclui.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua-deep" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-xl bg-pink-soft/40 px-4 py-3 text-center text-sm">
                  <div className="font-display font-semibold text-pink">Valores sob consulta</div>
                  <div className="text-xs text-foreground/70">Fale com a gente pelo WhatsApp</div>
                </div>

                <Button
                  onClick={() => openChat(p.id)}
                  className="mt-6 w-full rounded-full font-display"
                >
                  Fazer Reserva
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLMEIA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-pink">
            Explore
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Tudo o que você precisa em um só lugar
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 sm:gap-6">
          {colmeia.map((c, i) => {
            const Inner = (
              <div
                className={`hex flex-col items-center justify-center bg-gradient-to-br ${
                  i % 3 === 0
                    ? "from-pink to-[oklch(0.75_0.2_320)]"
                    : i % 3 === 1
                    ? "from-aqua to-aqua-deep"
                    : "from-gold to-[oklch(0.78_0.18_60)]"
                } aspect-[1/1.15] w-full text-white shadow-xl transition-transform duration-300 group-hover:scale-105`}
              >
                <c.icon className="h-8 w-8" />
                <div className="mt-2 font-display text-sm font-semibold sm:text-base">
                  {c.label}
                </div>
              </div>
            );
            const wrapperCls = `group grid place-items-center ${
              i === 1 || i === 4 ? "translate-y-4 sm:translate-y-6" : ""
            }`;
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={wrapperCls}
              >
                {Inner}
              </a>
            ) : (
              <Link key={c.label} to={c.to!} className={wrapperCls}>
                {Inner}
              </Link>
            );
          })}
        </div>
      </section>

      {/* GALERIA PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-pink">
              Galeria
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Momentos que a gente ama 💖
            </h2>
          </div>
          <Link
            to="/galeria"
            className="hidden text-sm font-semibold text-pink hover:underline sm:inline-flex"
          >
            Ver tudo →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[salaoAzul.url, salaoRosa.url, decoracaoSafari.url, algodaoDoce.url].map((url, i) => (
            <div
              key={url}
              className={`overflow-hidden rounded-2xl shadow-lg ${i === 0 ? "col-span-2 row-span-2 md:col-span-2" : ""}`}
            >
              <img
                src={url}
                alt="Foto da Casa Prime"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink via-[oklch(0.72_0.22_330)] to-aqua-deep p-8 text-center text-white shadow-2xl sm:p-14">
          <PartyPopper className="mx-auto h-12 w-12 opacity-90" />
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Vamos montar a festa dos sonhos?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Em menos de 2 minutos você monta seu pacote e nossa equipe entra em contato.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => openChat()}
              className="rounded-full bg-white font-display text-pink hover:bg-white/90"
            >
              Começar agora <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
