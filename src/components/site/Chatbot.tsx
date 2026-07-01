import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { X, Send, Sparkles, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { submitLead } from "@/lib/leads.functions";
import { waLink } from "@/lib/whatsapp";
import { useChatbot } from "./ChatbotContext";

type Msg = { from: "bot" | "user"; text: string };

const PACOTES = [
  { id: "Pacote Pirulito (Sem Buffet)", short: "Pirulito" },
  { id: "Pacote Diversão (Com Buffet)", short: "Diversão" },
  { id: "Pacote Churrasco (Festa Completa)", short: "Churrasco" },
];

const PACOTE_RESUMO: Record<string, string> = {
  "Pacote Pirulito (Sem Buffet)":
    "12h de locação, piscina aquecida, brinquedos 4h, algodão doce e pipoca 4h, estacionamento e equipe completa. Valores sob consulta.",
  "Pacote Diversão (Com Buffet)":
    "Tudo do Pirulito + buffet completo (entradas, prato principal, bebidas e sobremesa). Ideal para quem quer festa completa sem preocupação.",
  "Pacote Churrasco (Festa Completa)":
    "Festa completa com churrasco premium, buffet, bebidas, sobremesas, brinquedos 4h, piscina aquecida e toda a estrutura.",
};

type Step =
  | "welcome"
  | "pessoas"
  | "pacote"
  | "confirmaPacote"
  | "tema"
  | "restricoes"
  | "nome"
  | "telefone"
  | "email"
  | "resumo"
  | "enviando"
  | "done";

const STEP_ORDER: Step[] = [
  "welcome",
  "pessoas",
  "pacote",
  "confirmaPacote",
  "tema",
  "restricoes",
  "nome",
  "telefone",
  "email",
  "resumo",
];

export function Chatbot() {
  const { open, closeChat, initialPacote } = useChatbot();
  const send = useServerFn(submitLead);

  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const [criancaNome, setCriancaNome] = useState("");
  const [dataFesta, setDataFesta] = useState("");
  const [qtdPessoas, setQtdPessoas] = useState<number | null>(null);
  const [pacote, setPacote] = useState<string | undefined>(undefined);
  const [tema, setTema] = useState("");
  const [restricoes, setRestricoes] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const progress = useMemo(() => {
    const i = STEP_ORDER.indexOf(step);
    if (i < 0) return 100;
    return Math.round(((i + 1) / STEP_ORDER.length) * 100);
  }, [step]);

  const pushBot = (text: string) =>
    setMessages((m) => [...m, { from: "bot", text }]);
  const pushUser = (text: string) =>
    setMessages((m) => [...m, { from: "user", text }]);

  // Reset ao abrir
  useEffect(() => {
    if (!open) return;
    setStep("welcome");
    setMessages([
      {
        from: "bot",
        text: "Olá! 😊 Eu sou a assistente da Casa Prime Eventos. Vamos montar a festa dos sonhos do seu filho(a)?",
      },
      {
        from: "bot",
        text: "Qual o nome da criança e a data aproximada da festa? (ex: Helena — 15/03/2026)",
      },
    ]);
    setCriancaNome("");
    setDataFesta("");
    setQtdPessoas(null);
    setPacote(initialPacote);
    setTema("");
    setRestricoes("");
    setNome("");
    setTelefone("");
    setEmail("");
    setInput("");
  }, [open, initialPacote]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open, step]);

  if (!open) return null;

  const advanceFromWelcome = () => {
    if (input.trim().length < 2) {
      toast.error("Conta pra mim o nome da criança e a data 🎂");
      return;
    }
    const value = input.trim();
    pushUser(value);
    const parts = value.split(/[-—,]/);
    setCriancaNome(parts[0]?.trim() ?? value);
    setDataFesta(parts[1]?.trim() ?? "");
    setInput("");
    setTimeout(() => {
      pushBot(`Que festa linda vai ser! 🎉 Quantas pessoas vão participar? (mínimo 50)`);
      setStep("pessoas");
    }, 300);
  };

  const advancePessoas = () => {
    const n = parseInt(input.replace(/\D/g, ""), 10);
    if (!n || n < 50) {
      toast.error("O mínimo é 50 pessoas 🙂");
      return;
    }
    pushUser(`${n} pessoas`);
    setQtdPessoas(n);
    setInput("");
    setTimeout(() => {
      pushBot("Perfeito! Qual pacote combina mais com a sua festa?");
      setStep("pacote");
    }, 300);
  };

  const choosePacote = (p: string) => {
    pushUser(p);
    setPacote(p);
    setTimeout(() => {
      pushBot(`Ótima escolha! ✨ Sobre o ${p}:`);
      pushBot(PACOTE_RESUMO[p]);
      pushBot("Podemos seguir com esse pacote?");
      setStep("confirmaPacote");
    }, 300);
  };

  const confirmPacote = (yes: boolean) => {
    pushUser(yes ? "Sim, seguir com esse pacote" : "Quero ver outro");
    if (!yes) {
      setTimeout(() => {
        pushBot("Sem problemas! Qual outro pacote?");
        setStep("pacote");
      }, 250);
      return;
    }
    setTimeout(() => {
      pushBot("Vai ter algum tema de decoração? (ex: Safari, Princesas, Super-heróis)");
      setStep("tema");
    }, 300);
  };

  const advanceTema = () => {
    const v = input.trim() || "A combinar";
    pushUser(v);
    setTema(v);
    setInput("");
    setTimeout(() => {
      pushBot("Alguma restrição alimentar dos convidados? (ex: sem lactose, vegetariano — ou 'nenhuma')");
      setStep("restricoes");
    }, 300);
  };

  const advanceRestricoes = () => {
    const v = input.trim() || "Nenhuma";
    pushUser(v);
    setRestricoes(v);
    setInput("");
    setTimeout(() => {
      pushBot("Agora só faltam seus dados. Qual seu nome completo?");
      setStep("nome");
    }, 300);
  };

  const advanceNome = () => {
    if (input.trim().length < 2) {
      toast.error("Digite seu nome completo 🙂");
      return;
    }
    pushUser(input.trim());
    setNome(input.trim());
    setInput("");
    setTimeout(() => {
      pushBot("Perfeito! Qual o melhor telefone/WhatsApp para contato?");
      setStep("telefone");
    }, 300);
  };

  const advanceTelefone = () => {
    const clean = input.replace(/\D/g, "");
    if (clean.length < 10) {
      toast.error("Telefone inválido — inclua DDD");
      return;
    }
    pushUser(input.trim());
    setTelefone(input.trim());
    setInput("");
    setTimeout(() => {
      pushBot("E o seu e-mail? (ou digite 'pular')");
      setStep("email");
    }, 300);
  };

  const advanceEmail = () => {
    const v = input.trim();
    const skip = v.toLowerCase() === "pular" || v === "";
    if (!skip && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      toast.error("E-mail inválido — ou digite 'pular'");
      return;
    }
    pushUser(skip ? "(sem e-mail)" : v);
    setEmail(skip ? "" : v);
    setInput("");
    setTimeout(() => {
      pushBot("Deixa eu confirmar tudo com você 👇");
      setStep("resumo");
    }, 300);
  };

  const buildResumo = () => `
🎉 *Nova reserva — Casa Prime Eventos*

👶 Criança: ${criancaNome}
📅 Data: ${dataFesta || "a combinar"}
👥 Pessoas: ${qtdPessoas}
🎁 Pacote: ${pacote}
🎨 Tema: ${tema}
🥗 Restrições: ${restricoes}

👤 Responsável: ${nome}
📱 Telefone: ${telefone}
${email ? `✉️ E-mail: ${email}` : ""}
`.trim();

  const submit = async () => {
    setStep("enviando");
    try {
      await send({
        data: {
          crianca_nome: criancaNome,
          data_festa: dataFesta,
          qtd_pessoas: qtdPessoas ?? undefined,
          pacote,
          tema,
          restricoes,
          responsavel_nome: nome,
          telefone,
          email: email || undefined,
        },
      });
      pushBot("🎊 Reserva registrada! Nossa equipe já foi avisada.");
      pushBot("Clique no botão abaixo para enviar o resumo direto no nosso WhatsApp e agilizar seu atendimento.");
      setStep("done");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao enviar";
      toast.error(msg);
      pushBot("Ops, tive um problema para salvar. Mas você pode enviar seu resumo pelo WhatsApp agora mesmo 👇");
      setStep("done");
    }
  };

  const handleTextSubmit = () => {
    if (step === "welcome") return advanceFromWelcome();
    if (step === "pessoas") return advancePessoas();
    if (step === "tema") return advanceTema();
    if (step === "restricoes") return advanceRestricoes();
    if (step === "nome") return advanceNome();
    if (step === "telefone") return advanceTelefone();
    if (step === "email") return advanceEmail();
  };

  const showTextInput = ["welcome", "pessoas", "tema", "restricoes", "nome", "telefone", "email"].includes(step);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="animate-pop-in flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl sm:h-[640px] sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-pink to-aqua-deep px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur">
              <PartyPopper className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-semibold leading-tight">
                Quero fazer minha festa na Casa Prime!
              </div>
              <div className="text-xs opacity-90">Responde em segundos ⚡</div>
            </div>
          </div>
          <button
            onClick={closeChat}
            className="rounded-full p-1.5 transition hover:bg-white/20"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Progress value={progress} className="h-1 rounded-none bg-pink-soft" />

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto bg-muted/30 p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  m.from === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-white text-foreground"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* Quick buttons */}
          {step === "pacote" && (
            <div className="flex flex-col gap-2 pt-2">
              {PACOTES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => choosePacote(p.id)}
                  className="rounded-2xl border-2 border-pink/30 bg-white px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:border-pink hover:bg-pink-soft"
                >
                  🎁 {p.id}
                </button>
              ))}
            </div>
          )}

          {step === "confirmaPacote" && (
            <div className="flex gap-2 pt-2">
              <Button onClick={() => confirmPacote(true)} className="flex-1">
                Sim, seguir
              </Button>
              <Button onClick={() => confirmPacote(false)} variant="outline" className="flex-1">
                Ver outro
              </Button>
            </div>
          )}

          {step === "resumo" && (
            <div className="animate-pop-in rounded-2xl border-2 border-dashed border-pink/40 bg-white p-4">
              <div className="mb-2 flex items-center gap-1.5 font-display font-semibold text-pink">
                <Sparkles className="h-4 w-4" /> Resumo da sua festa
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                {buildResumo()}
              </pre>
              <div className="mt-3 flex gap-2">
                <Button onClick={submit} className="flex-1">Confirmar reserva</Button>
                <Button variant="outline" onClick={() => setStep("nome")}>Editar</Button>
              </div>
            </div>
          )}

          {step === "enviando" && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-2 text-sm shadow-sm">
                Enviando<span className="animate-pulse">...</span>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="pt-2">
              <a
                href={waLink(buildResumo())}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Enviar resumo no WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Input */}
        {showTextInput && (
          <div className="border-t bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTextSubmit();
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  step === "welcome"
                    ? "Ex: Helena — 15/03/2026"
                    : step === "pessoas"
                    ? "Quantidade de pessoas"
                    : step === "telefone"
                    ? "(62) 99999-9999"
                    : "Digite aqui..."
                }
                className="rounded-full"
              />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0 rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
