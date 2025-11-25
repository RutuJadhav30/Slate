/**
 * Supabase server client factory
 * Creates authenticated Supabase clients for server-side operations
 * with proper Row Level Security (RLS) enforcement
 */

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "$env/static/private";

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

/**
 * Creates a Supabase client configured for server-side use
 *
 * Key features:
 * - No session persistence (server-side only)
 * - Uses access token in Authorization header for RLS
 * - No automatic session detection or token refresh
 *
 * @param {string} [accessToken] - User's access token from session (optional)
 * @returns {SupabaseClient} Configured Supabase client instance
 * @throws {Error} If required environment variables are missing
 *
 * @example
 * // For authenticated requests (RLS will use user's ID)
 * const supabase = createSupabaseServerClient(locals.session.access_token);
 *
 * // For public/anonymous requests
 * const supabase = createSupabaseServerClient();
 */
export const createSupabaseServerClient = (accessToken) => {
  // Validate required environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const options = {
    auth: {
      persistSession: false, // Don't store session on server
      detectSessionInUrl: false, // Don't parse session from URL
      autoRefreshToken: false, // Don't auto-refresh tokens
    },
    global: {
      headers: accessToken
        ? {
            // Pass access token for RLS enforcement
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
  };

  return createClient(supabaseUrl, supabaseAnonKey, options);
};
