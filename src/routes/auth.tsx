import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bootstrapCrmAdmin } from "@/lib/leads.functions";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Acessar CRM · Casa Prime Eventos" }],
  }),
  component: AuthPage,
});

const resolveEmail = (input: string) => {
  const trimmed = input.trim();
  if (trimmed.includes("@")) {
    return trimmed.toLowerCase();
  }
  return `${trimmed.toLowerCase()}@casaprime.local`;
};

function AuthPage() {
  const navigate = useNavigate();
  const bootstrap = useServerFn(bootstrapCrmAdmin);
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const email = resolveEmail(loginInput);
      let { data: authData, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInErr && loginInput.trim().toLowerCase() === "casaprime") {
        // Primeiro acesso do usuário casaprime
        const { error: signUpErr } = await supabase.auth.signUp({ email, password });
        if (!signUpErr) {
          const retry = await supabase.auth.signInWithPassword({ email, password });
          signInErr = retry.error;
          authData = retry.data;
        } else {
          try {
            await bootstrap({});
            const retry = await supabase.auth.signInWithPassword({ email, password });
            signInErr = retry.error;
            authData = retry.data;
          } catch {
            // Ignore bootstrap error
          }
        }
      }

      if (signInErr) {
        const msg = signInErr.message || "";
        if (msg.toLowerCase().includes("email not confirmed")) {
          throw new Error(
            "E-mail ainda não confirmado. No Supabase (Authentication > Users), clique nos 3 pontinhos do usuário e em 'Confirm email' ou crie o usuário marcando a opção 'Auto Confirm User'."
          );
        }
        if (msg.toLowerCase().includes("invalid login credentials")) {
          throw new Error(
            "E-mail ou senha incorretos. Verifique se digitou o e-mail completo exatamente como cadastrado no Supabase."
          );
        }
        throw signInErr;
      }

      // Redireciona com reload limpo para garantir a sessão hidratada
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:underline">
            ← voltar ao site
          </Link>
        </div>
        <div className="mt-4 mb-3">
          <img
            src="/logo.png"
            alt="Casa Prime Eventos"
            className="h-12 w-auto object-contain"
          />
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold">Acessar CRM</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Painel interno da Casa Prime Eventos.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="login">E-mail de Acesso</Label>
            <Input
              id="login"
              type="text"
              autoComplete="username"
              placeholder="seu-email@exemplo.com"
              required
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full h-11 rounded-2xl bg-[#8641df] hover:bg-purple-700 text-white font-bold text-base shadow-md shadow-purple-500/20"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar no CRM"}
          </Button>
        </form>
      </div>
    </div>
  );
}
