import { fail } from "@sveltejs/kit";
import { resetSchema } from "$lib/schemas/authSchema";
import { createSupabaseServerClient } from "$lib/server/supabase";
import { withActionValidation } from "$lib/validation";

const handleReset = withActionValidation(resetSchema, async ({ data, url }) => {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${url.origin}/login`,
    });

    if (error) {
      return fail(400, {
        message: error.message ?? "Unable to send reset email",
      });
    }

    return { ok: true };
  } catch (error) {
    return fail(400, {
      message: error?.message ?? "Unable to send reset email",
    });
  }
});

export const load = () => ({
  message: "Enter the email tied to your workspace",
});

export const actions = {
  default: handleReset,
};
