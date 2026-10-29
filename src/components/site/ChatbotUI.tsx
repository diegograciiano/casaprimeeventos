import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  X,
  Send,
  CalendarIcon,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  RefreshCw,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { WHATSAPP_NUMBER, waLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { syncProgressiveLeadPublic } from "@/lib/leads.functions";
import { pacotes, FAIXAS_PESSOAS, getValorPacote, type Pacote } from "@/data/pacotes";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type ChatbotMode = "floating" | "page";

type Msg = {
  id: string;
  role: "bot" | "user";
  text: string;
};

type Step =
  | "nome"
  | "telefone"
  | "email"
  | "aniversariante_tipo"
  | "idade"
  | "data_festa"
  | "qtd_pessoas"
  | "pacote"
  | "tema"
  | "resumo";

type LeadState = {
  nome: string;
  telefone: string;
  email?: string;
  criancaNome: string;
  idade?: number;
  data: string;
  qtdPessoas: number;
  pacoteId: string;
  pacoteNome: string;
  valorCalculado: number;
  valorFormatado: string;
  tema: string;
};

const emptyLead: LeadState = {
  nome: "",
  telefone: "",
  criancaNome: "",
  data: "",
  qtdPessoas: 70,
  pacoteId: "",
  pacoteNome: "",
  valorCalculado: 0,
  valorFormatado: "",
  tema: "",
};

const OPCOES_PARENTESCO = [
  "👦 Meu filho",
  "👧 Minha filha",
  "👶 Gêmeos / 2 filhos",
  "🎉 Outro aniversariante",
];

const OPCOES_IDADES = [
  { label: "1 aninho 🎈", valor: 1 },
  { label: "2 anos", valor: 2 },
  { label: "3 anos", valor: 3 },
  { label: "4 anos", valor: 4 },
  { label: "5 anos ⭐", valor: 5 },
  { label: "6 anos", valor: 6 },
  { label: "7 anos", valor: 7 },
  { label: "8 a 10 anos", valor: 8 },
  { label: "11+ anos", valor: 11 },
];

const OPCOES_DATAS = [
  "Próximos 30 dias",
  "Daqui a 2 a 3 meses",
  "Novembro 2026",
  "Dezembro 2026",
  "Início de 2027",
  "Segundo Semestre 2027",
  "Ainda sem data definida",
];

const OPCOES_TEMAS = [
  "🦁 Safari / Selvinha",
  "👑 Princesas / Realeza",
  "🦸 Super-Heróis",
  "🚜 Fazendinha",
  "🦄 Unicórnio / Mágico",
  "🎪 Circo / Parque",
  "🎈 Balões Coloridos",
  "✨ A definir / Surpresa",
];

function maskPhoneBR(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function isPhone(v: string) {
  return v.replace(/\D/g, "").length >= 10;
}

function firstName(v: string) {
  return v.trim().split(/\s+/)[0] ?? "";
}

function buildWhatsAppBudgetMsg(lead: LeadState): string {
  const lines: string[] = [
    "🎉 *NOVO PEDIDO DE ORÇAMENTO — CASA PRIME EVENTOS* 🎉",
    "",
    "Olá, Casa Prime! 👋 Simulei o orçamento pelo site e gostaria de verificar a disponibilidade e conversar sobre a festa:",
    "",
    `👤 *Responsável:* ${lead.nome}`,
    `📱 *WhatsApp:* ${lead.telefone}`,
  ];

  if (lead.email) {
    lines.push(`✉️ *E-mail:* ${lead.email}`);
  }

  if (lead.criancaNome) {
    const idadeStr = lead.idade ? ` (${lead.idade} anos)` : "";
    lines.push(`🎂 *Aniversariante:* ${lead.criancaNome}${idadeStr}`);
  }

  if (lead.data) {
    lines.push(`📅 *Data pretendida:* ${lead.data}`);
  }

  if (lead.qtdPessoas) {
    lines.push(`👥 *Nº de convidados:* ${lead.qtdPessoas} pessoas`);
  }

  if (lead.pacoteNome) {
    lines.push(`🎁 *Pacote escolhido:* ${lead.pacoteNome}`);
  }

  if (lead.valorFormatado) {
    lines.push(`💰 *Valor de referência tabelado:* ${lead.valorFormatado}`);
  }

  if (lead.tema) {
    lines.push(`🎨 *Tema pretendido:* ${lead.tema}`);
  }

  lines.push(
    "",
    "✨ *O que está incluso:*",
    "• 12h de espaço exclusivo",
    "• Piscina aquecida para crianças e adultos",
    "• Brinquedos modernos com monitores",
    "• Barraquinha de algodão doce e pipoca ilimitados",
    "• Buffet completo, bebidas e sobremesas",
    "• Equipe Prime a postos",
    "",
    "Podemos agendar uma visita e conferir a data na agenda? Obrigado(a)! 🎈",
  );

  return lines.join("\n");
}

export function ChatbotUI({
  mode,
  onClose,
  initialPacoteId,
}: {
  mode: ChatbotMode;
  onClose?: () => void;
  initialPacoteId?: string;
}) {
  const isPage = mode === "page";
  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("nome");
  const [lead, setLead] = useState<LeadState>(() => {
    if (initialPacoteId) {
      const pac = pacotes.find((p) => p.id === initialPacoteId);
      if (pac) {
        const val = pac.valores.find((v) => v.pessoas === 70);
        return {
          ...emptyLead,
          pacoteId: pac.id,
          pacoteNome: pac.nome,
          valorCalculado: val?.valor ?? 0,
          valorFormatado: val?.valorFormatado ?? pac.aPartirDe,
        };
      }
    }
    return emptyLead;
  });

  const syncLeadServer = useServerFn(syncProgressiveLeadPublic);
  const leadDbIdRef = useRef<string | null>(null);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [salvandoCrm, setSalvandoCrm] = useState(false);
  const [crmSalvo, setCrmSalvo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasGreetedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const safeTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutIdsRef.current.push(id);
    return id;
  };

  const pushBot = (text: string) =>
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "bot", text }]);
  const pushUser = (text: string) =>
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text }]);

  // Initial greeting (com trava estrita contra duplicações)
  useEffect(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;

    pushBot(
      "Olá, papai ou mamãe! 🎈 Que alegria ter você aqui na **Casa Prime Eventos**!\n\nEu sou a **Sofia**, consultora do espaço. Vou te ajudar a simular o orçamento ideal da sua festa com opções rápidas em poucos cliques! 💛",
    );
    safeTimeout(() => {
      pushBot("Pra gente começar: qual é o seu **nome completo**? 😊");
      safeTimeout(() => inputRef.current?.focus(), 150);
    }, 400);

    return () => {
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  useEffect(() => {
    safeTimeout(() => inputRef.current?.focus(), 50);
  }, [step]);

  // Persist to Supabase leads_festas CRM progressivamente a cada resposta
  const salvarNoCRM = async (dados: LeadState) => {
    if (!dados.nome || !dados.telefone) return;
    setSalvandoCrm(true);

    const serverPayload = {
      sessionId,
      responsavel_nome: dados.nome.trim(),
      telefone: dados.telefone.trim(),
      email: dados.email?.trim() || null,
      crianca_nome: dados.criancaNome || null,
      idade: dados.idade || null,
      data_festa: dados.data || null,
      qtd_pessoas: dados.qtdPessoas || null,
      pacote: dados.pacoteNome || dados.pacoteId || null,
      tema: dados.tema || null,
      valor: dados.valorCalculado || null,
      restricoes: dados.valorFormatado
        ? `Simulação pelo Chatbot. Valor: ${dados.valorFormatado}`
        : "Lead em qualificação pelo Chatbot",
    };

    const clientPayload = {
      session_id: sessionId,
      responsavel_nome: dados.nome.trim(),
      telefone: dados.telefone.trim(),
      email: dados.email?.trim() || null,
      crianca_nome: dados.criancaNome || null,
      idade: dados.idade || null,
      data_festa: dados.data || null,
      qtd_pessoas: dados.qtdPessoas || null,
      pacote: dados.pacoteNome || dados.pacoteId || null,
      tema: dados.tema || null,
      valor: dados.valorCalculado || null,
      restricoes: dados.valorFormatado
        ? `Simulação pelo Chatbot. Valor: ${dados.valorFormatado}`
        : "Lead em qualificação pelo Chatbot",
      status: "novo",
      updated_at: new Date().toISOString(),
    };

    try {
      if (leadDbIdRef.current) {
        await supabase
          .from("leads_festas")
          .update(clientPayload)
          .eq("id", leadDbIdRef.current);
      } else {
        const { data, error } = await supabase
          .from("leads_festas")
          .upsert(clientPayload, { onConflict: "session_id" })
          .select("id")
          .maybeSingle();

        if (data?.id) {
          leadDbIdRef.current = data.id;
        } else if (error) {
          // Fallback para TanStack Start server function (ignora RLS se service_role estiver configurado)
          const res = await syncLeadServer({ data: serverPayload });
          if (res?.id) leadDbIdRef.current = res.id;
        }
      }
      setCrmSalvo(true);
    } catch (e) {
      console.warn("Client sync failed, running server fallback:", e);
      try {
        const res = await syncLeadServer({ data: serverPayload });
        if (res?.id) leadDbIdRef.current = res.id;
        setCrmSalvo(true);
      } catch (errServer) {
        console.error("CRM server fallback error:", errServer);
      }
    } finally {
      setSalvandoCrm(false);
    }
  };

  const submitText = () => {
    const raw = input.trim();
    if (!raw || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    pushUser(raw);
    setInput("");
    handleText(raw);
    safeTimeout(() => {
      isSubmittingRef.current = false;
    }, 350);
  };

  const handleText = (text: string) => {
    if (step === "nome") {
      if (text.length < 2) {
        pushBot("Poderia me dizer seu nome completinho? Assim já deixo seu atendimento salvo com carinho. 😊");
        isSubmittingRef.current = false;
        return;
      }
      const nome = text;
      setLead((l) => ({ ...l, nome }));
      safeTimeout(() => {
        pushBot(
          `Prazer em te conhecer, ${firstName(nome)}! 💛\n\nAgora informe o seu **WhatsApp com DDD** para receber o orçamento e a confirmação de data:`,
        );
        setStep("telefone");
        isSubmittingRef.current = false;
      }, 350);
      return;
    }

    if (step === "telefone") {
      if (!isPhone(text)) {
        pushBot("Por favor, digite com DDD e número (ex: 62 99999-9999) para garantirmos o envio certinho! 📱");
        isSubmittingRef.current = false;
        return;
      }
      const telefone = text;
      const updated = { ...lead, telefone };
      setLead(updated);
      void salvarNoCRM(updated); // Salva no CRM imediatamente ao informar o telefone!

      safeTimeout(() => {
        pushBot(
          `Perfeito, ${firstName(lead.nome)}! 📱\n\nAgora, qual é o seu melhor **e-mail**? Assim podemos te enviar a proposta detalhada com fotos! ✉️\n\n*(Ou toque no botão abaixo para pular)*`,
        );
        setStep("email");
        isSubmittingRef.current = false;
      }, 350);
      return;
    }

    if (step === "email") {
      const emailTrimmed = text.trim().toLowerCase();
      if (!emailTrimmed.includes("@") || !emailTrimmed.includes(".")) {
        pushBot("Por favor, digite um e-mail válido (ex: seuemail@gmail.com) ou toque no botão de pular logo abaixo! 😊");
        isSubmittingRef.current = false;
        return;
      }
      const updated = { ...lead, email: emailTrimmed };
      setLead(updated);
      void salvarNoCRM(updated);

      safeTimeout(() => {
        pushBot(
          `E-mail salvo com sucesso! ✉️\n\nQuem é a estrela dessa celebração mágica? Selecione uma das opções abaixo: 👇`,
        );
        setStep("aniversariante_tipo");
        isSubmittingRef.current = false;
      }, 350);
      return;
    }

    if (step === "data_festa") {
      handleEscolhaData(text);
      return;
    }

    if (step === "tema") {
      handleEscolhaTema(text);
      return;
    }
  };

  // Handlers baseados em botões (SEM PRECISAR ESCREVER)
  const handlePularEmail = () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    pushUser("Prefiro não informar e-mail");
    safeTimeout(() => {
      pushBot(
        `Sem problemas, podemos continuar por aqui! ✨\n\nQuem é a estrela dessa celebração mágica? Selecione uma das opções abaixo: 👇`,
      );
      setStep("aniversariante_tipo");
      isSubmittingRef.current = false;
    }, 350);
  };

  const handleEscolhaParentesco = (tipo: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    pushUser(tipo);
    const updated = { ...lead, criancaNome: tipo };
    setLead(updated);
    void salvarNoCRM(updated); // Atualiza progressivamente no Supabase

    safeTimeout(() => {
      pushBot(
        "Que alegria comemorar esse aniversário! 🎂\n\n**Quantos aninhos** ele(a) vai completar? Selecione abaixo: 👇",
      );
      setStep("idade");
      isSubmittingRef.current = false;
    }, 350);
  };

  const handleEscolhaIdade = (idadeItem: { label: string; valor: number }) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    pushUser(idadeItem.label);
    const updated = { ...lead, idade: idadeItem.valor };
    setLead(updated);
    void salvarNoCRM(updated); // Atualiza progressivamente no Supabase

    safeTimeout(() => {
      pushBot(
        `Uma idade linda demais! Toda criança ama nossa piscina aquecida e os brinquedos! 🎉\n\n**Qual a época ou data pretendida** para a festa? Escolha uma opção: 👇`,
      );
      setStep("data_festa");
      isSubmittingRef.current = false;
    }, 350);
  };

  const handleEscolhaData = (dataTexto: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    pushUser(dataTexto);
    const updated = { ...lead, data: dataTexto };
    setLead(updated);
    void salvarNoCRM(updated); // Atualiza progressivamente no Supabase

    safeTimeout(() => {
      pushBot(
        `Anotado! 🗓️\n\nAgora selecione o **número de convidados** (adultos + crianças) para o seu evento: 👇`,
      );
      setStep("qtd_pessoas");
      isSubmittingRef.current = false;
    }, 350);
  };

  const handleEscolhaPessoas = (qtd: number) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    pushUser(`${qtd} convidados`);
    let updatedValor = 0;
    let updatedFormatado = "";

    if (lead.pacoteId) {
      const v = getValorPacote(lead.pacoteId, qtd);
      if (v) {
        updatedValor = v.valor;
        updatedFormatado = v.valorFormatado;
      }
    }

    const updated = {
      ...lead,
      qtdPessoas: qtd,
      valorCalculado: updatedValor,
      valorFormatado: updatedFormatado,
    };
    setLead(updated);
    void salvarNoCRM(updated); // Atualiza progressivamente no Supabase

    safeTimeout(() => {
      pushBot(
        `Ótimo tamanho de festa! ${qtd} pessoas aproveitam muito o nosso salão amplo e as piscinas.\n\nEscolha o **pacote com buffet** que mais combina com o estilo da sua família: 🎁`,
      );
      setStep("pacote");
      isSubmittingRef.current = false;
    }, 350);
  };

  const handleEscolhaPacote = (pacote: Pacote) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    pushUser(pacote.tag);
    const valorObj = pacote.valores.find((v) => v.pessoas === lead.qtdPessoas);
    const valorCalculado = valorObj?.valor ?? 0;
    const valorFormatado = valorObj?.valorFormatado ?? pacote.aPartirDe;

    const updated = {
      ...lead,
      pacoteId: pacote.id,
      pacoteNome: pacote.nome,
      valorCalculado,
      valorFormatado,
    };
    setLead(updated);
    void salvarNoCRM(updated); // Atualiza progressivamente no Supabase

    const destaques = pacote.secoes
      .slice(0, 3)
      .map((s) => `• **${s.titulo}:** ${s.itens.slice(0, 3).join(", ")}`)
      .join("\n");

    safeTimeout(() => {
      pushBot(
        `✨ Escolha fantástica, ${firstName(lead.nome)}!\n\nNo **${pacote.nome}** para **${lead.qtdPessoas} pessoas**, o valor oficial é **${valorFormatado}**.\n\n**O que está incluso:**\n${destaques}\n• **Brinquedos:** Futebol de sabão, pula-pula, castelinho na piscina e brinquedoteca\n• **Espaço:** 12 horas livres + piscina aquecida + barraquinha de algodão doce e pipoca ilimitados!\n\nQual **tema de decoração** você imagina para o grande dia? Toque em uma das opções abaixo: 🎨`,
      );
      setStep("tema");
      isSubmittingRef.current = false;
    }, 400);
  };

  const handleEscolhaTema = (temaEscolhido: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    pushUser(temaEscolhido);
    const updatedLead = { ...lead, tema: temaEscolhido };
    setLead(updatedLead);
    void salvarNoCRM(updatedLead); // Atualiza progressivamente no Supabase
    concluirOrcamento(updatedLead);
  };

  const concluirOrcamento = (dadosFinais: LeadState) => {
    void salvarNoCRM(dadosFinais);
    safeTimeout(() => {
      pushBot(
        `🎉 **Tudo pronto, ${firstName(dadosFinais.nome)}!**\n\nSeu orçamento foi montado e **já foi registrado no nosso CRM interno**. 📋\n\nToque no botão verde abaixo para enviar todos os dados diretamente para o **WhatsApp do proprietário da Casa Prime** e confirmar a disponibilidade da data com prioridade! 👇`,
      );
      setStep("resumo");
      isSubmittingRef.current = false;
    }, 450);
  };

  const reiniciar = () => {
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];
    isSubmittingRef.current = false;
    setMessages([]);
    setLead(emptyLead);
    setCrmSalvo(false);
    setSessionId(crypto.randomUUID());
    setStep("nome");
    safeTimeout(() => {
      pushBot("Vamos começar um novo orçamento! 🎈 Qual é o seu **nome completo**?");
    }, 200);
  };

  const outerClass = isPage
    ? "flex min-h-[90vh] w-full items-center justify-center py-6 px-3 sm:px-6"
    : "fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-sm";

  const innerClass = isPage
    ? "flex h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-2xl"
    : "animate-pop-in flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl sm:h-[680px] sm:rounded-3xl border border-purple-100";

  // Mostrar caixa de texto apenas nos passos onde digitação é estritamente necessária ou opcional
  const showFreeInput =
    step === "nome" ||
    step === "telefone" ||
    step === "email" ||
    step === "data_festa" ||
    step === "tema";

  const placeholder =
    step === "nome"
      ? "Seu nome completo..."
      : step === "telefone"
        ? "(62) 99999-9999"
        : step === "email"
          ? "seuemail@exemplo.com"
          : step === "data_festa"
            ? "Ou digite outra data..."
            : step === "tema"
              ? "Ou digite outro tema..."
              : "";

  return (
    <div className={outerClass}>
      <div className={innerClass}>
        {/* Header Temático */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#8641df] via-[#a367f0] to-[#ffcb03] px-5 py-3.5 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-2 shadow-inner">
                <img src="/logo-icone-branca.png" alt="Casa Prime" className="h-full w-full object-contain" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base sm:text-lg font-bold tracking-wide">
                  Sofia · Consultora Prime
                </span>
                <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Online
                </span>
              </div>
              <div className="text-xs text-white/95 font-medium">
                Simulador Rápido por Botões 🎂
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-2 transition hover:bg-white/20 active:scale-95"
              aria-label="Fechar"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          )}
        </div>

        {/* Mensagens do Chat */}
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          className="flex-1 space-y-3.5 overflow-y-auto bg-gradient-to-b from-purple-50/50 via-white to-purple-50/30 p-4 sm:p-5"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[85%] rounded-3xl px-5 py-3.5 text-sm sm:text-base shadow-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-xs bg-[#8641df] text-white"
                    : "rounded-bl-xs bg-white text-gray-800 border border-purple-100 shadow-md shadow-purple-900/5 text-left"
                }`}
              >
                {m.role === "user" ? (
                  m.text
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkBreaks]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-purple-950">{children}</strong>,
                      ul: ({ children }) => <ul className="my-2 space-y-1.5 pl-1">{children}</ul>,
                      li: ({ children }) => <li className="text-sm text-gray-700 leading-normal">{children}</li>,
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {/* 0. OPÇÃO DE PULAR E-MAIL */}
          {step === "email" && (
            <div className="pt-2 animate-in fade-in text-left">
              <div className="mb-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-800">
                Digite seu e-mail abaixo ou:
              </div>
              <button
                type="button"
                onClick={handlePularEmail}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-purple-200 bg-white px-4 py-3 font-display text-xs sm:text-sm font-bold text-purple-700 hover:border-purple-400 hover:bg-purple-50 transition active:scale-95 shadow-sm"
              >
                <span>Pular este passo (não informar e-mail)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* 1. OPÇÕES DE PARENTESCO / ANIVERSARIANTE (SEM DIGITAR) */}
          {step === "aniversariante_tipo" && (
            <div className="pt-2 animate-in fade-in text-left">
              <div className="mb-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-800">
                Selecione quem vai comemorar:
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {OPCOES_PARENTESCO.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => handleEscolhaParentesco(opcao)}
                    className="flex items-center justify-center rounded-2xl border-2 border-purple-100 bg-white p-3.5 text-center font-display text-sm sm:text-base font-bold text-gray-800 shadow-sm transition hover:border-[#8641df] hover:bg-purple-50 hover:scale-[1.02] active:scale-95"
                  >
                    {opcao}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. OPÇÕES DE IDADE (SEM DIGITAR) */}
          {step === "idade" && (
            <div className="pt-2 animate-in fade-in text-left">
              <div className="mb-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-800">
                Selecione a idade a comemorar:
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {OPCOES_IDADES.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleEscolhaIdade(item)}
                    className="flex items-center justify-center rounded-2xl border-2 border-purple-100 bg-white py-3 px-2 text-center font-display text-xs sm:text-sm font-bold text-gray-800 shadow-sm transition hover:border-[#8641df] hover:bg-purple-50 hover:scale-[1.02] active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. OPÇÕES DE DATA / ÉPOCA (SEM DIGITAR) */}
          {step === "data_festa" && (
            <div className="pt-2 animate-in fade-in text-left space-y-2.5">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-800">
                Toque na época pretendida ou escolha a data:
              </div>
              <div className="flex flex-wrap gap-2">
                {OPCOES_DATAS.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => handleEscolhaData(opcao)}
                    className="rounded-2xl border-2 border-purple-100 bg-white px-3.5 py-2.5 font-display text-xs sm:text-sm font-bold text-gray-800 shadow-sm transition hover:border-[#8641df] hover:bg-purple-50 active:scale-95"
                  >
                    {opcao}
                  </button>
                ))}
              </div>

              {/* Botão de calendário opcional */}
              <div className="pt-1">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start rounded-2xl border-purple-200 text-left font-normal text-xs sm:text-sm h-11 bg-white",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-purple-600" />
                      {selectedDate
                        ? format(selectedDate, "dd/MM/yyyy")
                        : "📅 Ou escolher dia exato no calendário"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (!date || isSubmittingRef.current) return;
                        setSelectedDate(date);
                        setCalendarOpen(false);
                        const formatted = format(date, "dd/MM/yyyy");
                        handleEscolhaData(formatted);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* 4. OPÇÕES DE CONVIDADOS (SEM DIGITAR) */}
          {step === "qtd_pessoas" && (
            <div className="pt-2 animate-in fade-in text-left">
              <div className="mb-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-800">
                Selecione o número de convidados:
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {FAIXAS_PESSOAS.map((qtd) => (
                  <button
                    key={qtd}
                    onClick={() => handleEscolhaPessoas(qtd)}
                    className="flex flex-col items-center rounded-2xl border-2 border-purple-100 bg-white p-3.5 font-semibold text-gray-800 shadow-sm transition hover:border-[#8641df] hover:bg-purple-50 hover:scale-105 active:scale-95"
                  >
                    <span className="font-display text-xl sm:text-2xl font-bold text-[#8641df]">{qtd}</span>
                    <span className="text-xs sm:text-sm text-gray-600">pessoas</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. OPÇÕES DE PACOTES (SEM DIGITAR) */}
          {step === "pacote" && (
            <div className="space-y-2.5 pt-2 animate-in fade-in text-left">
              <div className="mb-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-800">
                Escolha o pacote desejado ({lead.qtdPessoas} pessoas):
              </div>
              {pacotes.map((p) => {
                const valorItem = p.valores.find((v) => v.pessoas === lead.qtdPessoas);
                return (
                  <button
                    key={p.id}
                    onClick={() => handleEscolhaPacote(p)}
                    className="flex w-full items-center justify-between rounded-2xl border-2 border-purple-100 bg-white p-4 text-left transition hover:border-[#8641df] hover:bg-purple-50/80 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-purple-700">{p.tag}</span>
                        {p.badge && (
                          <span className="rounded-full bg-[#ffcb03] px-2.5 py-0.5 text-xs font-bold text-[#14092e]">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-display text-lg sm:text-xl font-bold text-gray-900">{p.nome}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{p.subtitulo}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-gray-400">Total</div>
                      <div className="font-display text-lg sm:text-xl font-extrabold text-[#8641df]">
                        {valorItem?.valorFormatado ?? p.aPartirDe}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 6. OPÇÕES DE TEMA (SEM DIGITAR) */}
          {step === "tema" && (
            <div className="pt-2 animate-in fade-in text-left">
              <div className="mb-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-800">
                Toque no tema desejado:
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {OPCOES_TEMAS.map((tema) => (
                  <button
                    key={tema}
                    onClick={() => handleEscolhaTema(tema)}
                    className="flex items-center justify-center rounded-2xl border-2 border-purple-100 bg-white p-3 text-center font-display text-xs sm:text-sm font-bold text-gray-800 shadow-sm transition hover:border-[#8641df] hover:bg-purple-50 hover:scale-[1.02] active:scale-95"
                  >
                    {tema}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resumo Final & Envio Direto ao WhatsApp do Dono */}
          {step === "resumo" && (
            <div className="space-y-4 pt-3 animate-in zoom-in-95 duration-300 text-left">
              {/* Cartão de Resumo */}
              <div className="rounded-3xl border-2 border-purple-200 bg-white p-5 sm:p-6 shadow-xl shadow-purple-900/10 text-left">
                <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#ffcb03]" />
                    <span className="font-display text-base sm:text-lg font-bold text-purple-950">
                      Resumo da Festa dos Sonhos
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Salvo no CRM
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                  <div>
                    <span className="text-gray-500">Responsável:</span>{" "}
                    <strong className="text-gray-900">{lead.nome}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">WhatsApp:</span>{" "}
                    <strong className="text-gray-900">{lead.telefone}</strong>
                  </div>
                  {lead.email && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">E-mail:</span>{" "}
                      <strong className="text-gray-900">{lead.email}</strong>
                    </div>
                  )}
                  {lead.criancaNome && (
                    <div>
                      <span className="text-gray-500">Aniversariante:</span>{" "}
                      <strong className="text-gray-900">{lead.criancaNome}</strong>
                    </div>
                  )}
                  {lead.data && (
                    <div>
                      <span className="text-gray-500">Data pretendida:</span>{" "}
                      <strong className="text-gray-900">{lead.data}</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Convidados:</span>{" "}
                    <strong className="text-purple-700">{lead.qtdPessoas} pessoas</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Pacote:</span>{" "}
                    <strong className="text-purple-700">{lead.pacoteNome}</strong>
                  </div>
                  {lead.tema && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Tema/Observações:</span>{" "}
                      <strong className="text-gray-900">{lead.tema}</strong>
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-r from-purple-50 to-amber-50 p-4 border border-purple-200/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase text-purple-800">
                      Investimento de Referência
                    </div>
                    <div className="text-xs text-gray-500">Com estrutura completa de 12h</div>
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-purple-950">
                    {lead.valorFormatado}
                  </div>
                </div>
              </div>

              {/* Botão de Disparo Direto para o WhatsApp do Dono */}
              <a
                href={waLink(buildWhatsAppBudgetMsg(lead))}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 text-center font-display text-base sm:text-lg font-bold text-white shadow-xl shadow-emerald-500/30 transition-all hover:bg-[#20ba59] hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="h-6 w-6 animate-bounce" />
                <span>Enviar Orçamento para o WhatsApp do Dono</span>
              </a>

              <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Atendimento oficial Casa Prime
                </span>
                <button
                  onClick={reiniciar}
                  className="inline-flex items-center gap-1 font-semibold text-purple-700 hover:underline"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Fazer outra simulação
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Campo de Entrada de Texto (somente onde digitação faz sentido) */}
        {showFreeInput && (
          <div className="border-t border-purple-100 bg-white p-3.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitText();
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) =>
                  setInput(step === "telefone" ? maskPhoneBR(e.target.value) : e.target.value)
                }
                inputMode={step === "telefone" ? "tel" : step === "email" ? "email" : "text"}
                type={step === "email" ? "email" : "text"}
                placeholder={placeholder}
                className="h-11 rounded-2xl border-purple-200 text-base focus-visible:ring-purple-500"
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-2xl bg-[#8641df] hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
