/**
 * Task query utilities for fetching and filtering tasks from Supabase
 * Handles task normalization, filtering, sorting, and statistics calculation
 */

import { filtersSchema } from "$lib/schemas/taskSchema";

// Priority ranking for sorting (High = 0, Medium = 1, Low = 2)
const priorityRank = { High: 0, Medium: 1, Low: 2 };

/**
 * Normalize Supabase task response to match UI shape
 * Converts snake_case database fields to camelCase for consistency
 * @param {any} task - Task object from Supabase
 * @returns {Object} Normalized task object with camelCase properties
 */
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

/**
 * Build task view with filters, sorting, and statistics
 * This is the main function for fetching and organizing task data for the dashboard
 *
 * @param {any} supabase - Authenticated Supabase client instance
 * @param {string} userId - Current user's ID for filtering tasks
 * @param {URLSearchParams} searchParams - URL search params containing filter/sort options
 * @returns {Promise<Object>} Object containing tasks array, applied filters, and statistics
 */
export const buildTaskView = async (supabase, userId, searchParams) => {
  // Extract filter parameters from URL, with defaults
  const filtersInput = {
    status: searchParams.get("status") ?? "all",
    priority: searchParams.get("priority") ?? "all",
    sort: searchParams.get("sort") ?? "dueDate",
    query: searchParams.get("q") ?? "",
  };

  // Validate and parse filters using Zod schema
  const filters = filtersSchema.parse(filtersInput);

  // Initialize Supabase query for user's tasks
  let query = supabase.from("tasks").select("*").eq("user_id", userId);

  // Apply status filter if not "all"
  if (filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  // Apply priority filter if not "all"
  if (filters.priority !== "all") {
    query = query.eq("priority", filters.priority);
  }

  // Apply search query (case-insensitive partial match on title)
  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }

  // Apply sorting based on selected option
  if (filters.sort === "dueDate") {
    query = query.order("due_date", { ascending: true }); // Soonest first
  } else if (filters.sort === "priority") {
    query = query.order("priority", { ascending: false }); // High first
  } else {
    query = query.order("created_at", { ascending: false }); // Newest first
  }

  // Execute the query
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }

  // Normalize task objects to camelCase format
  const tasks = (data ?? []).map(normalizeTask);

  // Fetch all tasks for statistics (ignoring current filters)
  const allTasksQuery = supabase
    .from("tasks")
    .select("status")
    .eq("user_id", userId);

  const { data: allTasks } = await allTasksQuery;

  // Calculate task statistics for dashboard header
  const stats = {
    total: allTasks?.length ?? 0,
    pending: allTasks?.filter((t) => t.status === "Pending").length ?? 0,
    inProgress: allTasks?.filter((t) => t.status === "In Progress").length ?? 0,
    completed: allTasks?.filter((t) => t.status === "Completed").length ?? 0,
  };

  return { tasks, filters, stats };
};
