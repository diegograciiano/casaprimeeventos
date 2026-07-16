import { createFileRoute } from "@tanstack/react-router";
import { ChatbotUI } from "@/components/site/ChatbotUI";

export const Route = createFileRoute("/atendimento")({
  component: Atendimento,
  head: () => ({
    meta: [
      { title: "Atendimento — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Converse com a Sofia, consultora da Casa Prime Eventos, e tire suas dúvidas sobre festas infantis em Goiânia.",
      },
      { property: "og:title", content: "Atendimento — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Converse com a Sofia e descubra o pacote ideal para a festa infantil.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function Atendimento() {
  return <ChatbotUI mode="page" />;
}
