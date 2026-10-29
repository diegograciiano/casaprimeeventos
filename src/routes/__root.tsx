import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";


import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Chatbot } from "@/components/site/Chatbot";
import { ChatbotProvider } from "@/components/site/ChatbotContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-watercolor px-4">
      <div className="max-w-md rounded-3xl bg-white/80 p-8 text-center shadow-xl backdrop-blur">
        <h1 className="font-display text-7xl font-bold text-pink">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    if (error instanceof Error) {
      reportLovableError(error, { boundary: "tanstack_root_error_component" });
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-watercolor px-4">
      <div className="max-w-md rounded-3xl bg-white/80 p-8 text-center shadow-xl backdrop-blur">
        <h1 className="font-display text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente novamente ou volte para a página inicial.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold transition hover:bg-accent"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Casa Prime Eventos — Espaço de festas infantil em Goiânia" },
      {
        name: "description",
        content:
          "A melhor festa infantil da sua vida acontece aqui. Piscina aquecida, brinquedos, buffet e estrutura premium. Solicite seu orçamento pelo WhatsApp.",
      },
      { name: "author", content: "Casa Prime Eventos" },
      { name: "theme-color", content: "#8641df" },
      { property: "og:title", content: "Casa Prime Eventos — Espaço de festas infantil em Goiânia" },
      {
        property: "og:description",
        content:
          "Espaço premium para festas infantis: piscina aquecida, brinquedos, buffet, decoração e muito mais.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Casa Prime Eventos" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Casa Prime Eventos — Espaço de festas infantil em Goiânia" },
      { name: "description", content: "Onde a magia da infância encontra o requinte e a sofisticação em Goiânia." },
      { property: "og:description", content: "Onde a magia da infância encontra o requinte e a sofisticação em Goiânia." },
      { name: "twitter:description", content: "Onde a magia da infância encontra o requinte e a sofisticação em Goiânia." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isBareLayout = pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/relatorios") || pathname.startsWith("/agenda") || pathname.startsWith("/atendimento");

  return (
    <QueryClientProvider client={queryClient}>
      <ChatbotProvider>
        <div className="flex min-h-screen flex-col bg-background">
          {!isBareLayout && <Header />}
          <main className={`flex-1 ${isBareLayout ? "admin-area" : ""}`}>
            <Outlet />
          </main>
          {!isBareLayout && <Footer />}
        </div>
        {!isBareLayout && <WhatsAppButton />}
        {!isBareLayout && <Chatbot />}
        <Toaster richColors position="top-center" />
      </ChatbotProvider>
    </QueryClientProvider>
  );
}
