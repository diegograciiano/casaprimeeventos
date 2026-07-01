import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { X, Send, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { submitLead } from "@/lib/leads.functions";
import { useChatbot } from "./ChatbotContext";

type Msg = { from: "bot" | "user"; text: string };

type InputKind = "text" | "date" | "number";
type ChoiceItem = { content: string; next: string };
type Block =
  | { kind: "bot"; text: string }
  | { kind: "choice"; items: ChoiceItem[] }
  | { kind: "input"; type: InputKind; variable: "nome" | "data" | "convidados"; placeholder: string }
  | { kind: "redirect"; urlTemplate: string };

type Group = { id: string; blocks: Block[]; next?: string };

const FLOW: Record<string, Group> = {
  welcome: {
    id: "welcome",
    blocks: [
      { kind: "bot", text: "Olá! Seja muito bem-vindo(a) à Casa Prime Eventos! 🎈" },
      { kind: "bot", text: "Onde a magia da infância encontra o requinte e a sofisticação em Goiânia." },
      {
        kind: "choice",
        items: [
          { content: "Fazer um orçamento", next: "dados" },
          { content: "Conhecer os pacotes", next: "pacoteTipo" },
          { content: "Falar com um consultor", next: "final" },
        ],
      },
    ],
  },
  dados: {
    id: "dados",
    blocks: [
      { kind: "bot", text: "Para começarmos, qual o seu nome?" },
      { kind: "input", type: "text", variable: "nome", placeholder: "Seu nome" },
      { kind: "bot", text: "Prazer em te conhecer, {{nome}}! Qual a data pretendida para a festa?" },
      { kind: "input", type: "date", variable: "data", placeholder: "dd/mm/aaaa" },
      { kind: "bot", text: "E qual o número estimado de convidados?" },
      { kind: "input", type: "number", variable: "convidados", placeholder: "Ex: 80" },
    ],
    next: "pacoteTipo",
  },
  pacoteTipo: {
    id: "pacoteTipo",
    blocks: [
      { kind: "bot", text: "Qual tipo de pacote você tem interesse?" },
      {
        kind: "choice",
        items: [
          { content: "Pacotes COM Buffet", next: "comBuffet" },
          { content: "Pacotes SEM Buffet", next: "semBuffet" },
          { content: "Festa Completa (Tudo incluso)", next: "final" },
        ],
      },
    ],
  },
  comBuffet: {
    id: "comBuffet",
    blocks: [
      { kind: "bot", text: "Temos opções deliciosas! Qual cardápio mais te agrada?" },
      {
        kind: "choice",
        items: [
          { content: "Pacote Pirulito (Entradas + Prato Principal)", next: "final" },
          { content: "Pacote Diversão (Buffet Completo)", next: "final" },
          { content: "Pacote Churrasco (Picanha e Grill)", next: "final" },
        ],
      },
    ],
  },
  semBuffet: {
    id: "semBuffet",
    blocks: [
      {
        kind: "bot",
        text: "Ótima escolha! Nossos pacotes sem buffet variam pelo número de pessoas. Qual se encaixa melhor?",
      },
      {
        kind: "choice",
        items: [
          { content: "Bombom (Até 60 pessoas)", next: "final" },
          { content: "Chiclete (Até 80 pessoas)", next: "final" },
          { content: "Sorvete (Até 90 pessoas)", next: "final" },
          { content: "Churros (Até 120 pessoas)", next: "final" },
        ],
      },
    ],
  },
  final: {
    id: "final",
    blocks: [
      {
        kind: "bot",
        text: "Perfeito! Vou te encaminhar agora para um de nossos consultores no WhatsApp para finalizar seu orçamento personalizado.",
      },
      { kind: "bot", text: "Aguarde um instante..." },
      {
        kind: "redirect",
        urlTemplate:
          "https://wa.me/5562993454663?text=Olá! Me chamo {{nome}}, gostaria de um orçamento para o dia {{data}} para {{convidados}} pessoas.",
      },
    ],
  },
};

type Vars = { nome?: string; data?: string; convidados?: string; pacote?: string };

function interpolate(t: string, vars: Vars) {
  return t
    .replace(/\{\{nome\}\}/g, vars.nome || "")
    .replace(/\{\{data\}\}/g, vars.data || "")
    .replace(/\{\{convidados\}\}/g, vars.convidados || "");
}

export function Chatbot() {
  const { open, closeChat } = useChatbot();
  const send = useServerFn(submitLead);

  const [groupId, setGroupId] = useState<string>("welcome");
  const [blockIdx, setBlockIdx] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [vars, setVars] = useState<Vars>({});
  const [done, setDone] = useState(false);
  const leadSentRef = useRef(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentGroup = FLOW[groupId];
  const currentBlock: Block | undefined = currentGroup?.blocks[blockIdx];

  // Reset ao abrir
  useEffect(() => {
    if (!open) return;
    setGroupId("welcome");
    setBlockIdx(0);
    setMessages([]);
    setInput("");
    setVars({});
    setDone(false);
    leadSentRef.current = false;
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, blockIdx, groupId]);

  // Auto-advance through bot messages
  useEffect(() => {
    if (!open || !currentBlock) return;
    if (currentBlock.kind === "bot") {
      const text = interpolate(currentBlock.text, vars);
      const t = setTimeout(() => {
        setMessages((m) => [...m, { from: "bot", text }]);
        advance();
      }, 400);
      return () => clearTimeout(t);
    }
    if (currentBlock.kind === "redirect") {
      const url = interpolate(currentBlock.urlTemplate, vars);
      // fire-and-forget lead save
      if (!leadSentRef.current) {
        leadSentRef.current = true;
        send({
          data: {
            responsavel_nome: vars.nome || "Contato via chat",
            telefone: "55 62 99345-4663",
            crianca_nome: undefined,
            data_festa: vars.data,
            qtd_pessoas: vars.convidados ? Number(vars.convidados) : undefined,
            pacote: vars.pacote,
          },
        }).catch(() => {});
      }
      const t = setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
        setDone(true);
      }, 800);
      return () => clearTimeout(t);
    }
    // choice/input → wait for user
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, groupId, blockIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = () => {
    const g = FLOW[groupId];
    if (!g) return;
    if (blockIdx + 1 < g.blocks.length) {
      setBlockIdx(blockIdx + 1);
    } else if (g.next) {
      setGroupId(g.next);
      setBlockIdx(0);
    }
  };

  const goTo = (nextGroupId: string) => {
    setGroupId(nextGroupId);
    setBlockIdx(0);
  };

  const handleChoice = (item: ChoiceItem) => {
    setMessages((m) => [...m, { from: "user", text: item.content }]);
    // if choosing a specific package name, store it
    if (groupId === "comBuffet" || groupId === "semBuffet" || groupId === "pacoteTipo") {
      setVars((v) => ({ ...v, pacote: item.content }));
    }
    goTo(item.next);
  };

  const submitInput = () => {
    if (!currentBlock || currentBlock.kind !== "input") return;
    const value = input.trim();
    if (currentBlock.type === "number") {
      const n = parseInt(value.replace(/\D/g, ""), 10);
      if (!n) return toast.error("Digite um número válido");
    } else if (value.length < 2) {
      return toast.error("Preencha o campo");
    }
    setMessages((m) => [...m, { from: "user", text: value }]);
    setVars((v) => ({ ...v, [currentBlock.variable]: value }));
    setInput("");
    advance();
  };

  const activeChoice =
    currentBlock?.kind === "choice" && !done ? currentBlock : null;
  const activeInput = currentBlock?.kind === "input" && !done ? currentBlock : null;

  const placeholder = useMemo(() => activeInput?.placeholder ?? "Digite aqui...", [activeInput]);

  if (!open) return null;

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
                Casa Prime Eventos
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

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto bg-muted/30 p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
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

          {activeChoice && (
            <div className="flex flex-col gap-2 pt-2">
              {activeChoice.items.map((it) => (
                <button
                  key={it.content}
                  onClick={() => handleChoice(it)}
                  className="rounded-2xl border-2 border-pink/30 bg-white px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:border-pink hover:bg-pink-soft"
                >
                  {it.content}
                </button>
              ))}
            </div>
          )}

          {done && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-2 text-sm shadow-sm">
                Abrimos o WhatsApp em uma nova aba 💬
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        {activeInput && (
          <div className="border-t bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitInput();
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                type={
                  activeInput.type === "date"
                    ? "date"
                    : activeInput.type === "number"
                    ? "number"
                    : "text"
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
