import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { Reveal } from "@/hooks/use-reveal";


import salaoAzul from "@/assets/salao-azul.jpg.asset.json";
import salaoRosa from "@/assets/salao-rosa.jpg.asset.json";
import decoracaoSafari from "@/assets/decoracao-safari.jpg.asset.json";
import algodaoDoce from "@/assets/algodao-doce.jpg.asset.json";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Fotos do nosso espaço: salão, decoração, piscina, buffet e brinquedos das festas realizadas na Casa Prime.",
      },
      { property: "og:title", content: "Galeria — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Veja fotos reais das festas realizadas no nosso espaço.",
      },
      { property: "og:image", content: salaoAzul.url },
    ],
  }),
  component: Galeria,
});

const fotos = [
  { url: salaoAzul.url, alt: "Salão decorado com toalhas azuis e balões" },
  { url: salaoRosa.url, alt: "Salão decorado com toalhas rosas e balões" },
  { url: decoracaoSafari.url, alt: "Decoração temática safari com balões e bichinhos" },
  { url: algodaoDoce.url, alt: "Carrinho de algodão doce e pipoca" },
];

function Galeria() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal className="text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-pink">
          Galeria
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Momentos que a gente ama
        </h1>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-purple" />
        <p className="mx-auto mt-3 max-w-xl text-foreground/70">
          Toca em uma foto para ampliar.
        </p>
      </Reveal>

      <Reveal stagger className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {fotos.map((f, i) => (
          <button
            key={f.url}
            onClick={() => setLightbox(f.url)}
            className={`hover-lift group overflow-hidden rounded-2xl bg-muted shadow-md transition hover:shadow-xl ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <img
              src={f.url}
              alt={f.alt}
              loading="lazy"
              className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </Reveal>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/85 p-4"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
