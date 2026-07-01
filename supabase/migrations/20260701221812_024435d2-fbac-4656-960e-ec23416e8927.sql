-- Add session_id to leads_festas for progressive chat upserts
ALTER TABLE public.leads_festas ADD COLUMN IF NOT EXISTS session_id text UNIQUE;
ALTER TABLE public.leads_festas ADD COLUMN IF NOT EXISTS idade integer;
ALTER TABLE public.leads_festas ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Auto-promote first signup to admin (bootstrap CRM access)
CREATE OR REPLACE FUNCTION public.handle_new_user_bootstrap_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_bootstrap_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_bootstrap_admin();