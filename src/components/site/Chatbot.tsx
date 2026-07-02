import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { X, Send, PartyPopper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatbot } from "./ChatbotContext";
import { waLink } from "@/lib/whatsapp";
import { getLeadSummary } from "@/lib/leads.functions";

const TRANSFER_MARK = "[TRANSFERIR_WHATSAPP]";
const OPCOES_RE = /\[OPCOES:\s*([^\]]+)\]/i;

function parseOptions(text: string): { clean: string; options: string[] } {
  const match = text.match(OPCOES_RE);
  if (!match) return { clean: text, options: [] };
  const options = match[1]
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
  return { clean: text.replace(OPCOES_RE, "").trim(), options };
}

const INITIAL: UIMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Olá! Sou a Sofia, consultora da Casa Prime Eventos 🎈 Antes de tudo, como posso te chamar?",
      },
    ],
  },
];


function textOf(m: UIMessage): string {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

export function Chatbot() {
  const { open, closeChat } = useChatbot();
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: () => ({ sessionId }) }),
    [sessionId],
  );
  const { messages, sendMessage, status, setMessages } = useChat({
    id: "casaprime-chat",
    messages: INITIAL,
    transport,
  });

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!open) return;
    setSessionId(crypto.randomUUID());
    setMessages(INITIAL);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 150);
  }, [open, setMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!isBusy) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isBusy]);

  // Detect transfer marker on last assistant message
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const lastAssistantText = lastAssistant ? textOf(lastAssistant) : "";
  const shouldTransfer = lastAssistantText.includes(TRANSFER_MARK);
  const { options: lastOptions } = parseOptions(lastAssistantText);
  const lastAssistantId = lastAssistant?.id;
  const fetchSummary = useServerFn(getLeadSummary);
  const { data: summary, refetch: refetchSummary } = useQuery({
    queryKey: ["lead-summary", sessionId, lastAssistantId],
    queryFn: () => fetchSummary({ data: { sessionId } }),
    enabled: shouldTransfer && !isBusy,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const fallbackMsg =
    "Olá Casa Prime! Vim pelo chat e gostaria de continuar meu atendimento personalizado 🎉";
  const transferUrl = waLink(summary?.message ?? fallbackMsg);

  if (!open) return null;

  const send = (text: string) => {
    if (!text.trim() || isBusy) return;
    sendMessage({ text: text.trim() });
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="animate-pop-in flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl sm:h-[640px] sm:rounded-3xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-pink to-aqua-deep px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur">
              <PartyPopper className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-semibold leading-tight">
                Sofia · Casa Prime
              </div>
              <div className="text-xs opacity-90">Consultora de festas ✨</div>
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

        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          className="flex-1 space-y-2 overflow-y-auto bg-muted/30 p-4"
        >
          {messages.map((m) => {
            const raw = textOf(m);
            const withoutTransfer = raw.replace(TRANSFER_MARK, "").trim();
            const { clean } = parseOptions(withoutTransfer);
            if (!clean) return null;
            return (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-white text-foreground"
                  }`}
                >
                  {clean}
                </div>
              </div>
            );
          })}

          {isBusy && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <span className="animate-pulse">Sofia está digitando…</span>
              </div>
            </div>
          )}

          {!isBusy && lastOptions.length > 0 && !shouldTransfer && (
            <div key={lastAssistantId} className="flex flex-col gap-2 pt-1">
              {lastOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => send(opt)}
                  className="rounded-2xl border-2 border-pink/30 bg-white px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:border-pink hover:bg-pink-soft"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {shouldTransfer && (
            <div className="pt-2">
              <a
                href={transferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Continuar no WhatsApp
              </a>
            </div>
          )}
        </div>


        <div className="border-t bg-white p-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreva sua mensagem…"
              className="rounded-full"
              disabled={isBusy}
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full"
              disabled={isBusy || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
