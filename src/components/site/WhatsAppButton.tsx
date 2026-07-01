import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER, waLink } from "@/lib/whatsapp";

export function WhatsAppButton() {
  const msg =
    "Olá Casa Prime! 👋 Quero informações para fazer a festa do meu filho(a).";
  return (
    <a
      href={waLink(msg)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar no WhatsApp ${WHATSAPP_NUMBER}`}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
      <span className="hidden pr-1 text-sm font-semibold sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
