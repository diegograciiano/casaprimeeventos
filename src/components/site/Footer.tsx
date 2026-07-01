import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, MapPin } from "lucide-react";
import logo from "@/assets/icon-casa-prime.png.asset.json";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, waLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-16 bg-[#14092e] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo.url} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
            <div className="font-display text-xl font-bold">Casa Prime Eventos</div>
          </div>
          <p className="mt-3 text-sm text-white/85">
            A sua casa de diversão. Festas infantis inesquecíveis com estrutura completa,
            piscina aquecida e muita alegria.
          </p>
        </div>

        <div>
          <div className="font-display font-semibold">Navegação</div>
          <ul className="mt-3 space-y-1.5 text-sm text-white/85">
            <li><Link to="/" className="hover:text-white">Início</Link></li>
            <li><Link to="/pacotes" className="hover:text-white">Pacotes</Link></li>
            <li><Link to="/galeria" className="hover:text-white">Galeria</Link></li>
            <li><Link to="/sobre" className="hover:text-white">Sobre</Link></li>
            <li><Link to="/contato" className="hover:text-white">Contato</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-display font-semibold">Contato</div>
          <ul className="mt-3 space-y-2 text-sm text-white/90">
            <li>
              <a
                href={waLink("Olá Casa Prime! Quero informações.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white"
              >
                <Instagram className="h-4 w-4" /> @{INSTAGRAM_HANDLE}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Goiânia — GO
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-white/75 sm:px-6">
          © {new Date().getFullYear()} Casa Prime Eventos — A sua casa de diversão.
        </div>
      </div>
    </footer>
  );
}
