import { useChatbot } from "./ChatbotContext";

export function WhatsAppButton() {
  const { openChat } = useChatbot();
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 sm:bottom-6 sm:right-6 group">
      <span className="pointer-events-none rounded-lg bg-[#8641df] px-3 py-2 text-xs font-semibold text-white shadow-lg opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 sm:text-sm">
        Fale conosco agora!
      </span>
      <button
        onClick={() => openChat()}
        aria-label="Fazer uma reserva"
        title="Fale conosco agora!"
        className="rounded-2xl bg-[#8641df] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition-colors hover:bg-[#6f2fc9] sm:text-base"
      >
        Fazer uma Reserva
      </button>
    </div>
  );
}
