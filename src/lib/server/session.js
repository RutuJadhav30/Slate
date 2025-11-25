const SESSION_COOKIE = "queue-session";
const cookieOptions = {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7,
};

const serializeSession = (session) => {
  if (!session?.access_token || !session?.refresh_token) {
    return null;
  }
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at:
      session.expires_at ??
      (session.expires_in
        ? Math.floor(Date.now() / 1000) + session.expires_in
        : null),
  };
};

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {import('@supabase/supabase-js').Session} session
 */
export const setSessionCookie = (cookies, session) => {
  const payload = serializeSession(session);
  if (!payload) return null;
  cookies.set(SESSION_COOKIE, JSON.stringify(payload), cookieOptions);
  return payload;
};

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
export const clearSessionCookie = (cookies) => {
  cookies.delete(SESSION_COOKIE, { path: "/" });
};

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
export const getSessionCookie = (cookies) => {
  const raw = cookies.get(SESSION_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};
