import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Ctx = {
  open: boolean;
  initialPacote?: string;
  openChat: (pacote?: string) => void;
  closeChat: () => void;
};

const ChatbotCtx = createContext<Ctx | null>(null);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialPacote, setInitialPacote] = useState<string | undefined>(undefined);

  const openChat = useCallback((pacote?: string) => {
    setInitialPacote(pacote);
    setOpen(true);
  }, []);
  const closeChat = useCallback(() => setOpen(false), []);

  return (
    <ChatbotCtx.Provider value={{ open, initialPacote, openChat, closeChat }}>
      {children}
    </ChatbotCtx.Provider>
  );
}

export function useChatbot() {
  const ctx = useContext(ChatbotCtx);
  if (!ctx) throw new Error("useChatbot must be inside ChatbotProvider");
  return ctx;
}
