import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) {
        throw redirect({ to: "/auth" });
      }
      return { user: userData.user };
    }
    return { user: sessionData.session.user };
  },
  component: () => <Outlet />,
});
