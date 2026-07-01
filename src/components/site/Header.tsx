import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EscolherPacoteDialog } from "./EscolherPacoteDialog";
import logo from "@/assets/icon-casa-prime.png.asset.json";

const nav = [
  { to: "/", label: "Início" },
  { to: "/pacotes", label: "Pacotes" },
  
  { to: "/galeria", label: "Galeria" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [pacoteOpen, setPacoteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)} aria-label="Casa Prime Eventos — Início">
          <img
            src={logo.url}
            alt="Casa Prime Eventos"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-pink" }}
              inactiveProps={{ className: "text-foreground/70 hover:text-foreground" }}
              className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Button
            onClick={() => openChat()}
            className="ml-2 rounded-full font-display"
          >
            Escolher Pacote
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
        <div className="border-t border-white/40 bg-white/95 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                activeProps={{ className: "bg-pink-soft text-pink" }}
                inactiveProps={{ className: "text-foreground/80" }}
                className="rounded-xl px-3 py-2.5 text-base font-semibold"
              >
                {item.label}
              </Link>
            ))}
            <Button
              onClick={() => {
                setOpen(false);
                openChat();
              }}
              className="mt-2 rounded-full font-display"
            >
              Escolher Pacote
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
