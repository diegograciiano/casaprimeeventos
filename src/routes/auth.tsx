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

const USER_TO_EMAIL = (u: string) => `${u.trim().toLowerCase()}@casaprime.local`;

function AuthPage() {
  const navigate = useNavigate();
  const bootstrap = useServerFn(bootstrapCrmAdmin);
  const [username, setUsername] = useState("");
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
      const email = USER_TO_EMAIL(username);
      let { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr && username.trim().toLowerCase() === "casaprime") {
        // First-time bootstrap of the fixed admin account, then retry
        await bootstrap({});
        const retry = await supabase.auth.signInWithPassword({ email, password });
        signInErr = retry.error;
      }
      if (signInErr) throw signInErr;
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <Link to="/" className="text-sm text-muted-foreground hover:underline">
          ← voltar ao site
        </Link>
        <h1 className="mt-4 font-display text-2xl font-bold">Acessar CRM</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Painel interno da Casa Prime Eventos.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Aguarde…" : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
