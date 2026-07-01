import { useChatbot } from "./ChatbotContext";

export function WhatsAppButton() {
  const { openChat } = useChatbot();
  return (
    <button
      onClick={() => openChat()}
      aria-label="Fazer uma reserva"
      className="fixed bottom-5 right-5 z-50 rounded-2xl border-2 border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/30 backdrop-blur-md transition-colors hover:bg-white/20 sm:bottom-6 sm:right-6 sm:text-base"
    >
      Fazer uma Reserva
    </button>
  );
}
