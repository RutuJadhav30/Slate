import { fail, redirect } from "@sveltejs/kit";
import { signUpSchema } from "$lib/schemas/authSchema";
import { setSessionCookie } from "$lib/server/session";
import { createSupabaseServerClient } from "$lib/server/supabase";
import { mapSupabaseUser, getRandomAvatarColor } from "$lib/server/userMapper";
import { withActionValidation } from "$lib/validation";

export const load = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/dashboard");
  }
  return {};
};

const handleSignUp = withActionValidation(
  signUpSchema,
  async ({ data, cookies }) => {
    try {
      const supabase = createSupabaseServerClient();
      const color = getRandomAvatarColor();

      // Debug: chosen avatar color and email
      console.debug("[signup] chosen avatarColor:", color, "for email:", data.email);

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            avatarColor: color,
          },
        },
      });

      // Debug: supabase response summary
      console.debug(
        "[signup] supabase response - user:",
        !!signUpData?.user,
        "session:",
        !!signUpData?.session,
        "error:",
        !!error
      );

      if (error) {
        console.error("[signup] Supabase error:", error);
        return fail(400, {
          message: error.message ?? "Unable to create account",
          values: { name: data.name, email: data.email },
        });
      }

      // If user created but needs email confirmation
      if (signUpData?.user && !signUpData?.session) {
        console.info("[signup] user created, email confirmation required. avatarColor:", color);
        return { success: true, emailConfirmationRequired: true };
      }

      // If session was created (email confirmation disabled)
      if (signUpData?.session && signUpData?.user) {
        try {
          const mapped = mapSupabaseUser(signUpData.user);
          console.info("[signup] session created, user id:", mapped.id, "avatarColor:", color);
        } catch (mapErr) {
          console.debug("[signup] user mapping skipped or failed:", mapErr);
        }

        setSessionCookie(cookies, signUpData.session);
        return { success: true, emailConfirmationRequired: false };
      }

      console.warn("[signup] unexpected signup result:", signUpData);
      return fail(400, { message: "Unable to create account" });
    } catch (error) {
      console.error("[signup] handler error:", error);
      return fail(500, {
        message: error?.message ?? "An error occurred during signup. Please try again.",
        values: { name: data.name, email: data.email },
      });
    }
  }
);

export const actions = {
  default: async (event) => {
    const result = await handleSignUp(event);
    return result;
  },
};
