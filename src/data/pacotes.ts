import salaoAzul from "@/assets/salao-azul.jpg.asset.json";
import salaoRosa from "@/assets/salao-rosa.jpg.asset.json";
import algodaoDoce from "@/assets/algodao-doce.jpg.asset.json";

export type Secao = { titulo: string; itens: string[] };
export type Pacote = {
  id: string;
  nome: string;
  subtitulo: string;
  img: string;
  secoes: Secao[];
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
  "Barraquinha de algodão doce e pipoca",
];
const brinquedos = [
  "Futebol de sabão",
  "Pula-pula",
  "Castelinho com escorrega na piscina",
  "Brinquedoteca",
  "Mini Circuito",
];

export const inclusoEmTodos = [
  "12h de locação do espaço",
  "Piscina aquecida",
  "Brinquedos por 4h",
  "Barraquinha de algodão doce e pipoca (4h)",
  "Bebidas variadas e sobremesa",
  "Equipe Prime a postos",
];

export const pacotes: Pacote[] = [
  {
    id: "Pacote Pirulito (Sem Buffet)",
    nome: "Pirulito",
    subtitulo: "Entradas + Prato principal",
    img: algodaoDoce.url,
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
          "Torradas",
          "Batata frita",
        ],
      },
      {
        titulo: "Prato principal",
        itens: [
          "Arroz branco",
          "Maminha ao molho limão",
          "Frango ao molho 4 queijos",
          "Batata palha",
          "Salada tropical (molho de mostarda e mel)",
        ],
      },
      { titulo: "Bebidas", itens: bebidas },
      { titulo: "Sobremesa", itens: sobremesa },
      { titulo: "Brinquedos", itens: brinquedos },
    ],
  },
  {
    id: "Pacote Diversão (Com Buffet)",
    nome: "Diversão",
    subtitulo: "Buffet completo",
    img: salaoAzul.url,
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
          "Torradas",
          "Batata frita",
        ],
      },
      {
        titulo: "Prato principal",
        itens: [
          "Arroz branco",
          "Lagarto ao molho madeira",
          "Frango à parmegiana",
          "Batata sauté",
          "Salada tropical (molho de mostarda e mel)",
        ],
      },
      { titulo: "Bebidas", itens: bebidas },
      { titulo: "Sobremesa", itens: sobremesa },
      { titulo: "Brinquedos", itens: brinquedos },
    ],
  },
  {
    id: "Pacote Churrasco (Festa Completa)",
    nome: "Churrasco",
    subtitulo: "Festa completa com churrasco",
    img: salaoRosa.url,
    secoes: [
      {
        titulo: "Entradas",
        itens: [
          "Patê de frango com torradas",
          "Batata frita",
          "Torresmo",
          "Mandioca",
          "Abacaxi com raspinha de limão",
        ],
      },
      {
        titulo: "Prato principal",
        itens: [
          "Arroz branco",
          "Feijão tropeiro",
          "Vinagrete",
          "Mandioca cozida",
        ],
      },
      {
        titulo: "Carne e acompanhamentos",
        itens: [
          "Picanha",
          "Cupim Grill",
          "Contra filé",
          "Linguiça toscana",
          "Tulipa de frango",
          "Pão de alho",
        ],
      },
      { titulo: "Bebidas", itens: bebidas },
      { titulo: "Sobremesa", itens: sobremesa },
      { titulo: "Brinquedos", itens: brinquedos },
    ],
  },
];
