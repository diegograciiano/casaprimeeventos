
-- Inline the admin check into the RLS policy so has_role() no longer needs to be callable by anon/authenticated
DROP POLICY IF EXISTS "Only admins can view leads" ON public.leads_festas;

CREATE POLICY "Only admins can view leads"
ON public.leads_festas
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

-- Revoke EXECUTE on the SECURITY DEFINER function from public API roles
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
