export const load = async ({ locals }) => ({
  user: locals.user ?? null,
  session: locals.session ?? null,
});
