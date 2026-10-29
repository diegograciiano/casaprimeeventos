import { useState } from "react";
import { Check, Sparkles, Utensils, Flame, PartyPopper, MessageCircle, ArrowRight } from "lucide-react";
import { pacotes, FAIXAS_PESSOAS, inclusoEmTodos, type Pacote } from "@/data/pacotes";
import { useChatbot } from "@/components/site/ChatbotContext";
import { Button } from "@/components/ui/button";

export function TabelaPacotesValores({ modo = "completo" }: { modo?: "completo" | "compacto" }) {
  const { openChat } = useChatbot();
  const [pessoasSelecionadas, setPessoasSelecionadas] = useState<number>(70);
  const [detalhesPacote, setDetalhesPacote] = useState<Pacote | null>(null);

  const getIcone = (id: string) => {
    if (id.includes("pirulito")) return <PartyPopper className="h-6 w-6 text-pink-500" />;
    if (id.includes("diversao")) return <Sparkles className="h-6 w-6 text-amber-500" />;
    return <Flame className="h-6 w-6 text-orange-500" />;
  };

  return (
    <div className="w-full">
      {/* Seletor sutil de quantidade de convidados */}
      <div className="w-full max-w-4xl rounded-3xl border border-purple-100 bg-white/90 p-5 sm:p-7 shadow-lg backdrop-blur-md text-left">
        <div className="flex flex-col items-start justify-between gap-4 text-left sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700">
              <Sparkles className="h-3.5 w-3.5" /> Simule os valores da sua festa
            </span>
            <h4 className="mt-2 font-display text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              Quantos convidados você pretende chamar?
            </h4>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              Valores reais de referência com 12h de espaço, buffet, brinquedos e piscina aquecida inclusos!
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-purple-700">
              {pessoasSelecionadas}
            </span>
            <span className="text-base font-semibold text-gray-600"> convidados</span>
          </div>
        </div>

        {/* Botoes de selecao de convidados */}
        <div className="mt-5 flex flex-wrap items-center justify-start gap-2 sm:gap-2.5">
          {FAIXAS_PESSOAS.map((qtd) => {
            const ativo = pessoasSelecionadas === qtd;
            return (
              <button
                key={qtd}
                onClick={() => setPessoasSelecionadas(qtd)}
                className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${
                  ativo
                    ? "bg-[#8641df] text-white shadow-md shadow-purple-500/25 scale-105"
                    : "bg-purple-50 text-purple-900 hover:bg-purple-100"
                }`}
              >
                {qtd} pessoas
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid com os 3 pacotes */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        {pacotes.map((pacote) => {
          const valorObj = pacote.valores.find((v) => v.pessoas === pessoasSelecionadas);
          const valorFormatado = valorObj?.valorFormatado ?? pacote.aPartirDe;
          const valorPorPessoa = valorObj ? Math.round(valorObj.valor / pessoasSelecionadas) : null;
          const isDestaque = pacote.id.includes("diversao");

          return (
            <div
              key={pacote.id}
              className={`relative flex flex-col justify-between rounded-3xl bg-white p-7 transition-all duration-300 ${
                isDestaque
                  ? "border-2 border-[#ffcb03] shadow-2xl ring-4 ring-[#ffcb03]/20 md:-translate-y-2"
                  : "border border-gray-100 shadow-xl hover:-translate-y-1 hover:shadow-2xl"
              }`}
            >
              {pacote.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#ffcb03] px-4 py-1 text-xs font-black uppercase tracking-wider text-[#14092e] shadow-md">
                  {pacote.badge}
                </div>
              )}

              <div>
                <div className="flex items-center gap-3.5">
                  <div className="grid h-13 w-13 place-items-center rounded-2xl bg-purple-100">
                    {getIcone(pacote.id)}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                      {pacote.tag}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                      {pacote.nome.replace("Pacote ", "")}
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-600 font-medium leading-relaxed">
                  {pacote.subtitulo}
                </p>

                {/* Preço de referência sutil */}
                <div className="mt-6 rounded-2xl bg-purple-50/70 p-5 border border-purple-100/60">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">
                      Para {pessoasSelecionadas} pessoas:
                    </span>
                    {valorPorPessoa && (
                      <span className="text-xs font-bold text-purple-700">
                        ~R$ {valorPorPessoa}/convidado
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 font-display text-3xl sm:text-4xl font-extrabold text-purple-900 leading-tight">
                    {valorFormatado}
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 leading-normal">
                    *Valor fechado incluindo salão por 12h, buffet, brinquedos e equipe.
                  </p>
                </div>

                {/* O que está incluso resumido */}
                <div className="mt-6 space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Destaques inclusos:
                  </div>
                  {pacote.secoes.map((sec) => (
                    <div key={sec.titulo} className="flex items-start gap-2 text-sm text-gray-700 leading-normal">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong className="text-gray-900 font-semibold">{sec.titulo}:</strong>{" "}
                        {sec.itens.slice(0, 3).join(", ")}
                        {sec.itens.length > 3 ? ` e +${sec.itens.length - 3} itens` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="mt-7 space-y-2.5 pt-5 border-t border-gray-100">
                <Button
                  onClick={() => openChat(pacote.id)}
                  className="w-full rounded-2xl bg-[#ffcb03] py-6 font-display text-base font-bold text-[#14092e] shadow-md shadow-amber-300/40 hover:bg-[#ebd200] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Simular com Sofia (Chatbot)
                </Button>
                <button
                  type="button"
                  onClick={() => setDetalhesPacote(pacote)}
                  className="w-full text-center text-sm font-semibold text-purple-700 hover:text-purple-900 hover:underline py-1.5"
                >
                  Ver cardápio completo da imagem →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal com cardápio completo fiel à imagem anexada */}
      {detalhesPacote && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setDetalhesPacote(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  {detalhesPacote.tag}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#14092e]">
                  {detalhesPacote.nome}
                </h3>
                <p className="text-sm text-gray-500">{detalhesPacote.subtitulo}</p>
              </div>
              <button
                onClick={() => setDetalhesPacote(null)}
                className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {detalhesPacote.secoes.map((secao) => (
                <div key={secao.titulo} className="rounded-2xl bg-purple-50/50 p-4">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-purple-800">
                    {secao.titulo}
                  </h4>
                  <ul className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {secao.itens.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Tabela de valores completa deste pacote */}
              <div className="rounded-2xl border border-purple-200 bg-white p-4">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-purple-800">
                  Tabela Oficial de Valores (por número de convidados)
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {detalhesPacote.valores.map((val) => (
                    <div
                      key={val.pessoas}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-2.5 text-center"
                    >
                      <div className="text-xs text-gray-500">{val.pessoas} pessoas</div>
                      <div className="font-display text-sm font-bold text-purple-900">
                        {val.valorFormatado}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => {
                  const pId = detalhesPacote.id;
                  setDetalhesPacote(null);
                  openChat(pId);
                }}
                className="w-full rounded-2xl bg-[#ffcb03] font-bold text-[#14092e] shadow-md hover:bg-[#ebd200]"
              >
                Solicitar este Orçamento com a Sofia
              </Button>
              <Button
                variant="outline"
                onClick={() => setDetalhesPacote(null)}
                className="w-full rounded-2xl"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
