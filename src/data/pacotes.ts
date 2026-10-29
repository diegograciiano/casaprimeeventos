export type Secao = { titulo: string; itens: string[] };

export type TabelaPreco = {
  pessoas: number;
  valor: number;
  valorFormatado: string;
};

export type Pacote = {
  id: string;
  nome: string;
  subtitulo: string;
  tag: string;
  badge?: string;
  img: string;
  secoes: Secao[];
  valores: TabelaPreco[];
  aPartirDe: string;
};

const bebidas = [
  "Coca-Cola",
  "Coca-Cola Zero",
  "Guaraná Antarctica",
  "Água sem gás",
  "Suco La Fruit de uva",
  "Suco La Fruit de caju",
];

const sobremesa = [
  "Sorvete Ninho com morango",
  "Sorvete Ferrero Rocher",
];

export const inclusoEmTodos = [
  "12 horas de locação do espaço (aproveite sem correria!)",
  "Piscina aquecida para as crianças e adultos",
  "Barraquinha de algodão doce e pipoca quentinhos",
  "Brinquedos com monitores para tranquilidade dos pais",
  "Bebidas liberadas de primeira linha e sobremesas finas",
  "Equipe Prime a postos (limpeza, recepção e atendimento)",
];

export const FAIXAS_PESSOAS = [50, 60, 70, 80, 90, 100, 110, 120] as const;

export const pacotes: Pacote[] = [
  {
    id: "pacote-pirulito",
    nome: "Pacote Pirulito",
    tag: "#PACOTE PIRULITO",
    subtitulo: "Entradas + Prato Principal + Barraquinhas",
    badge: "O Mais Doce",
    img: "/images/algodao-doce-pipoca.jpg",
    aPartirDe: "R$ 9.490,00",
    secoes: [
      {
        titulo: "Entradas",
        itens: [
          "Mussarela em cubos",
          "Presunto em cubos",
          "Azeitona sem caroço",
          "Tomate cereja",
          "Salame italiano",
          "Provolone fatiado",
          "Patê de frango",
          "Torradas e pão sírio",
          "Batata frita",
          "Barraquinha de algodão doce e pipoca",
        ],
      },
      {
        titulo: "Prato Principal",
        itens: [
          "Arroz branco",
          "Maminha ao molho limão",
          "Frango ao molho 4 queijos",
          "Batata palha",
          "Salada tropical (Molho de mostarda e mel)",
        ],
      },
      { titulo: "Bebidas", itens: bebidas },
      { titulo: "Sobremesa", itens: sobremesa },
      {
        titulo: "Brinquedos",
        itens: [
          "Futebol de sabão",
          "Pula-pula",
          "Castelinho com escorrega na piscina",
          "Brinquedoteca",
        ],
      },
    ],
    valores: [
      { pessoas: 50, valor: 9490, valorFormatado: "R$ 9.490,00" },
      { pessoas: 60, valor: 10068, valorFormatado: "R$ 10.068,00" },
      { pessoas: 70, valor: 10490, valorFormatado: "R$ 10.490,00" },
      { pessoas: 80, valor: 10840, valorFormatado: "R$ 10.840,00" },
      { pessoas: 90, valor: 11415, valorFormatado: "R$ 11.415,00" },
      { pessoas: 100, valor: 12290, valorFormatado: "R$ 12.290,00" },
      { pessoas: 110, valor: 12850, valorFormatado: "R$ 12.850,00" },
      { pessoas: 120, valor: 13250, valorFormatado: "R$ 13.250,00" },
    ],
  },
  {
    id: "pacote-diversao",
    nome: "Pacote Diversão",
    tag: "#PACOTE DIVERSÃO",
    subtitulo: "Buffet Completo + Mini Circuito",
    badge: "O Favorito dos Pais",
    img: "/images/salao-decorado-azul.jpg",
    aPartirDe: "R$ 9.940,00",
    secoes: [
      {
        titulo: "Entradas",
        itens: [
          "Mussarela em cubos",
          "Presunto em cubos",
          "Azeitona sem caroço",
          "Tomate cereja",
          "Salame italiano",
          "Provolone fatiado",
          "Patê de frango",
          "Torradas e pão sírio",
          "Batata frita",
          "Barraquinha de algodão doce e pipoca",
        ],
      },
      {
        titulo: "Prato Principal",
        itens: [
          "Arroz branco",
          "Lagarto ao molho madeira",
          "Frango à parmegiana",
          "Batata sauté",
          "Salada tropical (Molho de mostarda e mel)",
        ],
      },
      { titulo: "Bebidas", itens: bebidas },
      { titulo: "Sobremesa", itens: sobremesa },
      {
        titulo: "Brinquedos",
        itens: [
          "Futebol de sabão",
          "Pula-pula",
          "Castelinho com escorrega na piscina",
          "Brinquedoteca",
          "Mini Circuito",
        ],
      },
    ],
    valores: [
      { pessoas: 50, valor: 9940, valorFormatado: "R$ 9.940,00" },
      { pessoas: 60, valor: 10490, valorFormatado: "R$ 10.490,00" },
      { pessoas: 70, valor: 10940, valorFormatado: "R$ 10.940,00" },
      { pessoas: 80, valor: 11490, valorFormatado: "R$ 11.490,00" },
      { pessoas: 90, valor: 11865, valorFormatado: "R$ 11.865,00" },
      { pessoas: 100, valor: 12740, valorFormatado: "R$ 12.740,00" },
      { pessoas: 110, valor: 13300, valorFormatado: "R$ 13.300,00" },
      { pessoas: 120, valor: 13700, valorFormatado: "R$ 13.700,00" },
    ],
  },
  {
    id: "pacote-churrasco",
    nome: "Pacote Churrasco",
    tag: "#PACOTE CHURRASCO",
    subtitulo: "Festa Completa com Churrasco Nobre",
    badge: "Mais Procurado para Família",
    img: "/images/salao-decorado-rosa.jpg",
    aPartirDe: "R$ 10.431,00",
    secoes: [
      {
        titulo: "Entradas",
        itens: [
          "Churrasco",
          "Mandioca",
          "Patê de frango",
          "Barraquinha de algodão doce e pipoca",
        ],
      },
      {
        titulo: "Prato Principal",
        itens: [
          "Arroz branco",
          "Feijão tropeiro",
          "Vinagrete",
          "Mandioca cozida na manteiga",
        ],
      },
      {
        titulo: "Carne e Acompanhamentos",
        itens: [
          "Picanha",
          "Cupim",
          "Fraldinha",
          "Contra filé",
          "Linguiça toscana",
          "Asinha de frango",
          "Pão de alho",
        ],
      },
      { titulo: "Bebidas", itens: bebidas },
      { titulo: "Sobremesa", itens: sobremesa },
      {
        titulo: "Brinquedos",
        itens: [
          "Futebol de sabão",
          "Pula-pula",
          "Castelinho com escorrega na piscina",
          "Brinquedoteca",
          "Mini Circuito",
        ],
      },
    ],
    valores: [
      { pessoas: 50, valor: 10431, valorFormatado: "R$ 10.431,00" },
      { pessoas: 60, valor: 11078, valorFormatado: "R$ 11.078,00" },
      { pessoas: 70, valor: 11664, valorFormatado: "R$ 11.664,00" },
      { pessoas: 80, valor: 12190, valorFormatado: "R$ 12.190,00" },
      { pessoas: 90, valor: 12750, valorFormatado: "R$ 12.750,00" },
      { pessoas: 100, valor: 13614, valorFormatado: "R$ 13.614,00" },
      { pessoas: 110, valor: 14490, valorFormatado: "R$ 14.490,00" },
      { pessoas: 120, valor: 14790, valorFormatado: "R$ 14.790,00" },
    ],
  },
];

export function getValorPacote(pacoteIdOrNome: string, pessoas: number): TabelaPreco | undefined {
  const pId = pacoteIdOrNome.toLowerCase();
  const pacote = pacotes.find(
    (p) =>
      p.id.toLowerCase() === pId ||
      p.nome.toLowerCase() === pId ||
      p.tag.toLowerCase().includes(pId) ||
      pId.includes(p.nome.toLowerCase()),
  );
  if (!pacote) return undefined;
  return pacote.valores.find((v) => v.pessoas === pessoas);
}
