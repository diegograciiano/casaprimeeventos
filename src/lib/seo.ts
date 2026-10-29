export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return "https://casaprimeeventos.vercel.app";
}

export function getOgMeta(options?: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}) {
  const baseUrl = getBaseUrl();
  const title = options?.title ?? "Casa Prime Eventos — Festas Infantis em Goiânia";
  const description =
    options?.description ??
    "Espaço exclusivo para festas infantis: 12h de festa, piscina aquecida, buffet completo, brinquedos com monitores e algodão doce à vontade! Simule seu orçamento pelo site.";
  const path = options?.path ?? "/";
  const url = `${baseUrl}${path}`;
  const image = options?.image
    ? options.image.startsWith("http")
      ? options.image
      : `${baseUrl}${options.image}`
    : `${baseUrl}/og-image.jpg`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: "Casa Prime Eventos" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: "Casa Prime Eventos — Espaço de Festas Infantis em Goiânia",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}
