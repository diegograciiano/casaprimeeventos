
CREATE TABLE public.leads_festas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crianca_nome TEXT,
  data_festa TEXT,
  qtd_pessoas INTEGER,
  pacote TEXT,
  tema TEXT,
  restricoes TEXT,
  responsavel_nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.leads_festas TO anon;
GRANT INSERT ON public.leads_festas TO authenticated;
GRANT ALL ON public.leads_festas TO service_role;

ALTER TABLE public.leads_festas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON public.leads_festas
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
