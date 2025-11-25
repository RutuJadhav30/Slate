import { redirect } from "@sveltejs/kit";
import { createSupabaseServerClient } from "$lib/server/supabase";

const requireUser = (locals) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
  return locals.user;
};

const normalizeTask = (task) => ({
  id: task.id,
  userId: task.user_id,
  title: task.title,
  description: task.description ?? "",
  priority: task.priority,
  dueDate: task.due_date,
  status: task.status,
  createdAt: task.created_at,
  updatedAt: task.updated_at,
});

export const load = async ({ locals }) => {
  const user = requireUser(locals);
  const accessToken = locals.session?.access_token;
  const supabase = createSupabaseServerClient(accessToken);

  // Fetch all tasks created by the user
  const { data: tasksData, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const tasks = (tasksData ?? []).map(normalizeTask);

  // Calculate task statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "Pending").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    completed: tasks.filter((t) => t.status === "Completed").length,
  };

  return { user, tasks, stats };
};

export const actions = {};
