import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleErr || !isAdmin) {
      throw new Error("Forbidden");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("leads_festas")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { leads: data ?? [] };
  });

export const getLeadSummary = createServerFn({ method: "POST" })
  .inputValidator((data: { sessionId: string }) => {
    if (!data?.sessionId || typeof data.sessionId !== "string" || data.sessionId.length < 8) {
      throw new Error("Invalid sessionId");
    }
    return { sessionId: data.sessionId };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lead } = await supabaseAdmin
      .from("leads_festas")
      .select(
        "responsavel_nome, telefone, email, crianca_nome, idade, data_festa, qtd_pessoas, pacote, tema, restricoes",
      )
      .eq("session_id", data.sessionId)
      .maybeSingle();

    const lines: string[] = [
      "Olá Casa Prime! 🎉 Conversei com a Sofia e gostaria de continuar meu atendimento.",
      "",
      "*Resumo do que preenchi:*",
    ];
    const add = (label: string, v: unknown) => {
      if (v !== null && v !== undefined && String(v).trim() !== "") {
        lines.push(`• *${label}:* ${v}`);
      }
    };
    if (lead) {
      add("Nome", lead.responsavel_nome);
      add("WhatsApp", lead.telefone);
      add("E-mail", lead.email);
      add("Aniversariante", lead.crianca_nome);
      add("Idade", lead.idade);
      add("Data pretendida", lead.data_festa);
      add("Convidados", lead.qtd_pessoas);
      add("Pacote de interesse", lead.pacote);
      add("Tema/sonho", lead.tema);
      add("Observações", lead.restricoes);
    }
    return { message: lines.join("\n") };
  });
