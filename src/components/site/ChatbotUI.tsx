import { useEffect, useRef, useState } from "react";
import { X, Send, ArrowLeft } from "lucide-react";
import maiteAvatar from "@/assets/maite-casa-prime.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { waLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { pacotes, inclusoEmTodos } from "@/data/pacotes";

export type ChatbotMode = "floating" | "page";

type Msg = { id: string; role: "bot" | "user"; text: string };

type Step =
  | "nome"
  | "email"
  | "telefone"
  | "qualificacao"
  | "encerrado"
  | "menu"
  | "visita_data"
  | "visita_resumo"
  | "visita_enviado"
  | "orc_pacote"
  | "orc_detalhe"
  | "atendente";

type LeadState = {
  nome: string;
  email: string;
  telefone: string;
  data: string;
  pacote: string;
};

const emptyLead: LeadState = { nome: "", email: "", telefone: "", data: "", pacote: "" };

const PACOTE_INFO: Record<string, { titulo: string; duracao: string; descricao: string }> = {
  "Pacote Pirulito (Sem Buffet)": {
    titulo: "🍭 Pacote Pirulito — Sem Buffet",
    duracao: "2h de festa",
    descricao:
      "Ideal para quem quer aproveitar o espaço, os brinquedos e a piscina aquecida com entradas caprichadas e sobremesas — sem prato principal servido.",
  },
  "Pacote Diversão (Com Buffet)": {
    titulo: "🎈 Pacote Diversão — Com Buffet",
    duracao: "2h30 de festa + 30min de buffet",
    descricao:
      "Nosso pacote mais escolhido! Buffet completo com entradas, prato principal, bebidas, sobremesa e todos os brinquedos liberados.",
  },
  "Pacote Churrasco (Festa Completa)": {
    titulo: "🔥 Pacote Churrasco — Festa Completa",
    duracao: "3h de festa + extras",
    descricao:
      "Experiência completa com churrasco premium (picanha, cupim, contra filé), acompanhamentos, bebidas, sobremesas e toda a estrutura Prime.",
  },
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
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

function buildWhatsMessage(lead: LeadState, tipo: "visita" | "orcamento" | "personalizado" | "atendente") {
  const linhas: string[] = [];
  if (tipo === "visita") {
    linhas.push("Olá, Casa Prime! 👋 Gostaria de agendar uma visita ao espaço. 🎉");
  } else if (tipo === "orcamento") {
    linhas.push("Olá, Casa Prime! 👋 Gostaria de fechar um orçamento. 💛");
  } else if (tipo === "personalizado") {
    linhas.push("Olá, Casa Prime! 👋 Gostaria de um orçamento personalizado. ✨");
  } else {
    linhas.push("Olá, Casa Prime! 👋 Vim pelo chat do site e gostaria de falar com um atendente. 💛");
  }
  linhas.push("", "*Meus dados:*");
  if (lead.nome) linhas.push(`👤 *Nome:* ${lead.nome}`);
  if (lead.telefone) linhas.push(`📱 *Telefone:* ${lead.telefone}`);
  if (lead.email) linhas.push(`✉️ *E-mail:* ${lead.email}`);
  if (lead.data) linhas.push(`📅 *Data prevista:* ${lead.data}`);
  if (lead.pacote) linhas.push(`🎁 *Pacote de interesse:* ${lead.pacote}`);
  linhas.push("", "Obrigado(a)! 🎈");
  return linhas.join("\n");
}

export function ChatbotUI({
  mode,
  onClose,
}: {
  mode: ChatbotMode;
  onClose?: () => void;
}) {
  const isPage = mode === "page";
  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("nome");
  const [lead, setLead] = useState<LeadState>(emptyLead);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedOnce = useRef(false);

  const pushBot = (text: string) =>
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "bot", text }]);
  const pushUser = (text: string) =>
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text }]);

  // Initial greeting
  useEffect(() => {
    pushBot(
      "Oiê! 🎈 Eu sou a Maitê, da *Casa Prime Eventos* — a casa de festas infantis de Goiânia. Vou te ajudar rapidinho por aqui! 💛",
    );
    setTimeout(() => {
      pushBot("Pra começar, qual é o seu *nome completo*? 😊");
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [step]);

  // Persist lead to Cloud when we have the minimum required fields
  const persistLead = async (partial: Partial<LeadState>) => {
    const merged = { ...lead, ...partial };
    if (!merged.nome || !merged.telefone) return;
    try {
      if (!savedOnce.current) {
        await supabase.from("leads_festas").insert({
          session_id: sessionId,
          responsavel_nome: merged.nome,
          telefone: merged.telefone,
          email: merged.email || null,
          data_festa: merged.data || null,
          pacote: merged.pacote || null,
          status: "novo",
        });
        savedOnce.current = true;
      }
    } catch {
      // silent — chat still works even if save fails
    }
  };

  // ---------- User input handlers ----------
  const submitText = () => {
    const raw = input.trim();
    if (!raw) return;
    pushUser(raw);
    setInput("");
    handleText(raw);
  };

  const handleText = (text: string) => {
    if (step === "nome") {
      if (text.length < 2) {
        pushBot("Hmm, pode me contar seu nome completinho? 🙈");
        return;
      }
      const nome = text;
      setLead((l) => ({ ...l, nome }));
      setTimeout(() => {
        pushBot(`Prazer, ${firstName(nome)}! 💛 Agora me passa seu *e-mail*, por favor.`);
        setStep("email");
      }, 300);
      return;
    }
    if (step === "email") {
      if (!isEmail(text)) {
        pushBot("Esse e-mail parece incompleto. Pode conferir? ✉️");
        return;
      }
      setLead((l) => ({ ...l, email: text }));
      setTimeout(() => {
        pushBot("Perfeito! E qual é o seu *WhatsApp com DDD*? 📱");
        setStep("telefone");
      }, 300);
      return;
    }
    if (step === "telefone") {
      if (!isPhone(text)) {
        pushBot("O telefone precisa ter DDD + número. Exemplo: (62) 99999-9999 📱");
        return;
      }
      const telefone = text;
      setLead((l) => ({ ...l, telefone }));
      void persistLead({ telefone });
      setTimeout(() => {
        pushBot("Anotado! ✨ Uma pergunta rápida: *seu evento é um aniversário infantil?* 🎂");
        setStep("qualificacao");
      }, 300);
      return;
    }
    if (step === "visita_data") {
      setLead((l) => ({ ...l, data: text }));
      void persistLead({ data: text });
      setTimeout(() => {
        pushBot("Perfeito! Deixa eu conferir seus dados: 👇");
        setStep("visita_resumo");
      }, 300);
      return;
    }
  };

  // ---------- Button handlers ----------
  const chooseQualificacao = (yes: boolean) => {
    pushUser(yes ? "Sim" : "Não");
    if (!yes) {
      setTimeout(() => {
        pushBot(
          `Entendi, ${firstName(lead.nome)}! 💛 A Casa Prime é especializada em *festas infantis*, então dessa vez não vamos conseguir te atender — mas agradecemos muito o contato! 🎈`,
        );
        setStep("encerrado");
      }, 300);
      return;
    }
    setTimeout(() => {
      pushBot("Que delícia! 🎉 Como posso te ajudar agora?");
      setStep("menu");
    }, 300);
  };

  const chooseMenu = (opt: "visita" | "orcamento") => {
    pushUser(opt === "visita" ? "🔎 Solicitar uma visita" : "💰 Fazer um orçamento");
    setTimeout(() => {
      if (opt === "visita") {
        pushBot("Ótimo! 🗓️ Você já tem uma *data prevista* para a festa? (pode ser aproximada, ex: 15/03/2026 ou 'ainda não sei')");
        setStep("visita_data");
      } else {
        pushBot("Show! 🎁 Temos 3 pacotes principais. Qual você quer conhecer primeiro?");
        setStep("orc_pacote");
      }
    }, 300);
  };

  const escolherPacote = (pacoteId: string) => {
    pushUser(pacoteId);
    setLead((l) => ({ ...l, pacote: pacoteId }));
    void persistLead({ pacote: pacoteId });
    const info = PACOTE_INFO[pacoteId];
    const pac = pacotes.find((p) => p.id === pacoteId);
    if (!info || !pac) return;
    const incluso = pac.secoes
      .map((s) => `• *${s.titulo}:* ${s.itens.slice(0, 4).join(", ")}${s.itens.length > 4 ? "…" : ""}`)
      .join("\n");
    setTimeout(() => {
      pushBot(
        `${info.titulo}\n⏱️ *Duração:* ${info.duracao}\n\n${info.descricao}\n\n*✨ Incluso em todos os pacotes:*\n${inclusoEmTodos.map((i) => `• ${i}`).join("\n")}\n\n*🎁 Neste pacote você tem:*\n${incluso}\n\n💰 *Valor:* sob consulta — cada festa é única! Vamos personalizar o orçamento no WhatsApp. 💛`,
      );
      setStep("orc_detalhe");
    }, 300);
  };

  const acaoDetalhe = (
    acao: "outro" | "personalizado" | "atendente" | "menu",
  ) => {
    const labels: Record<typeof acao, string> = {
      outro: "Ver outro pacote",
      personalizado: "Pedir orçamento personalizado",
      atendente: "Falar com atendente",
      menu: "Voltar ao menu",
    };
    pushUser(labels[acao]);
    setTimeout(() => {
      if (acao === "outro") {
        pushBot("Claro! Qual você quer ver agora? 🎁");
        setStep("orc_pacote");
      } else if (acao === "menu") {
        pushBot("Voltamos! Como posso te ajudar? 💛");
        setStep("menu");
      } else if (acao === "personalizado") {
        pushBot("Perfeito! Vou te encaminhar pro nosso time no WhatsApp com todos os seus dados. 💛");
        setStep("atendente");
      } else {
        pushBot("Combinado! Te levo pro WhatsApp agora mesmo. 💛");
        setStep("atendente");
      }
    }, 300);
  };

  const confirmarVisita = () => {
    pushUser("✅ Confirmar e enviar para WhatsApp");
    setTimeout(() => {
      pushBot("Perfeitoo! 🎉 Te levo pro WhatsApp com tudo já preenchido.");
      setStep("visita_enviado");
    }, 300);
  };

  const corrigirVisita = () => {
    pushUser("✏️ Corrigir informações");
    setLead((l) => ({ ...l, data: "" }));
    setTimeout(() => {
      pushBot("Sem problema! Vamos começar de novo pelo seu nome. 😊");
      setStep("nome");
    }, 300);
  };

  const voltarInicio = () => {
    setMessages([]);
    setLead(emptyLead);
    savedOnce.current = false;
    setStep("nome");
    setTimeout(() => {
      pushBot("Vamos recomeçar! 🎈 Qual é o seu *nome completo*?");
    }, 200);
  };

  // ---------- Layout ----------
  const outerClass = isPage
    ? "flex h-[100dvh] w-full items-center justify-center bg-purple-100"
    : "fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4";
  const innerClass = isPage
    ? "flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white sm:h-[min(800px,100dvh)] sm:rounded-3xl sm:border sm:border-gray-200 sm:shadow-2xl"
    : "animate-pop-in flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl sm:h-[640px] sm:rounded-3xl";

  const showFreeInput =
    step === "nome" || step === "email" || step === "telefone" || step === "visita_data";
  const isPhoneStep = step === "telefone";
  const placeholder =
    step === "nome"
      ? "Seu nome completo"
      : step === "email"
        ? "seu@email.com"
        : step === "telefone"
          ? "(62) 99999-9999"
          : step === "visita_data"
            ? "Ex: 15/03/2026"
            : "";

  const canGoBack = step !== "nome" && step !== "encerrado" && step !== "visita_enviado";

  const goBackOne = () => {
    // Simple back: return to menu
    if (step === "visita_data" || step === "visita_resumo" || step === "orc_pacote") {
      setStep("menu");
      pushBot("Voltamos ao menu. Como posso te ajudar? 💛");
    } else if (step === "orc_detalhe") {
      setStep("orc_pacote");
    } else if (step === "atendente") {
      setStep("menu");
      pushBot("Voltamos ao menu. Como posso te ajudar? 💛");
    }
  };

  return (
    <div className={outerClass}>
      <div className={innerClass}>
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-pink to-aqua-deep px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            {canGoBack && (step === "orc_detalhe" || step === "atendente") && (
              <button
                onClick={goBackOne}
                className="mr-1 rounded-full p-1.5 transition hover:bg-white/20"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white/20 backdrop-blur">
              <img src={maiteAvatar.url} alt="Maitê - Casa Prime Eventos" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-display text-base font-semibold leading-tight">
                Maitê - Casa Prime Eventos
              </div>
              <div className="text-xs opacity-90">Atendimento de festas infantis 🎂</div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-1.5 transition hover:bg-white/20"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          className="flex-1 space-y-2 overflow-y-auto bg-gradient-to-b from-pink-soft/40 to-white p-4"
        >
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  m.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-white text-foreground"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* Buttons per step */}
          {step === "qualificacao" && (
            <div className="flex flex-col gap-2 pt-1">
              <ChoiceButton onClick={() => chooseQualificacao(true)}>✅ Sim, é infantil</ChoiceButton>
              <ChoiceButton onClick={() => chooseQualificacao(false)}>❌ Não é infantil</ChoiceButton>
            </div>
          )}

          {step === "menu" && (
            <div className="flex flex-col gap-2 pt-1">
              <ChoiceButton onClick={() => chooseMenu("visita")}>🔎 Solicitar uma visita</ChoiceButton>
              <ChoiceButton onClick={() => chooseMenu("orcamento")}>💰 Fazer um orçamento</ChoiceButton>
              <ChoiceButton onClick={() => acaoDetalhe("atendente")}>💬 Falar com atendente</ChoiceButton>
            </div>
          )}

          {step === "visita_resumo" && (
            <div className="pt-1">
              <div className="rounded-2xl border-2 border-pink/30 bg-white p-4 text-sm shadow-sm">
                <div className="mb-2 font-display font-semibold text-foreground">📋 Resumo</div>
                <div className="space-y-1 text-foreground/90">
                  <div>👤 <b>Nome:</b> {lead.nome}</div>
                  <div>📱 <b>Telefone:</b> {lead.telefone}</div>
                  <div>✉️ <b>E-mail:</b> {lead.email}</div>
                  <div>📅 <b>Data prevista:</b> {lead.data || "—"}</div>
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <ChoiceButton onClick={confirmarVisita}>✅ Confirmar e enviar para WhatsApp</ChoiceButton>
                <ChoiceButton onClick={corrigirVisita}>✏️ Corrigir informações</ChoiceButton>
              </div>
            </div>
          )}

          {step === "visita_enviado" && (
            <div className="pt-2 space-y-2">
              <a
                href={waLink(buildWhatsMessage(lead, "visita"))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Continuar no WhatsApp
              </a>
              <button
                onClick={voltarInicio}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-foreground/70 transition hover:bg-gray-50"
              >
                🔄 Iniciar novo atendimento
              </button>
            </div>
          )}

          {step === "orc_pacote" && (
            <div className="flex flex-col gap-2 pt-1">
              {pacotes.map((p) => (
                <ChoiceButton key={p.id} onClick={() => escolherPacote(p.id)}>
                  {PACOTE_INFO[p.id]?.titulo ?? p.id}
                </ChoiceButton>
              ))}
              <button
                onClick={() => acaoDetalhe("menu")}
                className="mt-1 text-xs text-foreground/60 underline underline-offset-2"
              >
                ← Voltar ao menu
              </button>
            </div>
          )}

          {step === "orc_detalhe" && (
            <div className="flex flex-col gap-2 pt-1">
              <ChoiceButton onClick={() => acaoDetalhe("outro")}>🔁 Ver outro pacote</ChoiceButton>
              <ChoiceButton onClick={() => acaoDetalhe("personalizado")}>✨ Orçamento personalizado</ChoiceButton>
              <ChoiceButton onClick={() => acaoDetalhe("atendente")}>💬 Falar com atendente</ChoiceButton>
              <ChoiceButton onClick={() => acaoDetalhe("menu")}>↩️ Voltar ao menu</ChoiceButton>
            </div>
          )}

          {step === "atendente" && (
            <div className="pt-2 space-y-2">
              <a
                href={waLink(buildWhatsMessage(lead, lead.pacote ? "orcamento" : "atendente"))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Continuar no WhatsApp
              </a>
              <button
                onClick={voltarInicio}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-foreground/70 transition hover:bg-gray-50"
              >
                🔄 Iniciar novo atendimento
              </button>
            </div>
          )}

          {step === "encerrado" && (
            <div className="pt-2">
              <button
                onClick={voltarInicio}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-foreground/70 transition hover:bg-gray-50"
              >
                🔄 Iniciar novo atendimento
              </button>
            </div>
          )}
        </div>

        {/* Composer */}
        {showFreeInput && (
          <div className="border-t bg-white p-3">
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
                  setInput(isPhoneStep ? maskPhoneBR(e.target.value) : e.target.value)
                }
                inputMode={isPhoneStep ? "tel" : step === "email" ? "email" : "text"}
                placeholder={placeholder}
                className="rounded-full"
              />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0 rounded-full" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function ChoiceButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border-2 border-pink/30 bg-white px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:border-pink hover:bg-pink-soft active:scale-[0.99]"
    >
      {children}
    </button>
  );
}

