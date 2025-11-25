import { createSupabaseServerClient } from "$lib/server/supabase";
import {
  getSessionCookie,
  clearSessionCookie,
  setSessionCookie,
} from "$lib/server/session";
import { mapSupabaseUser } from "$lib/server/userMapper";

export const handle = async ({ event, resolve }) => {
  const storedSession = getSessionCookie(event.cookies);
  if (storedSession?.access_token) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser(
      storedSession.access_token
    );

    if (data?.user) {
      event.locals.user = mapSupabaseUser(data.user);
      event.locals.session = storedSession;
    } else if (storedSession.refresh_token) {
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession({
          refresh_token: storedSession.refresh_token,
        });

      if (!refreshError && refreshData?.session && refreshData.user) {
        const payload = setSessionCookie(event.cookies, refreshData.session);
        event.locals.session = payload;
        event.locals.user = mapSupabaseUser(refreshData.user);
      } else {
        clearSessionCookie(event.cookies);
      }
    } else {
      clearSessionCookie(event.cookies);
    }
  }

  const response = await resolve(event);
  return response;
};
