/**
 * Form validation utilities for SvelteKit form actions
 * Provides helpers for parsing and validating form data with Zod schemas
 */

import { fail } from "@sveltejs/kit";

/**
 * Parse FormData into a plain object with trimmed string values
 *
 * @param {Request} request - SvelteKit request object containing FormData
 * @returns {Promise<Record<string, any>>} Object with form field values
 *
 * @example
 * const values = await parseFormData(request);
 * // { title: "My Task", priority: "High" }
 */
export const parseFormData = async (request) => {
  const data = await request.formData();
  /** @type {Record<string, any>} */
  const values = {};

  // Extract and trim all string values
  for (const [key, value] of data.entries()) {
    values[key] = typeof value === "string" ? value.trim() : value;
  }

  return values;
};

/**
 * Higher-order function that wraps form action handlers with Zod validation
 * Automatically parses form data, validates against schema, and handles errors
 *
 * @param {ZodSchema} schema - Zod schema for validation
 * @param {Function} handler - Form action handler function
 * @returns {Function} Wrapped action handler with validation
 *
 * @example
 * const createTask = withActionValidation(
 *   taskSchema,
 *   async ({ data, locals }) => {
 *     // data is validated and typed
 *     const task = await db.create(data);
 *     return { success: true, task };
 *   }
 * );
 */
export const withActionValidation =
  (schema, handler) =>
  async ({ request, ...rest }) => {
    // Parse form data into plain object first (can only be done once)
    const values = await parseFormData(request);

    try {
      // Validate data against Zod schema
      const parsed = schema.parse(values);

      // Call handler with validated data
      const result = await handler({ ...rest, data: parsed, raw: values });
      return result;
    } catch (error) {
      // Handle Zod validation errors
      if (error?.formErrors || error?.issues) {
        const flattened = error.flatten
          ? error.flatten()
          : { fieldErrors: {}, formErrors: [error.message] };

        // Return SvelteKit fail response with validation errors
        return fail(400, {
          errors: flattened,
          values: values,
        });
      }

      // For any other errors, return a proper fail response instead of throwing
      console.error("Validation wrapper error:", error);
      return fail(500, {
        message: error?.message ?? "An unexpected error occurred",
      });
    }
  };
