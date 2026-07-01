import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Waves,
  Clock,
  IceCream,
  Palette,
  Users,
  Check,
  ArrowRight,
  Gamepad2,
  MessageCircle,
} from "lucide-react";
import { useChatbot } from "@/components/site/ChatbotContext";
import { waLink } from "@/lib/whatsapp";

import heroPiscina from "@/assets/salao-rosa-hd.jpg.asset.json";
import salaoAzul from "@/assets/salao-azul.jpg.asset.json";
import salaoRosa from "@/assets/salao-rosa.jpg.asset.json";
import decoracaoSafari from "@/assets/decoracao-safari.jpg.asset.json";
import algodaoDoce from "@/assets/algodao-doce.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const diferenciais = [
  {
    icon: Waves,
    title: "Piscina Aquecida",
    desc: "Diversão garantida em qualquer estação com total segurança.",
  },
  {
    icon: Clock,
    title: "12h de Locação",
    desc: "Mais tempo para celebrar e menos preocupação com o relógio.",
  },
  {
    icon: Gamepad2,
    title: "Brinquedos",
    desc: "Estrutura moderna e lúdica que encanta todas as idades.",
  },
  {
    icon: IceCream,
    title: "Mimos Especiais",
    desc: "Algodão doce e pipoca fresquinhos durante toda a festa.",
  },
  {
    icon: Palette,
    title: "Decoração Temática",
    desc: "Cenografia personalizada e caprichada para cada festa.",
  },
  {
    icon: Users,
    title: "Equipe Prime",
    desc: "Profissionais capacitados para cuidar de cada detalhe.",
  },
];

const pacotes = [
  {
    id: "Pacote Pirulito (Sem Buffet)",
    nome: "Pirulito",
    tier: "Basic Prime",
    inclui: [
      "12h de locação",
      "Piscina aquecida",
      "Brinquedos por 4h",
      "Algodão doce e pipoca",
      "Equipe de apoio",
    ],
  },
  {
    id: "Pacote Diversão (Com Buffet)",
    nome: "Diversão",
    tier: "Signature Prime",
    destaque: true,
    inclui: [
      "Tudo do Pirulito",
      "Buffet completo Kids",
      "Entradas, prato quente e sobremesa",
      "Bebidas (refri e suco)",
      "Decoração básica inclusa",
    ],
  },
  {
    id: "Pacote Churrasco (Festa Completa)",
    nome: "Churrasco",
    tier: "Family Prime",
    inclui: [
      "Tudo do Diversão",
      "Churrasco premium",
      "Variedade de carnes nobres",
      "Churrasqueiro incluso",
      "Ideal p/ festas com adultos",
    ],
  },
];

function Index() {
  const { openChat } = useChatbot();

  return (
    <>
      {/* HERO — split 2 blocos: texto esquerda + imagem fundo com degradê */}
      <section className="relative isolate overflow-hidden bg-[#14092e]">
        {/* Imagem de fundo */}
        <img
          src={heroPiscina.url}
          alt="Salão decorado em rosa com balões para festa infantil"
          width={1600}
          height={1024}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Degradê roxo cobrindo o texto (esquerda) e desaparecendo à direita */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#14092e] via-[#8641df]/85 via-40% to-transparent md:from-[#14092e] md:via-[#8641df]/90 md:via-45% md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14092e]/70 to-transparent md:hidden" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 md:min-h-[640px] md:grid-cols-2 md:gap-12 md:py-24 lg:py-32">
          {/* Coluna texto */}
          <div className="flex flex-col justify-center text-left">
            <div className="mb-6 inline-flex w-fit -rotate-2 items-center gap-2 rounded-full bg-[#ffcb03] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#14092e] shadow-lg sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>+500 festas inesquecíveis</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-[0.95] text-white [text-wrap:balance] sm:text-6xl lg:text-7xl">
              CASA <span className="text-[#ffcb03]">PRIME</span>
              <br />
              EVENTOS
            </h1>

            <p className="mt-5 max-w-lg text-base font-medium leading-relaxed text-white/90 sm:mt-6 sm:text-lg">
              Onde a magia da infância encontra o requinte e a sofisticação em Goiânia.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={() => openChat()}
                className="rounded-2xl bg-[#ffcb03] px-6 py-3.5 text-base font-bold text-[#14092e] shadow-[0_8px_0_0_#b38e00] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_0_0_#b38e00] active:translate-y-1 active:shadow-none sm:px-8 sm:py-4 sm:text-lg"
              >
                Escolher Pacote
              </button>
              <Link
                to="/galeria"
                className="rounded-2xl border-2 border-white/40 bg-white/5 px-6 py-3.5 text-center text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:px-8 sm:py-4 sm:text-lg"
              >
                Ver Galeria
              </Link>
            </div>
          </div>

          {/* Coluna direita reservada para o visual (imagem já é fundo) */}
          <div aria-hidden className="hidden md:block" />
        </div>
      </section>

      {/* DIFERENCIAIS — fundo cinza leve com skew */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 origin-right -skew-y-3 scale-110 bg-[#faf9fc]" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-14">
            <h2 className="font-display text-4xl font-extrabold text-[#8641df] sm:text-5xl">
              Por que escolher a Prime?
            </h2>
            <div className="mt-4 h-2 w-24 rounded-full bg-[#ffcb03]" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {diferenciais.map((d) => (
              <div
                key={d.title}
                className="group rounded-3xl border-b-4 border-transparent bg-white p-8 shadow-xl shadow-purple-900/5 transition-all duration-300 hover:-translate-y-2 hover:border-[#ffcb03]"
              >
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-[#8641df]/10 text-[#8641df] transition-colors group-hover:bg-[#8641df] group-hover:text-white">
                  <d.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#14092e]">
                  {d.title}
                </h3>
                <p className="mt-2 text-[#14092e]/70">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACOTES — fundo ink escuro */}
      <section id="pacotes" className="bg-[#14092e] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center sm:mb-20">
            <h2 className="font-display text-4xl font-extrabold sm:text-6xl">
              Nossos <span className="text-[#ffcb03]">Pacotes</span>
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Celebrações sob medida para o tamanho do seu sonho.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pacotes.map((p) => (
              <div
                key={p.id}
                className={
                  p.destaque
                    ? "relative flex transform flex-col items-center rounded-[2.5rem] bg-[#8641df] p-10 text-center shadow-2xl shadow-[#8641df]/40 lg:-translate-y-6"
                    : "relative flex flex-col items-center rounded-[2.5rem] border border-white/10 bg-[#8641df]/10 p-10 text-center"
                }
              >
                {p.destaque && (
                  <div className="absolute -top-4 rounded-full bg-[#ffcb03] px-5 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#14092e]">
                    Mais popular
                  </div>
                )}
                <div className="mb-3 text-xs font-black uppercase tracking-widest text-[#ffcb03]">
                  {p.tier}
                </div>
                <h3 className="mb-8 font-display text-4xl font-bold">{p.nome}</h3>
                <ul className="mb-10 space-y-3 text-white/85">
                  {p.inclui.map((i) => (
                    <li key={i} className="flex items-start justify-center gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ffcb03]" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto w-full">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#ffcb03]">
                    Valores sob consulta
                  </p>
                  <button
                    onClick={() => openChat(p.id)}
                    className={
                      p.destaque
                        ? "w-full rounded-xl bg-[#ffcb03] px-8 py-4 font-bold text-[#14092e] shadow-lg shadow-black/20 transition hover:brightness-110"
                        : "w-full rounded-xl border border-white/25 px-8 py-4 font-bold text-white transition hover:bg-white hover:text-[#14092e]"
                    }
                  >
                    {p.destaque ? "Solicitar Orçamento" : "Ver Detalhes"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA PREVIEW */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-[#14092e] sm:text-4xl">
              Momentos que a gente ama
            </h2>
            <div className="mt-3 h-1.5 w-16 rounded-full bg-[#8641df]" />
          </div>
          <Link
            to="/galeria"
            className="hidden text-sm font-bold text-[#8641df] hover:underline sm:inline-flex"
          >
            Ver tudo →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[salaoAzul.url, salaoRosa.url, decoracaoSafari.url, algodaoDoce.url].map(
            (url, i) => (
              <div
                key={url}
                className={`overflow-hidden rounded-2xl shadow-lg ${
                  i === 0 ? "col-span-2 row-span-2 md:col-span-2" : ""
                }`}
              >
                <img
                  src={url}
                  alt="Foto da Casa Prime Eventos"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ),
          )}
        </div>
      </section>

      {/* CTA FINAL — WhatsApp */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-[#8641df] opacity-20 blur-2xl" />
              <a
                href={waLink("Olá Casa Prime! Quero informações.")}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-3 rounded-3xl bg-[#25D366] px-8 py-5 text-lg font-bold text-white shadow-xl transition-transform hover:scale-105 sm:px-10 sm:py-6 sm:text-xl"
              >
                <MessageCircle className="h-6 w-6" />
                Conversar no WhatsApp
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-8 text-sm text-[#14092e]/60">
              Siga-nos no Instagram{" "}
              <a
                href="https://instagram.com/casaprimeeventos"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#8641df] underline decoration-[#ffcb03]/60 underline-offset-4"
              >
                @casaprimeeventos
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
