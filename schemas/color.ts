import { z } from "zod";

export const colorSchema = z.object({
  name: z.string().min(1, "Name is required.").min(3, "Name must be at least 3 characters."),
  value: z
    .string()
    .min(1, "Color is required.")
    .min(4, "Color must be at least 4 characters.")
    .max(9, "Maximum length of Color is 9 characters.")
    .regex(/^#[0-9A-F]{6}[0-9a-f]{0,2}$/i, "Color must be a valid hex code."),
});
