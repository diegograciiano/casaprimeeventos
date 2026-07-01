import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/personalizar")({
  head: () => ({
    meta: [
      { title: "Monte seu Pacote — Casa Prime Eventos" },
      {
        name: "description",
        content:
          "Personalize sua festa na Casa Prime Eventos: escolha entradas, pratos, bebidas, sobremesas e brinquedos e receba um orçamento pelo WhatsApp.",
      },
      { property: "og:title", content: "Monte seu Pacote — Casa Prime Eventos" },
      {
        property: "og:description",
        content: "Selecione o que quer na sua festa e receba seu orçamento personalizado.",
      },
    ],
  }),
  component: Personalizar,
});

type Categoria = {
  id: string;
  titulo: string;
  descricao?: string;
  itens: string[];
};

const categorias: Categoria[] = [
  {
    id: "entradas",
    titulo: "Entradas",
    descricao: "Selecione os frios e petiscos que quer servir.",
    itens: [
      "Mussarela em cubos",
      "Presunto em cubos",
      "Azeitona sem caroço",
      "Tomate cereja",
      "Salame italiano",
      "Provolone fatiado",
      "Patê de frango com torradas",
      "Batata frita",
      "Torresmo",
      "Mandioca frita",
    ],
  },
  {
    id: "pratos",
    titulo: "Pratos principais",
    descricao: "Escolha os pratos quentes do seu buffet.",
    itens: [
      "Arroz branco",
      "Maminha ao molho limão",
      "Lagarto ao molho madeira",
      "Frango ao molho 4 queijos",
      "Frango à parmegiana",
      "Batata palha",
      "Batata sauté",
      "Salada tropical (molho de mostarda e mel)",
    ],
  },
  {
    id: "churrasco",
    titulo: "Churrasco",
    descricao: "Adicione carnes e acompanhamentos ao seu evento.",
    itens: [
      "Picanha",
      "Cupim Grill",
      "Contra filé",
      "Linguiça toscana",
      "Tulipa de frango",
      "Pão de alho",
      "Feijão tropeiro",
      "Vinagrete",
      "Mandioca cozida",
    ],
  },
  {
    id: "bebidas",
    titulo: "Bebidas",
    itens: [
      "Coca-Cola",
      "Coca-Cola Zero",
      "Guaraná Antarctica",
      "Água sem gás",
      "Suco La Fruit de uva",
      "Suco La Fruit de caju",
    ],
  },
  {
    id: "sobremesas",
    titulo: "Sobremesas",
    itens: [
      "Sorvete Ninho com morango",
      "Sorvete Ferrero Rocher",
      "Barraquinha de algodão doce e pipoca",
    ],
  },
  {
    id: "brinquedos",
    titulo: "Brinquedos",
    itens: [
      "Piscina aquecida",
      "Futebol de sabão",
      "Pula-pula",
      "Castelinho com escorrega na piscina",
      "Brinquedoteca",
      "Mini Circuito",
    ],
  },
];

function Personalizar() {
  const [selecionados, setSelecionados] = useState<Record<string, boolean>>({});
  const [nome, setNome] = useState("");
  const [convidados, setConvidados] = useState("");
  const [data, setData] = useState("");

  const total = useMemo(
    () => Object.values(selecionados).filter(Boolean).length,
    [selecionados],
  );

  function toggle(item: string) {
    setSelecionados((s) => ({ ...s, [item]: !s[item] }));
  }

  const mensagem = useMemo(() => {
    const linhas: string[] = ["Olá Casa Prime! Quero um orçamento personalizado."];
    if (nome) linhas.push(`Nome: ${nome}`);
    if (data) linhas.push(`Data desejada: ${data}`);
    if (convidados) linhas.push(`Convidados: ${convidados}`);
    linhas.push("");
    linhas.push("Itens escolhidos:");
    for (const cat of categorias) {
      const escolhidos = cat.itens.filter((i) => selecionados[i]);
      if (escolhidos.length) {
        linhas.push(`\n*${cat.titulo}*`);
        for (const i of escolhidos) linhas.push(`• ${i}`);
      }
    }
    if (total === 0) linhas.push("(nenhum item selecionado ainda)");
    return linhas.join("\n");
  }, [selecionados, nome, convidados, data, total]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#8641df]">
          Monte seu pacote
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Personalize sua festa
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
          Escolha exatamente o que quer servir. Nós montamos um orçamento sob medida
          e enviamos pelo WhatsApp.
        </p>
      </div>

      <div className="mt-10 grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:grid-cols-3">
        <label className="flex flex-col text-sm font-semibold text-[#14092e]">
          Seu nome
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como podemos te chamar?"
            className="mt-1 rounded-xl border border-black/10 px-3 py-2 text-sm font-normal outline-none focus:border-[#8641df]"
          />
        </label>
        <label className="flex flex-col text-sm font-semibold text-[#14092e]">
          Data da festa
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="mt-1 rounded-xl border border-black/10 px-3 py-2 text-sm font-normal outline-none focus:border-[#8641df]"
          />
        </label>
        <label className="flex flex-col text-sm font-semibold text-[#14092e]">
          Nº de convidados
          <input
            inputMode="numeric"
            value={convidados}
            onChange={(e) => setConvidados(e.target.value.replace(/\D/g, ""))}
            placeholder="Ex.: 60"
            className="mt-1 rounded-xl border border-black/10 px-3 py-2 text-sm font-normal outline-none focus:border-[#8641df]"
          />
        </label>
      </div>

      <div className="mt-8 space-y-6">
        {categorias.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#14092e]">
                  {cat.titulo}
                </h2>
                {cat.descricao && (
                  <p className="mt-1 text-sm text-foreground/70">{cat.descricao}</p>
                )}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#8641df]">
                {cat.itens.filter((i) => selecionados[i]).length} escolhidos
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cat.itens.map((item) => {
                const ativo = !!selecionados[item];
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggle(item)}
                    className={
                      ativo
                        ? "flex items-center gap-2 rounded-xl border-2 border-[#8641df] bg-[#8641df]/10 px-3 py-2.5 text-left text-sm font-medium text-[#14092e]"
                        : "flex items-center gap-2 rounded-xl border-2 border-transparent bg-[#faf9fc] px-3 py-2.5 text-left text-sm text-[#14092e]/80 hover:border-[#8641df]/40"
                    }
                  >
                    <span
                      className={
                        ativo
                          ? "grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[#8641df] text-white"
                          : "grid h-5 w-5 shrink-0 place-items-center rounded-md border border-black/20"
                      }
                    >
                      {ativo && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-8 rounded-2xl border border-[#8641df]/20 bg-white/95 p-4 shadow-xl backdrop-blur">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-sm text-[#14092e]">
            <span className="font-bold">{total}</span> item(ns) selecionado(s)
          </div>
          <Button
            asChild
            size="lg"
            disabled={total === 0}
            className="rounded-full bg-[#25D366] font-display hover:bg-[#1eb955]"
          >
            <a
              href={waLink(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={total === 0}
              onClick={(e) => {
                if (total === 0) e.preventDefault();
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Solicitar orçamento no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
