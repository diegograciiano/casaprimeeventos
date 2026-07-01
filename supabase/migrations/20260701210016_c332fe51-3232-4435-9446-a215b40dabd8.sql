
-- 1) Roles infrastructure for admin-only lead access
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

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

-- 2) Tighten leads_festas policies
-- Replace permissive INSERT (WITH CHECK true) with a validated one
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads_festas;

CREATE POLICY "Anyone can submit a valid lead"
  ON public.leads_festas FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(responsavel_nome)) BETWEEN 2 AND 120
    AND length(btrim(telefone)) BETWEEN 8 AND 30
    AND status = 'novo'
  );

-- Explicit SELECT policy restricted to admins only
CREATE POLICY "Only admins can view leads"
  ON public.leads_festas FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
