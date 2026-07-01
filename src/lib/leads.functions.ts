import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";


const LeadSchema = z.object({
  crianca_nome: z.string().trim().max(120).optional().nullable(),
  data_festa: z.string().trim().max(120).optional().nullable(),
  qtd_pessoas: z.number().int().min(1).max(2000).optional().nullable(),
  pacote: z.string().trim().max(60).optional().nullable(),
  tema: z.string().trim().max(200).optional().nullable(),
  restricoes: z.string().trim().max(500).optional().nullable(),
  responsavel_nome: z.string().trim().min(2).max(120),
  telefone: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(160).optional().nullable().or(z.literal("")),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      throw new Error("Backend não configurado");
    }
    const supabase = createClient(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    const payload = {
      ...data,
      email: data.email ? data.email : null,
    };

    const { error } = await supabase.from("leads_festas").insert(payload);
    if (error) {
      console.error("[submitLead]", error);
      throw new Error("Não conseguimos salvar seu contato agora. Tente novamente ou fale conosco no WhatsApp.");
    }
    return { ok: true as const };
  });
