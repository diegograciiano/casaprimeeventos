import { useChatbot } from "./ChatbotContext";

export function WhatsAppButton() {
  const { openChat } = useChatbot();
  return (
    <button
      onClick={() => openChat()}
      aria-label="Fazer uma reserva"
      className="fixed bottom-5 right-5 z-50 rounded-2xl bg-[#8641df] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition-colors hover:bg-[#6f2fc9] sm:bottom-6 sm:right-6 sm:text-base"
    >
      Fazer uma Reserva
    </button>
  );
}
