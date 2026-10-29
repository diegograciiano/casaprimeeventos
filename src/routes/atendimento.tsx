import { createFileRoute } from "@tanstack/react-router";
import { ChatbotUI } from "@/components/site/ChatbotUI";

export const Route = createFileRoute("/atendimento")({
  component: Atendimento,
  head: () => ({
    meta: [
      { title: "Atendimento & Orçamento — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Converse com a Sofia, consultora da Casa Prime Eventos, e simule o orçamento para a festa infantil do seu filho(a) em Goiânia.",
      },
      { property: "og:title", content: "Atendimento & Orçamento — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Simule os pacotes e valores com a Sofia e receba atendimento personalizado.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function Atendimento() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-amber-50/40 py-6 sm:py-10">
      <div className="mx-auto max-w-4xl px-4">
        <ChatbotUI mode="page" />
      </div>
    </div>
  );
}
