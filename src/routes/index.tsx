import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  Heart,
  ShieldCheck,
  Star,
  PartyPopper,
  Flame,
} from "lucide-react";
import { useChatbot } from "@/components/site/ChatbotContext";
import { waLink } from "@/lib/whatsapp";
import { TabelaPacotesValores } from "@/components/site/TabelaPacotesValores";
import { EscolherPacoteDialog } from "@/components/site/EscolherPacoteDialog";
import { Reveal } from "@/hooks/use-reveal";

const OG_IMAGE_URL = "https://casaprimeeventos.com.br/images/salao-decorado-azul.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Casa Prime Eventos — Festas Infantis Inesquecíveis em Goiânia" },
      {
        name: "description",
        content:
          "O espaço de festas infantis mais acolhedor de Goiânia. 12h de locação, piscina aquecida, buffet completo, brinquedos com monitores e zero estresse para os pais.",
      },
      { property: "og:title", content: "Casa Prime Eventos — Festas Infantis Inesquecíveis em Goiânia" },
      {
        property: "og:description",
        content:
          "Piscina aquecida, brinquedos incríveis, buffet completo e 12h de celebração com exclusividade.",
      },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:width", content: "1216" },
      { property: "og:image:height", content: "640" },
      { property: "og:url", content: "https://casaprimeeventos.com.br/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [{ rel: "canonical", href: "https://casaprimeeventos.com.br/" }],
  }),
});

const diferenciaisPais = [
  {
    icon: Clock,
    title: "12 Horas de Espaço Exclusivo",
    desc: "Chega de correria de 4 horas! Decore com calma, receba seus convidados sem pressa e aproveite cada segundo do grande dia do seu filho.",
  },
  {
    icon: Waves,
    title: "Piscina Aquecida Segura",
    desc: "Água quentinha e deliciosa para todas as idades, com escorregador e área monitorada para você relaxar de verdade.",
  },
  {
    icon: Gamepad2,
    title: "Brinquedos com Monitores",
    desc: "Futebol de sabão, pula-pula, brinquedoteca e mini circuito com monitores dedicados cuidando da alegria e segurança dos pequenos.",
  },
  {
    icon: IceCream,
    title: "Algodão Doce & Pipoca",
    desc: "A barraquinha que as crianças amam! Pipoca quentinha e algodão doce colorido preparados na hora durante toda a festa.",
  },
  {
    icon: Palette,
    title: "Buffet Completo e Farto",
    desc: "Entradas caprichadas, pratos nobres (churrasco, parmegiana, maminha), sobremesas finas e bebidas de primeira linha.",
  },
  {
    icon: ShieldCheck,
    title: "Equipe Prime Cuidando de Tudo",
    desc: "Recepção, limpeza contínua e suporte do início ao fim. Você é o anfitrião, mas aproveita a festa como um convidado de honra.",
  },
];

const depoimentos = [
  {
    nome: "Mariana Alencar",
    evento: "Mãe do Theo (4 anos)",
    texto:
      "A melhor escolha que fizemos! Ter 12h de salão fez toda a diferença, chegamos sem correria, as crianças brincaram na piscina aquecida a tarde inteira e o buffet foi super elogiado por todos os tios e avós. Recomendo de olhos fechados!",
    estrelas: 5,
  },
  {
    nome: "Carlos Eduardo & Priscila",
    evento: "Pais da Sofia (6 anos)",
    texto:
      "Estávamos preocupados com a logística, mas a equipe da Casa Prime deu conta de tudo. O futebol de sabão e a barraquinha de algodão doce foram o maior sucesso. Conseguimos conversar com os amigos enquanto os monitores cuidavam das crianças.",
    estrelas: 5,
  },
  {
    nome: "Renata Vasconcelos",
    evento: "Mãe do Benício (2 anos)",
    texto:
      "Espaço acolhedor, seguro e limpo do início ao fim. O simulador de orçamento pelo site já me deu total clareza dos valores e o atendimento no WhatsApp foi impecável. Foi a festa dos sonhos!",
    estrelas: 5,
  },
];

function Index() {
  const { openChat } = useChatbot();
  const [escolherOpen, setEscolherOpen] = useState(false);

  return (
    <>
      {/* HERO — Conexão emocional com os pais */}
      <section className="relative isolate overflow-hidden bg-[#14092e]">
        {/* Imagem de fundo */}
        <img
          src="/images/salao-decorado-rosa.jpg"
          alt="Salão da Casa Prime decorado com balões para festa infantil em Goiânia"
          width={1600}
          height={1024}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Degradê acolhedor */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#14092e] via-[#8641df]/90 via-45% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14092e]/80 via-transparent to-transparent md:hidden" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 md:min-h-[660px] md:grid-cols-12 md:gap-12 md:py-24 lg:py-32 items-center">
          {/* Coluna texto */}
          <Reveal className="flex flex-col justify-center text-left md:col-span-8 lg:col-span-7">
            <div className="badge-shine mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#ffcb03] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#14092e] shadow-lg">
              <Sparkles className="h-4 w-4 shrink-0 text-[#14092e]" />
              <span>Espaço Exclusivo de Festas Infantis em Goiânia</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight lg:leading-[1.18] text-white [text-wrap:balance]">
              A festa dos sonhos do seu filho.{" "}
              <span className="text-[#ffcb03]">A tranquilidade que você merece.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg font-normal leading-relaxed text-purple-100">
              Você não precisa se desgastar organizando mil fornecedores. Na Casa Prime você tem <strong>12 horas de locação exclusiva</strong>, <strong>piscina aquecida</strong>, <strong>brinquedos com monitores</strong>, <strong>buffet delicioso</strong> e <strong>algodão doce fresquinho</strong>!
            </p>

            {/* Badges de confiança */}
            <div className="mt-6 flex flex-wrap gap-2.5 text-xs sm:text-sm font-semibold text-white/95">
              <span className="rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur-sm">
                🎈 12h de Espaço Livre
              </span>
              <span className="rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur-sm">
                🏊 Piscina Aquecida
              </span>
              <span className="rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur-sm">
                🍿 Pipoca & Algodão Doce
              </span>
              <span className="rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur-sm">
                🛡️ Monitores Inclusos
              </span>
            </div>

            {/* Botoes de Ação */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:gap-4">
              <Link
                to="/orcamento"
                className="btn-shine inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ffcb03] px-8 py-4 text-center font-display text-base sm:text-lg font-bold text-[#14092e] shadow-[0_8px_0_0_#b38e00] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_0_0_#b38e00] active:translate-y-1 active:shadow-none"
              >
                <Sparkles className="h-5 w-5" />
                Simular Orçamento no Chatbot
              </Link>
              <a
                href="#tabela-valores"
                className="btn-shine inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-7 py-4 text-center font-display text-base sm:text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Ver Valores dos Pacotes
              </a>
            </div>
          </Reveal>

          {/* Card Flutuante de Destaque no Desktop (Alto Contraste e Legibilidade) */}
          <Reveal className="hidden md:block md:col-span-4 lg:col-span-5">
            <div className="rounded-3xl border-2 border-white/80 bg-white/95 p-6 sm:p-7 backdrop-blur-xl shadow-2xl shadow-purple-950/40 text-gray-900 text-left">
              <div className="flex items-center gap-3.5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#8641df] to-purple-800 text-2xl shadow-md shadow-purple-500/20 text-white">
                  🎂
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#14092e]">
                    Pacotes 2026 Oficiais
                  </h3>
                  <p className="text-xs text-gray-600 font-medium">
                    Valores fechados com buffet e brinquedos
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between rounded-2xl bg-purple-50/90 border border-purple-100/90 px-4 py-3 transition hover:bg-purple-100/70">
                  <span className="font-bold text-sm text-[#14092e]">🍭 #Pacote Pirulito</span>
                  <span className="font-display text-sm sm:text-base font-extrabold text-[#8641df]">
                    A partir de R$ 9.490
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-purple-50/90 border border-purple-100/90 px-4 py-3 transition hover:bg-purple-100/70">
                  <span className="font-bold text-sm text-[#14092e]">🎈 #Pacote Diversão</span>
                  <span className="font-display text-sm sm:text-base font-extrabold text-[#8641df]">
                    A partir de R$ 9.940
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-purple-50/90 border border-purple-100/90 px-4 py-3 transition hover:bg-purple-100/70">
                  <span className="font-bold text-sm text-[#14092e]">🔥 #Pacote Churrasco</span>
                  <span className="font-display text-sm sm:text-base font-extrabold text-[#8641df]">
                    A partir de R$ 10.431
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-2">
                <button
                  type="button"
                  onClick={() => openChat()}
                  className="btn-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8641df] hover:bg-purple-700 px-4 py-3.5 font-display text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition hover:scale-[1.01] active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Falar com a Sofia agora mesmo →</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SEÇÃO TEMÁTICA: O QUE CONQUISTA PAIS E CRIANÇAS */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="text-left max-w-3xl">
            <span className="rounded-full bg-purple-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-purple-800">
              A Fórmula da Festa Perfeita
            </span>
            <h2 className="mt-3.5 font-display text-3xl sm:text-5xl font-bold text-[#14092e] leading-tight">
              Diversão mágica para eles.{" "}
              <span className="text-[#8641df]">Paz de espírito para você.</span>
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-gray-600 leading-relaxed">
              Criamos a Casa Prime pensando no que os pais realmente precisam para aproveitar a festa do filho sem estresse, exaustão ou imprevistos.
            </p>
          </Reveal>

          {/* Comparativo lúdico em 2 colunas */}
          <div className="mt-12 sm:mt-14 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {/* Bloco Criança */}
            <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/80 via-white to-pink-50/40 p-6 sm:p-10 shadow-xl text-left">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl sm:text-4xl">🎠</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                    O Paraíso dos Pequenos
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#14092e] leading-snug">
                    Alegria do Primeiro ao Último Minuto
                  </h3>
                </div>
              </div>
              <ul className="mt-6 sm:mt-7 space-y-3.5 sm:space-y-4">
                {[
                  "Piscina aquecida quentinha para brincar o ano inteiro com castelinho e escorregador.",
                  "Futebol de sabão para gastar toda a energia com os amiguinhos.",
                  "Pula-pula gigante, brinquedoteca lúdica e mini circuito com monitores.",
                  "Barraquinha de algodão doce fresquinho e pipoca crocante à vontade.",
                  "Espaço seguro, amplo e sem riscos para correrem livres.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-gray-700 leading-normal">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-pink-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bloco Pais */}
            <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/80 via-white to-purple-50/40 p-6 sm:p-10 shadow-xl text-left">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl sm:text-4xl">🥂</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    O Conforto dos Pais
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#14092e] leading-snug">
                    Você Como Convidado de Honra
                  </h3>
                </div>
              </div>
              <ul className="mt-6 sm:mt-7 space-y-3.5 sm:space-y-4">
                {[
                  "12 horas livres de salão: chegue cedo para fotos e decoração sem correria de relógio.",
                  "Buffet elogiado por todos: carnes nobres, petiscos e bebidas servidos no ponto ideal.",
                  "Monitores cuidando das crianças enquanto você conversa e brinda com seus amigos.",
                  "Estrutura completa com banheiros limpos, ar-condicionado e área para os adultos relaxarem.",
                  "Equipe atenciosa cuidando de todo o suporte durante a celebração.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-gray-700 leading-normal">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-amber-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Grid de Diferenciais */}
          <Reveal stagger className="mt-12 sm:mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {diferenciaisPais.map((d) => (
              <div
                key={d.title}
                className="group rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-lg shadow-purple-900/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-purple-200 text-left"
              >
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-purple-50 text-[#8641df] transition-colors group-hover:bg-[#8641df] group-hover:text-white">
                  <d.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#14092e] leading-snug">
                  {d.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-gray-600">{d.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* SEÇÃO DE PACOTES E VALORES REAIS (DA IMAGEM ANEXADA) */}
      <section id="tabela-valores" className="bg-[#14092e] py-16 sm:py-24 text-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-10 sm:mb-12 text-left max-w-4xl">
            <span className="rounded-full bg-[#ffcb03] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#14092e]">
              Transparência para a sua Família
            </span>
            <h2 className="mt-3.5 font-display text-3xl sm:text-5xl font-bold leading-tight">
              Nossos Pacotes Oficiais &amp; <span className="text-[#ffcb03]">Valores</span>
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-purple-200 leading-relaxed">
              Veja exatamente o que cada pacote oferece para a sua festa infantil. Selecione o número de convidados e conheça o valor de referência em tempo real.
            </p>
          </Reveal>

          {/* Componente Interativo com os dados exatos do flyer */}
          <TabelaPacotesValores />

          {/* Banner de apoio para simulação */}
          <div className="mt-12 sm:mt-14 rounded-3xl border border-purple-500/30 bg-purple-900/40 p-6 sm:p-10 backdrop-blur-md text-left max-w-4xl">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
              Quer uma proposta personalizada para a data do seu filho?
            </h3>
            <p className="mt-3 text-base text-purple-200 leading-relaxed">
              Nosso chatbot monta seu orçamento com todos os detalhes e envia diretamente para o WhatsApp do dono da Casa Prime!
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-start gap-3.5">
              <Link
                to="/orcamento"
                className="btn-shine w-full sm:w-auto text-center rounded-2xl bg-[#ffcb03] px-7 py-4 font-display text-base font-bold text-[#14092e] shadow-md hover:bg-[#ebd200]"
              >
                Simular no Chatbot Agora 🎈
              </Link>
              <a
                href={waLink("Olá, Casa Prime! Gostaria de tirar dúvidas sobre os pacotes de festa infantil.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white hover:bg-white/20"
              >
                Falar pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE DEPOIMENTOS DE PAIS */}
      <section className="bg-gradient-to-b from-white to-purple-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="text-left max-w-3xl">
            <span className="rounded-full bg-purple-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-purple-800">
              Quem Já Comemorou Aqui
            </span>
            <h2 className="mt-3.5 font-display text-3xl sm:text-5xl font-bold text-[#14092e] leading-tight">
              O que dizem os pais que viveram a magia
            </h2>
            <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
              Mais de 500 famílias já confiaram os aniversários mais especiais dos seus filhos à Casa Prime.
            </p>
          </Reveal>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {depoimentos.map((dep) => (
              <div
                key={dep.nome}
                className="rounded-3xl border border-purple-100 bg-white p-7 sm:p-8 shadow-lg shadow-purple-900/5 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex gap-1 text-[#ffcb03]">
                    {Array.from({ length: dep.estrelas }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-gray-700 italic">
                    "{dep.texto}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-left">
                  <div className="font-display text-lg font-bold text-[#14092e]">{dep.nome}</div>
                  <div className="text-sm font-semibold text-purple-700">{dep.evento}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA PREVIEW */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 text-left">
        <Reveal className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Galeria de Momentos
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#14092e] leading-tight">
              Cenários que encantam pequenos e grandes
            </h2>
            <div className="mt-3 h-1.5 w-16 rounded-full bg-[#8641df]" />
          </div>
          <Link
            to="/galeria"
            className="hidden text-sm font-bold text-[#8641df] hover:underline sm:inline-flex"
          >
            Ver fotos completas →
          </Link>
        </Reveal>
        <Reveal stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { url: "/images/salao-decorado-azul.jpg", alt: "Salão decorado com mesas azuis e vista para a piscina" },
            { url: "/images/salao-decorado-rosa.jpg", alt: "Salão nobre com decoração rosa e painel iluminado" },
            { url: "/images/decoracao-safari.jpg", alt: "Decoração temática safari no pergolado com balões" },
            { url: "/images/algodao-doce-pipoca.jpg", alt: "Barraquinha de algodão doce e pipoca à beira da piscina" },
          ].map((item, i) => (
            <Link
              key={item.url}
              to="/galeria"
              className={`overflow-hidden rounded-2xl shadow-lg group relative block ${
                i === 0 ? "col-span-2 row-span-2 md:col-span-2" : ""
              }`}
            >
              <img
                src={item.url}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 aspect-video md:aspect-auto"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </Link>
          ))}
        </Reveal>
      </section>

      {/* CTA FINAL — Conexão Direta com o Dono */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Reveal className="rounded-3xl bg-gradient-to-r from-[#8641df] to-[#5a1b9a] p-7 sm:p-14 text-left text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 text-left">
              <span className="rounded-full bg-[#ffcb03] px-4 py-1 text-xs font-bold uppercase text-[#14092e]">
                Reserve com Tranquilidade
              </span>
              <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold leading-tight">
                Vamos sonhar juntos com a festa do seu filho?
              </h2>
              <p className="mt-3.5 max-w-xl text-base sm:text-lg text-purple-100 leading-relaxed">
                Datas em finais de semana costumam esgotar com meses de antecedência. Simule seu orçamento agora ou converse direto com a gente no WhatsApp!
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-start gap-4">
                <Link
                  to="/orcamento"
                  className="btn-shine w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ffcb03] px-8 py-4 font-display text-base sm:text-lg font-bold text-[#14092e] shadow-lg hover:bg-[#ebd200]"
                >
                  <Sparkles className="h-5 w-5" />
                  Simular Orçamento Online
                </Link>
                <a
                  href={waLink("Olá, Casa Prime! Gostaria de verificar as datas disponíveis para a festa do meu filho.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-8 py-4 font-display text-base sm:text-lg font-bold text-white shadow-lg hover:bg-[#20ba59]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Conversar no WhatsApp
                </a>
              </div>

              <p className="mt-8 text-xs text-purple-200">
                Siga nosso Instagram oficial:{" "}
                <a
                  href="https://instagram.com/casaprimeeventos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#ffcb03] underline underline-offset-4"
                >
                  @casaprimeeventos
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <EscolherPacoteDialog open={escolherOpen} onOpenChange={setEscolherOpen} />
    </>
  );
}
