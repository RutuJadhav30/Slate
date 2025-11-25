import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { taskSchema } from "$lib/schemas/taskSchema";
import { withActionValidation } from "$lib/validation";
import { buildTaskView } from "$lib/server/taskQueries";
import { createSupabaseServerClient } from "$lib/server/supabase";

const updateSchema = taskSchema.partial().extend({ id: z.string() });
const deleteSchema = z.object({ id: z.string() });
const toggleSchema = z.object({
  id: z.string(),
  status: taskSchema.shape.status,
});

export const load = async ({ locals, url }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(302, "/login");
  }
  const accessToken = locals.session?.access_token;
  const supabase = createSupabaseServerClient(accessToken);
  const { tasks, filters, stats } = await buildTaskView(
    supabase,
    user.id,
    url.searchParams
  );
  return { user, tasks, filters, stats };
};

const requireUser = (locals) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
  return locals.user;
};

const createTask = withActionValidation(
  taskSchema,
  async ({ data, locals }) => {
    const user = requireUser(locals);
    const accessToken = locals.session?.access_token;
    const supabase = createSupabaseServerClient(accessToken);

    // Convert date string to ISO timestamp for Postgres TIMESTAMPTZ
    const dueDateTime = new Date(data.dueDate + "T23:59:59Z").toISOString();

    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: data.title,
        description: data.description ?? "",
        priority: data.priority,
        due_date: dueDateTime,
        status: data.status ?? "Pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      return fail(500, { message: "Failed to create task" });
    }

    return {
      success: true,
      task: {
        id: task.id,
        userId: task.user_id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.due_date,
        status: task.status,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      },
    };
  }
);

const updateTask = withActionValidation(
  updateSchema,
  async ({ data, locals }) => {
    const user = requireUser(locals);
    const { id, ...updates } = data;
    const accessToken = locals.session?.access_token;
    const supabase = createSupabaseServerClient(accessToken);

    const updateData = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.dueDate !== undefined) {
      updateData.due_date = new Date(
        updates.dueDate + "T23:59:59Z"
      ).toISOString();
    }
    if (updates.status !== undefined) updateData.status = updates.status;

    const { data: task, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
      return fail(404, { message: "Task not found" });
    }

    return {
      success: true,
      task: {
        id: task.id,
        userId: task.user_id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.due_date,
        status: task.status,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      },
    };
  }
);

const deleteTask = withActionValidation(
  deleteSchema,
  async ({ data, locals }) => {
    const user = requireUser(locals);
    const accessToken = locals.session?.access_token;
    const supabase = createSupabaseServerClient(accessToken);

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", data.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting task:", error);
      return fail(404, { message: "Task not found" });
    }

    return { success: true };
  }
);

const toggleTask = withActionValidation(
  toggleSchema,
  async ({ data, locals }) => {
    const user = requireUser(locals);
    const accessToken = locals.session?.access_token;
    const supabase = createSupabaseServerClient(accessToken);

    const { data: task, error } = await supabase
      .from("tasks")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling task:", error);
      return fail(404, { message: "Task not found" });
    }

    return {
      success: true,
      task: {
        id: task.id,
        userId: task.user_id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.due_date,
        status: task.status,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      },
    };
  }
);

export const actions = {
  create: createTask,
  update: updateTask,
  delete: deleteTask,
  toggle: toggleTask,
  async bulkClear({ locals }) {
    const user = requireUser(locals);
    const accessToken = locals.session?.access_token;
    const supabase = createSupabaseServerClient(accessToken);

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("user_id", user.id)
      .eq("status", "Completed");

    if (error) {
      console.error("Error bulk clearing tasks:", error);
      return fail(500, { message: "Failed to clear completed tasks" });
    }

    return { success: true };
  },
};
