import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { Reveal } from "@/hooks/use-reveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria de Fotos Oficiais — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Fotos oficiais da Casa Prime Eventos: salão climatizado, decoração infantil, área de piscina, brinquedos e buffet completo.",
      },
      { property: "og:title", content: "Galeria de Fotos Oficiais — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Veja fotos reais e em alta resolução das festas realizadas na Casa Prime.",
      },
      { property: "og:image", content: "https://casaprimeeventos.com.br/images/salao-decorado-azul.jpg" },
    ],
  }),
  component: Galeria,
});

interface FotoItem {
  id: string;
  url: string;
  alt: string;
  titulo: string;
  categoria: "salao" | "decoracao" | "atracoes";
  descricao: string;
}

const fotos: FotoItem[] = [
  {
    id: "salao-azul",
    url: "/images/salao-decorado-azul.jpg",
    alt: "Salão decorado com mesas azuis e vista para a piscina",
    titulo: "Salão Nobre · Ambientação Azul Céu",
    categoria: "salao",
    descricao: "Salão amplo e climatizado com mesas redondas, cadeiras tiffany e vista panorâmica para a área da piscina e brinquedos.",
  },
  {
    id: "salao-rosa",
    url: "/images/salao-decorado-rosa.jpg",
    alt: "Salão amplo decorado com mesas lilás/rosa e painel de borboletas iluminado",
    titulo: "Salão Nobre · Tema Jardim das Borboletas",
    categoria: "salao",
    descricao: "Decoração requintada com toalhas adamascadas, arranjos florais, painel de borboletas com iluminação LED e balões orgânicos.",
  },
  {
    id: "decoracao-safari",
    url: "/images/decoracao-safari.jpg",
    alt: "Decoração temática safari no pergolado de madeira com balões e bichinhos de pelúcia",
    titulo: "Área Externa · Tema Safari dos Sonhos",
    categoria: "decoracao",
    descricao: "Cenário montado sob o pergolado de madeira com arco desconstruído de balões, bichos de pelúcia gigantes e painel fotográfico.",
  },
  {
    id: "algodao-doce-pipoca",
    url: "/images/algodao-doce-pipoca.jpg",
    alt: "Barraquinha de algodão doce e pipoca à beira da piscina com crianças felizes",
    titulo: "Atrações · Barraquinha de Pipoca & Algodão Doce",
    categoria: "atracoes",
    descricao: "Barraquinha oficial da Casa Prime com pipoca quentinha e algodão doce fresquinho à vontade durante todo o evento.",
  },
];

const categorias = [
  { id: "todas", label: "Todas as Fotos" },
  { id: "salao", label: "Salão Climatizado" },
  { id: "decoracao", label: "Decoração Temática" },
  { id: "atracoes", label: "Atrações & Brinquedos" },
] as const;

function Galeria() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("todas");
  const [indexLightbox, setIndexLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const fotosFiltradas =
    categoriaAtiva === "todas"
      ? fotos
      : fotos.filter((f) => f.categoria === categoriaAtiva);

  const fotoAtual = indexLightbox !== null ? fotosFiltradas[indexLightbox] : null;

  const fecharLightbox = useCallback(() => {
    setIndexLightbox(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(3, +(z + 0.5).toFixed(1)));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const novo = Math.max(1, +(z - 0.5).toFixed(1));
      if (novo === 1) setPan({ x: 0, y: 0 });
      return novo;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const proximaFoto = useCallback(() => {
    if (indexLightbox === null) return;
    setIndexLightbox((idx) => ((idx! + 1) % fotosFiltradas.length));
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [indexLightbox, fotosFiltradas.length]);

  const fotoAnterior = useCallback(() => {
    if (indexLightbox === null) return;
    setIndexLightbox((idx) =>
      idx! === 0 ? fotosFiltradas.length - 1 : idx! - 1
    );
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [indexLightbox, fotosFiltradas.length]);

  // Teclas de atalho para navegação
  useEffect(() => {
    if (indexLightbox === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharLightbox();
      if (e.key === "ArrowRight") proximaFoto();
      if (e.key === "ArrowLeft") fotoAnterior();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [indexLightbox, fecharLightbox, proximaFoto, fotoAnterior, zoomIn, zoomOut, resetZoom]);

  // Drag para mover imagem quando ampliada
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Cabeçalho alinhado à esquerda */}
      <Reveal className="text-left max-w-3xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700">
          <Sparkles className="h-3.5 w-3.5" /> Fotos Oficiais do Espaço
        </span>
        <h1 className="mt-3 font-display text-3xl sm:text-5xl font-bold text-[#14092e] leading-tight">
          Momentos e Estrutura da Casa Prime
        </h1>
        <div className="mt-3 h-1.5 w-16 rounded-full bg-[#8641df]" />
        <p className="mt-4 text-base sm:text-lg text-foreground/75 leading-relaxed">
          Confira fotos reais em alta resolução do nosso salão nobre climatizado, decorações personalizadas, área externa de piscina e buffet. Toque em qualquer foto para ampliar com opção de zoom!
        </p>

        {/* Filtros de Categoria */}
        <div className="mt-7 flex flex-wrap gap-2 text-left">
          {categorias.map((cat) => {
            const ativo = categoriaAtiva === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                  ativo
                    ? "bg-[#8641df] text-white shadow-md shadow-purple-500/25 scale-105"
                    : "bg-purple-50 text-purple-900 hover:bg-purple-100"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Grade de Fotos Padronizada (Aspect Ratio 4:3 idêntico para todas) */}
      <Reveal stagger className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {fotosFiltradas.map((foto, idx) => (
          <div
            key={foto.id}
            onClick={() => {
              setIndexLightbox(idx);
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-left"
          >
            {/* Medida padronizada com aspect-[4/3] */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
              <img
                src={foto.url}
                alt={foto.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Overlay suave com ícone de Zoom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 sm:opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-5">
                <div className="self-end rounded-full bg-white/30 p-2.5 backdrop-blur-md text-white shadow-md">
                  <Maximize2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="inline-block rounded-full bg-[#ffcb03] px-3 py-0.5 text-xs font-black uppercase text-[#14092e]">
                    Toque para dar zoom
                  </span>
                  <h3 className="mt-2 font-display text-lg sm:text-xl font-bold text-white leading-snug">
                    {foto.titulo}
                  </h3>
                </div>
              </div>
            </div>

            {/* Legenda Informativa abaixo da imagem */}
            <div className="p-5 text-left bg-white border-t border-gray-100">
              <h4 className="font-display text-base font-bold text-gray-900">
                {foto.titulo}
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {foto.descricao}
              </p>
            </div>
          </div>
        ))}
      </Reveal>

      {/* Banner de Simulação */}
      <div className="mt-14 rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-amber-50/50 p-6 sm:p-10 text-left shadow-lg">
        <h3 className="font-display text-2xl font-bold text-[#14092e]">
          Quer ver essa estrutura pronta para a festa do seu filho?
        </h3>
        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
          Simule o seu orçamento em menos de 1 minuto no nosso chatbot interativo e receba a proposta oficial direto no seu WhatsApp!
        </p>
        <div className="mt-6">
          <Button
            asChild
            className="rounded-2xl bg-[#ffcb03] px-6 py-5 font-display text-base font-bold text-[#14092e] shadow-md hover:bg-[#ebd200]"
          >
            <Link to="/orcamento">
              <Sparkles className="mr-2 h-4 w-4" />
              Simular Orçamento com Sofia
            </Link>
          </Button>
        </div>
      </div>

      {/* Modal / Lightbox Completo com Controles de Zoom */}
      {fotoAtual && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none"
          onClick={(e) => {
            // Fecha se clicar no fundo fora da imagem
            if (e.target === e.currentTarget) fecharLightbox();
          }}
        >
          {/* Barra Superior de Controles */}
          <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent text-white">
            <div className="text-left">
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {fotoAtual.titulo}
              </h3>
              <p className="text-xs text-white/70">
                Foto {indexLightbox! + 1} de {fotosFiltradas.length} · Use os botões ou deslize para zoom
              </p>
            </div>

            {/* Controles de Zoom */}
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                disabled={zoom <= 1}
                className="rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25 disabled:opacity-40 transition"
                title="Reduzir Zoom (-)"
                aria-label="Reduzir zoom"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="min-w-[48px] text-center font-display text-xs font-bold text-white/90">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoom >= 3}
                className="rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25 disabled:opacity-40 transition"
                title="Aumentar Zoom (+)"
                aria-label="Aumentar zoom"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              {zoom > 1 && (
                <button
                  onClick={resetZoom}
                  className="rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25 transition"
                  title="Restaurar tamanho original (0)"
                  aria-label="Restaurar tamanho"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={fecharLightbox}
                className="ml-2 rounded-full bg-white/20 p-2.5 text-white hover:bg-red-600 transition"
                title="Fechar (Esc)"
                aria-label="Fechar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Botão Foto Anterior */}
          {fotosFiltradas.length > 1 && (
            <button
              onClick={fotoAnterior}
              className="absolute left-3 sm:left-6 z-20 rounded-full bg-white/15 p-3 text-white backdrop-blur-md hover:bg-white/30 transition shadow-lg"
              title="Foto Anterior (Seta Esquerda)"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
          )}

          {/* Imagem Central com Zoom e Pan */}
          <div
            className={`relative flex h-full w-full items-center justify-center p-4 sm:p-12 overflow-hidden ${
              zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={() => {
              if (zoom === 1) zoomIn();
            }}
          >
            <img
              src={fotoAtual.url}
              alt={fotoAtual.alt}
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: isDragging ? "none" : "transform 0.25s ease-out",
              }}
              draggable={false}
              className="max-h-[82vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl pointer-events-auto"
            />
          </div>

          {/* Botão Próxima Foto */}
          {fotosFiltradas.length > 1 && (
            <button
              onClick={proximaFoto}
              className="absolute right-3 sm:right-6 z-20 rounded-full bg-white/15 p-3 text-white backdrop-blur-md hover:bg-white/30 transition shadow-lg"
              title="Próxima Foto (Seta Direita)"
              aria-label="Próxima foto"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          )}

          {/* Barra Inferior com Descrição Completa */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-center text-white">
            <p className="mx-auto max-w-2xl text-xs sm:text-sm text-white/85 leading-relaxed">
              {fotoAtual.descricao}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
