import { json } from "@sveltejs/kit";
import { createSupabaseServerClient } from "$lib/server/supabase";
import { clearSessionCookie, getSessionCookie } from "$lib/server/session";

export const POST = async ({ cookies }) => {
  const storedSession = getSessionCookie(cookies);

  if (storedSession?.access_token && storedSession?.refresh_token) {
    try {
      const supabase = createSupabaseServerClient();
      await supabase.auth.setSession({
        access_token: storedSession.access_token,
        refresh_token: storedSession.refresh_token,
      });
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Failed to sign out from Supabase", error);
    }
  }

  clearSessionCookie(cookies);
  return json({ ok: true });
};
