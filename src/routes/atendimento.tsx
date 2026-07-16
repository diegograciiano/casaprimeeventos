import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useChatbot } from "@/components/site/ChatbotContext";

export const Route = createFileRoute("/atendimento")({
  head: () => ({
    meta: [
      { title: "Atendimento — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Converse com a Sofia, consultora virtual da Casa Prime Eventos, e monte seu pacote de festa em minutos.",
      },
      { property: "og:title", content: "Atendimento — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Fale com nossa consultora virtual e receba um atendimento personalizado.",
      },
    ],
  }),
  component: Atendimento,
});

function Atendimento() {
  const { open, openChat } = useChatbot();

  useEffect(() => {
    if (!open) openChat();
  }, [open, openChat]);

  return (
    <main className="min-h-[70vh] bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Atendimento Casa Prime
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Converse com a Sofia, nossa consultora virtual. Ela vai te ajudar a montar o pacote
          ideal para a sua festa em poucos minutos.
        </p>
        <button
          onClick={() => openChat()}
          className="mt-8 rounded-2xl bg-[#8641df] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition-colors hover:bg-[#6f2fc9] sm:text-base"
        >
          Iniciar conversa
        </button>
      </div>
    </main>
  );
}
