import { z } from "zod";

const email = z.string().email("Invalid email");
const password = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/[a-z]/, "Include a lowercase letter")
  .regex(/[0-9]/, "Include a number")
  .regex(/[^A-Za-z0-9]/, "Include a symbol");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password required"),
  remember: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === true || val === "on")
    .optional(),
});

export const signUpSchema = z.object({
  email,
  password,
  name: z.string().min(2, "Name required").max(50, "Max 50 characters"),
});

export const resetSchema = z.object({
  email,
});
