import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
  description: z
    .string()
    .max(500, "Max 500 characters")
    .optional()
    .or(z.literal("")),
  priority: z.enum(["Low", "Medium", "High"], { message: "Select a priority" }),
  dueDate: z.string().min(1, "Due date required"),
  status: z.enum(["Pending", "In Progress", "Completed"]).default("Pending"),
});

export const filtersSchema = z.object({
  status: z.enum(["all", "Pending", "In Progress", "Completed"]).default("all"),
  priority: z.enum(["all", "Low", "Medium", "High"]).default("all"),
  sort: z.enum(["dueDate", "priority", "createdAt"]).default("dueDate"),
  query: z.string().optional().or(z.literal("")),
});
