import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listLeads } from "@/lib/leads.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "CRM · Casa Prime Eventos" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const fetchLeads = useServerFn(listLeads);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetchLeads(),
    refetchInterval: 15000,
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-muted/20 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              ← site
            </Link>
            <h1 className="font-display text-3xl font-bold">CRM · Leads da Sofia</h1>
            <p className="text-sm text-muted-foreground">
              Atualiza automaticamente. {data?.leads.length ?? 0} lead(s).
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              Atualizar
            </Button>
            <Button variant="ghost" onClick={signOut}>
              Sair
            </Button>
          </div>
        </header>

        {isLoading && <p className="text-muted-foreground">Carregando…</p>}
        {error && (
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Erro ao carregar"}
          </p>
        )}

        {data && (
          <div className="overflow-x-auto rounded-2xl bg-white shadow">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Quando</th>
                  <th className="p-3">Responsável</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Aniversariante</th>
                  <th className="p-3">Idade</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Pessoas</th>
                  <th className="p-3">Pacote</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-muted-foreground">
                      Nenhum lead ainda. Assim que alguém conversar com a Sofia, aparece aqui.
                    </td>
                  </tr>
                )}
                {data.leads.map((l) => (
                  <tr key={l.id} className="border-t hover:bg-muted/20">
                    <td className="whitespace-nowrap p-3 text-xs text-muted-foreground">
                      {new Date(l.updated_at ?? l.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="p-3 font-medium">{l.responsavel_nome}</td>
                    <td className="p-3">
                      <a
                        href={`https://wa.me/55${(l.telefone ?? "").replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {l.telefone}
                      </a>
                    </td>
                    <td className="p-3">{l.email ?? "—"}</td>
                    <td className="p-3">{l.crianca_nome ?? "—"}</td>
                    <td className="p-3">{l.idade ?? "—"}</td>
                    <td className="p-3">{l.data_festa ?? "—"}</td>
                    <td className="p-3">{l.qtd_pessoas ?? "—"}</td>
                    <td className="p-3">{l.pacote ?? "—"}</td>
                    <td className="p-3">
                      <Badge variant="secondary">{l.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
