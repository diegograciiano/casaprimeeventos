import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, BarChart3, CalendarDays, Plus, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface CrmNavProps {
  totalLeads?: number;
  onNewLead?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function CrmNav({ totalLeads, onNewLead, onRefresh, isRefreshing }: CrmNavProps) {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  const tabs = [
    {
      to: "/admin",
      label: "Funil / Kanban",
      icon: LayoutGrid,
      active: currentPath === "/admin",
    },
    {
      to: "/relatorios",
      label: "Relatórios & Valores",
      icon: BarChart3,
      active: currentPath === "/relatorios",
    },
    {
      to: "/agenda",
      label: "Agenda de Festas",
      icon: CalendarDays,
      active: currentPath === "/agenda",
    },
  ];

  return (
    <header className="mb-6 rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-purple-100 w-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Brand & Voltar ao Site */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="group block shrink-0">
            <img
              src="/logo.png"
              alt="Casa Prime Eventos"
              className="h-11 sm:h-12 w-auto object-contain transition group-hover:scale-105"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg sm:text-xl font-bold text-gray-900">
                CRM Casa Prime
              </span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-800">
                Gestão
              </span>
            </div>
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-purple-700 hover:underline"
            >
              ← Ir para o site público
            </Link>
          </div>
        </div>

        {/* Abas de Navegação (Estáticas, Sem quebra ou encolhimento) */}
        <nav className="flex items-center gap-2 shrink-0 rounded-2xl bg-muted/60 p-1.5 border border-purple-100/60 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  tab.active
                    ? "bg-[#8641df] text-white shadow-md shadow-purple-500/20"
                    : "text-gray-600 hover:text-purple-900 hover:bg-white/80"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.to === "/admin" && totalLeads != null && (
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      tab.active ? "bg-white/25 text-white" : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {totalLeads}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Ações Rápidas (Sempre idênticas em todas as abas) */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          {onNewLead ? (
            <Button
              onClick={onNewLead}
              className="rounded-xl bg-[#8641df] hover:bg-purple-700 text-white font-bold gap-1.5 shadow-sm text-xs sm:text-sm h-9 sm:h-10 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Novo lead</span>
            </Button>
          ) : (
            <Button
              asChild
              className="rounded-xl bg-[#8641df] hover:bg-purple-700 text-white font-bold gap-1.5 shadow-sm text-xs sm:text-sm h-9 sm:h-10 shrink-0"
            >
              <Link to="/admin">
                <Plus className="h-4 w-4" />
                <span>Novo lead</span>
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-xl border-purple-200 text-purple-950 font-semibold gap-1.5 h-9 sm:h-10 text-xs sm:text-sm hover:bg-purple-50 shrink-0"
            title="Atualizar dados do Supabase"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 gap-1.5 h-9 sm:h-10 text-xs sm:text-sm shrink-0"
            title="Sair do CRM"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
