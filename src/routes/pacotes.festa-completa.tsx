import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/pacotes/festa-completa")({
  head: () => ({
    meta: [
      { title: "Festa Completa — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Pacote Festa Completa da Casa Prime Eventos: tudo pronto para celebrar.",
      },
    ],
  }),
  component: FestaCompleta,
});

function FestaCompleta() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 text-center">
      <Link
        to="/pacotes"
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#8641df] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar aos pacotes
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
        Festa Completa
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-foreground/70">
        Em breve: detalhes desta modalidade. Envie as diretrizes para
        montarmos esta página.
      </p>
    </section>
  );
}
