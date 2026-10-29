-- ========================================================
-- CASA PRIME EVENTOS - CONFIGURAÇÃO DO BANCO SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase:
-- https://supabase.com/dashboard/project/rnxhakcixwjdbrjvadex/sql/new
-- ========================================================

-- 1. Habilitar extensão de UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Leads de Festas (Armazena os orçamentos do Chatbot e formulários)
CREATE TABLE IF NOT EXISTS public.leads_festas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crianca_nome TEXT,
  idade INTEGER,
  data_festa TEXT,
  qtd_pessoas INTEGER,
  pacote TEXT,
  tema TEXT,
  restricoes TEXT,
  responsavel_nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  valor NUMERIC(12,2),
  status TEXT NOT NULL DEFAULT 'novo',
  session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Sistema de Cargos (Admin) para segurança do CRM
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 4. Função auxiliar de verificação de role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Trigger para tornar automaticamente qualquer usuário cadastrado no Supabase como ADMIN do CRM
CREATE OR REPLACE FUNCTION public.handle_new_user_bootstrap_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_bootstrap_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_bootstrap_admin();

-- 5.1 Garantir que quaisquer usuários já existentes em auth.users recebam permissão de admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Configuração de Permissões e RLS (Row Level Security)
ALTER TABLE public.leads_festas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Garante acesso total de leitura, alteração e exclusão a qualquer usuário autenticado (logado no CRM)
DROP POLICY IF EXISTS "Authenticated users full access to leads" ON public.leads_festas;
DROP POLICY IF EXISTS "Only admins can view leads" ON public.leads_festas;
DROP POLICY IF EXISTS "Only admins can update leads" ON public.leads_festas;
DROP POLICY IF EXISTS "Only admins can delete leads" ON public.leads_festas;

CREATE POLICY "Authenticated users full access to leads"
  ON public.leads_festas FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Permite visitantes (anon) criarem e atualizarem leads em tempo real pelo Chatbot (salvamento progressivo)
DROP POLICY IF EXISTS "Anon lead all" ON public.leads_festas;
DROP POLICY IF EXISTS "Anyone can submit a valid lead" ON public.leads_festas;
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads_festas;
DROP POLICY IF EXISTS "Anyone can update lead by session_id" ON public.leads_festas;
DROP POLICY IF EXISTS "Anyone can update own lead by session" ON public.leads_festas;

CREATE POLICY "Anon lead all"
  ON public.leads_festas FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Permite usuários verem seu próprio role
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.leads_festas TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_roles TO authenticated, service_role;
