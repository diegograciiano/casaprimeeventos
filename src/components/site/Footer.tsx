import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, MapPin } from "lucide-react";
import logo from "@/assets/icon-casa-prime.png.asset.json";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, waLink } from "@/lib/whatsapp";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
        {children}
      </div>
      <div className="mt-2 h-[3px] w-10 rounded-full bg-[#ffcb03]" />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-[#14092e] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 md:gap-8">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo.url}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 object-contain brightness-0 invert"
            />
            <div className="font-display text-xl font-bold leading-tight">
              Casa Prime<br />
              <span className="text-[#ffcb03]">Eventos</span>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            A sua casa de diversão. Festas infantis inesquecíveis com estrutura completa,
            piscina aquecida e muita alegria.
          </p>
        </div>

        {/* Navegação */}
        <div>
          <SectionTitle>Navegação</SectionTitle>
          <ul className="mt-5 space-y-2.5 text-sm text-white/75">
            <li><Link to="/" className="transition-colors hover:text-[#ffcb03]">Início</Link></li>
            <li><Link to="/pacotes" className="transition-colors hover:text-[#ffcb03]">Pacotes</Link></li>
            <li><Link to="/galeria" className="transition-colors hover:text-[#ffcb03]">Galeria</Link></li>
            <li><Link to="/sobre" className="transition-colors hover:text-[#ffcb03]">Sobre</Link></li>
            <li><Link to="/contato" className="transition-colors hover:text-[#ffcb03]">Contato</Link></li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <SectionTitle>Contato</SectionTitle>
          <ul className="mt-5 space-y-3 text-sm text-white/85">
            <li>
              <a
                href={waLink("Olá Casa Prime! Quero informações.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 transition-colors hover:text-[#ffcb03]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-[#ffcb03] group-hover:text-[#14092e]">
                  <MessageCircle className="h-4 w-4" />
                </span>
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 transition-colors hover:text-[#ffcb03]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-[#ffcb03] group-hover:text-[#14092e]">
                  <Instagram className="h-4 w-4" />
                </span>
                @{INSTAGRAM_HANDLE}
              </a>
            </li>
            <li className="inline-flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                <MapPin className="h-4 w-4" />
              </span>
              Goiânia — GO
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-white/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Casa Prime Eventos. Todos os direitos reservados.</span>
          <span className="text-white/50">A sua casa de diversão.</span>
        </div>
      </div>
    </footer>
  );
}
