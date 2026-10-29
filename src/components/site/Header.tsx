import { Link } from "@tanstack/react-router";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EscolherPacoteDialog } from "./EscolherPacoteDialog";

const nav = [
  { to: "/", label: "Início" },
  { to: "/pacotes", label: "Pacotes & Valores" },
  { to: "/orcamento", label: "Simular Orçamento", destaque: true },
  { to: "/galeria", label: "Galeria" },
  { to: "/sobre", label: "O Espaço" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [pacoteOpen, setPacoteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)} aria-label="Casa Prime Eventos — Início">
          <img
            src="/logo.png"
            alt="Casa Prime Eventos"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-[#8641df] font-bold bg-purple-50" }}
              inactiveProps={{ className: "text-foreground/75 hover:text-[#8641df]" }}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
                "destaque" in item && item.destaque
                  ? "bg-purple-100 text-[#8641df] hover:bg-purple-200"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button
            asChild
            className="ml-2 rounded-full font-display bg-[#ffcb03] text-[#14092e] font-bold hover:bg-[#ebd200] shadow-sm"
          >
            <Link to="/orcamento">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Pedir Orçamento
            </Link>
          </Button>
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-full p-2 text-foreground md:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-b bg-white/95 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                activeProps={{ className: "bg-purple-100 text-[#8641df]" }}
                inactiveProps={{ className: "text-foreground/80" }}
                className="rounded-xl px-3 py-2.5 text-base font-semibold"
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full font-display bg-[#ffcb03] text-[#14092e] font-bold"
            >
              <Link to="/orcamento">
                <Sparkles className="mr-1.5 h-4 w-4" />
                Simular Orçamento no Chatbot
              </Link>
            </Button>
          </nav>
        </div>
      )}
      <EscolherPacoteDialog open={pacoteOpen} onOpenChange={setPacoteOpen} />
    </header>
  );
}
