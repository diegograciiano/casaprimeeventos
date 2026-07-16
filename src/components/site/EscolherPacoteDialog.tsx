import { Link } from "@tanstack/react-router";
import { ChefHat, Sparkles, PartyPopper, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const opcoes = [
  {
    to: "/pacotes/com-buffet",
    icon: ChefHat,
    titulo: "Pacotes com Buffet",
    descricao: "Pirulito, Diversão e Churrasco: cardápios completos, prontos para servir.",
  },
  {
    to: "/pacotes/sem-buffet",
    icon: Sparkles,
    titulo: "Pacotes sem Buffet",
    descricao: "Aluguel do espaço com estrutura, sem a parte de alimentação. Você organiza o cardápio.",
  },
  {
    to: "/pacotes/festa-completa",
    icon: PartyPopper,
    titulo: "Festa Completa",
    descricao: "Tudo em um só lugar: decoração, buffet, brinquedos, equipe e mais.",
  },
] as const;

export function EscolherPacoteDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl sm:text-3xl">
            Escolha o formato da sua festa
          </DialogTitle>
          <DialogDescription>
            Três formatos pensados para celebrar do seu jeito. Clique em um deles para ver todos os detalhes.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {opcoes.map(({ to, icon: Icon, titulo, descricao }) => (
            <Link
              key={to}
              to={to}
              onClick={() => onOpenChange(false)}
              className="group flex flex-col rounded-2xl border border-black/5 bg-[#ffec6f] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#8641df]/10 text-[#8641df]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-display text-lg font-bold text-[#14092e]">
                {titulo}
              </div>
              <p className="mt-1 flex-1 text-sm text-foreground/70">{descricao}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#8641df]">
                Ver detalhes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
