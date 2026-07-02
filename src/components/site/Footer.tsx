import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, MapPin } from "lucide-react";
import logo from "@/assets/icon-casa-prime.png.asset.json";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, waLink } from "@/lib/whatsapp";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <div className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-white">
        {children}
      </div>
      <div className="mt-2 h-[3px] w-10 rounded-full bg-[#ffcb03]" />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-[#14092e] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-center md:grid-cols-2 md:gap-8 md:py-12 md:text-left">
        {/* Marca */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3">
            <img
              src={logo.url}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 object-contain brightness-0 invert"
            />
            <div className="font-display text-2xl font-bold leading-tight">
              Casa Prime<br />
              <span className="text-[#ffcb03]">Eventos</span>
            </div>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            A sua casa de diversão. Festas infantis inesquecíveis com estrutura completa,
            piscina aquecida e muita alegria.
          </p>
        </div>




        {/* Contato */}
        <div className="flex flex-col items-center md:items-start">
          <SectionTitle>Contato</SectionTitle>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            <li>
              <a
                href={waLink("Olá Casa Prime! Quero informações.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 transition-colors hover:text-[#ffcb03]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-[#ffcb03] group-hover:text-[#14092e]">
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
                className="group inline-flex items-center gap-2.5 transition-colors hover:text-[#ffcb03]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-[#ffcb03] group-hover:text-[#14092e]">
                  <Instagram className="h-4 w-4" />
                </span>
                @{INSTAGRAM_HANDLE}
              </a>
            </li>
            <li className="inline-flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                <MapPin className="h-4 w-4" />
              </span>
              Goiânia — GO
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1 px-6 py-4 pb-24 text-xs text-white/60 sm:flex-row sm:pb-4">
          <span>© {new Date().getFullYear()} Casa Prime Eventos. Todos os direitos reservados.</span>
          <span className="text-white/50">A sua casa de diversão.</span>
        </div>
      </div>
    </footer>
  );
}
