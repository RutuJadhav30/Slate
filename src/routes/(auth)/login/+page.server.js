import { fail, redirect } from "@sveltejs/kit";
import { loginSchema } from "$lib/schemas/authSchema";
import { setSessionCookie } from "$lib/server/session";
import { createSupabaseServerClient } from "$lib/server/supabase";
import { mapSupabaseUser } from "$lib/server/userMapper";
import { withActionValidation } from "$lib/validation";

export const load = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/dashboard");
  }
  return {};
};

const handleLogin = withActionValidation(
  loginSchema,
  async ({ data, cookies }) => {
    try {
      const supabase = createSupabaseServerClient();
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Supabase auth error:", error);
        return fail(400, {
          message: error?.message ?? "Invalid email or password",
          values: { email: data.email },
        });
      }

      if (!authData?.session || !authData.user) {
        console.error("No session or user returned from Supabase");
        return fail(400, {
          message: "Unable to create session. Please try again.",
          values: { email: data.email },
        });
      }

      setSessionCookie(cookies, authData.session);

      return { success: true };
    } catch (error) {
      console.error("Login handler error:", error);
      return fail(500, {
        message:
          error?.message ?? "An error occurred during login. Please try again.",
        values: { email: data.email },
      });
    }
  }
);

export const actions = {
  default: async (event) => {
    const result = await handleLogin(event);
    if (result?.success) {
      throw redirect(303, "/dashboard");
    }
    return result;
  },
};
