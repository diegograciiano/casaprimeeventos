import { useChatbot } from "./ChatbotContext";
import { ChatbotUI } from "./ChatbotUI";

export function Chatbot() {
  const { open, closeChat } = useChatbot();
  if (!open) return null;
  return <ChatbotUI mode="floating" onClose={closeChat} />;
}
