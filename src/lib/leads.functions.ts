import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const LEAD_STATUSES = [
  "novo",
  "em_atendimento",
  "agendada",
  "finalizada",
  "nao_fechou",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const updateLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; status: string }) => {
    if (!data?.id || typeof data.id !== "string") throw new Error("Invalid id");
    if (!LEAD_STATUSES.includes(data.status as LeadStatus)) throw new Error("Invalid status");
    return { id: data.id, status: data.status as LeadStatus };
  })
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: role } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw new Error("Forbidden");
    const { error } = await supabaseAdmin
      .from("leads_festas")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateLeadValor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; valor: number | null }) => {
    if (!data?.id || typeof data.id !== "string") throw new Error("Invalid id");
    const v = data.valor;
    if (v !== null && (typeof v !== "number" || !isFinite(v) || v < 0)) throw new Error("Invalid valor");
    return { id: data.id, valor: v };
  })
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: role } = await supabaseAdmin
      .from("user_roles").select("id").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (!role) throw new Error("Forbidden");
    const { error } = await supabaseAdmin
      .from("leads_festas")
      .update({ valor: data.valor, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

async function requireAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: role } = await supabaseAdmin
    .from("user_roles").select("id").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!role) throw new Error("Forbidden");
  return supabaseAdmin;
}

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id || typeof data.id !== "string") throw new Error("Invalid id");
    return { id: data.id };
  })
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("leads_festas").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createLeadManual = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    responsavel_nome: string;
    telefone: string;
    email?: string | null;
    crianca_nome?: string | null;
    idade?: number | null;
    data_festa?: string | null;
    qtd_pessoas?: number | null;
    pacote?: string | null;
    tema?: string | null;
    restricoes?: string | null;
    valor?: number | null;
    status?: string;
  }) => {
    const nome = (data?.responsavel_nome ?? "").trim();
    const tel = (data?.telefone ?? "").trim();
    if (nome.length < 2 || nome.length > 120) throw new Error("Nome inválido");
    if (tel.length < 8 || tel.length > 30) throw new Error("Telefone inválido");
    return data;
  })
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const payload = {
      responsavel_nome: data.responsavel_nome.trim(),
      telefone: data.telefone.trim(),
      email: data.email?.trim() || null,
      crianca_nome: data.crianca_nome?.trim() || null,
      idade: data.idade ?? null,
      data_festa: data.data_festa?.trim() || null,
      qtd_pessoas: data.qtd_pessoas ?? null,
      pacote: data.pacote?.trim() || null,
      tema: data.tema?.trim() || null,
      restricoes: data.restricoes?.trim() || null,
      valor: data.valor ?? null,
      status: data.status || "novo",
      session_id: `manual-${crypto.randomUUID()}`,
    };
    const { data: row, error } = await supabaseAdmin
      .from("leads_festas").insert(payload).select("*").single();
    if (error) throw new Error(error.message);
    return { lead: row };
  });

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: role } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw new Error("Forbidden");
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
      "Ola Casa Prime! Conversei com a Sofia e gostaria de continuar meu atendimento.",
      "",
      "Resumo do que preenchi:",
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

// Idempotent bootstrap of the fixed CRM admin account.
// Credentials are intentionally fixed for the Casa Prime internal panel.
export const bootstrapCrmAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const email = "casaprime@casaprime.local";
  const password = "eventos2k26";
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Check if user already exists
  const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  let user = list?.users.find((u) => u.email === email);

  if (!user) {
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createErr) return { ok: false, reason: createErr.message };
    user = created.user ?? undefined;
  }

  if (!user) return { ok: false, reason: "no_user" };

  // Ensure admin role
  const { data: existingRole } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!existingRole) {
    await supabaseAdmin.from("user_roles").insert({ user_id: user.id, role: "admin" });
  }
  return { ok: true };
});
