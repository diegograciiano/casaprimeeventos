import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Instagram, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/site/ChatbotContext";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Fale conosco pelo WhatsApp, Instagram ou converse com um consultor para montar seu pacote em minutos.",
      },
      { property: "og:title", content: "Contato — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Fale com a Casa Prime pelo WhatsApp ou Instagram.",
      },
    ],
  }),
  component: Contato,
});

function Contato() {
  const { openChat } = useChatbot();
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-pink">
          Contato
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Vamos conversar? 💬
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-foreground/70">
          Escolha o canal que preferir. Respondemos rápido!
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href={waLink("Olá Casa Prime! Quero informações para minha festa.")}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-3xl bg-gradient-to-br from-whatsapp to-[oklch(0.55_0.15_150)] p-6 text-white shadow-xl transition hover:-translate-y-1"
        >
          <MessageCircle className="h-8 w-8" />
          <div className="mt-3 font-display text-xl font-semibold">WhatsApp</div>
          <div className="mt-1 text-sm text-white/90">{WHATSAPP_DISPLAY}</div>
          <div className="mt-3 text-xs text-white/80">Toque para conversar agora</div>
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-3xl bg-gradient-to-br from-pink to-[oklch(0.65_0.25_310)] p-6 text-white shadow-xl transition hover:-translate-y-1"
        >
          <Instagram className="h-8 w-8" />
          <div className="mt-3 font-display text-xl font-semibold">Instagram</div>
          <div className="mt-1 text-sm text-white/90">@{INSTAGRAM_HANDLE}</div>
          <div className="mt-3 text-xs text-white/80">Confira fotos e novidades</div>
        </a>

        <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-white/60 sm:col-span-2">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold-soft">
              <MapPin className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold">Localização</div>
              <p className="mt-1 text-sm text-foreground/70">
                Goiânia — GO. Envie mensagem para receber o endereço completo e agendar uma visita.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-gradient-to-br from-pink to-aqua-deep p-8 text-center text-white shadow-2xl">
        <Phone className="mx-auto h-8 w-8" />
        <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
          Prefere montar seu pacote agora?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-white/90">
          Nosso consultor te guia em menos de 2 minutos.
        </p>
        <Button
          onClick={() => openChat()}
          size="lg"
          className="mt-5 rounded-full bg-white font-display text-pink hover:bg-white/90"
        >
          Conversar com um consultor
        </Button>
      </div>
    </section>
  );
}
