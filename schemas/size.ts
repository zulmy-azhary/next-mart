import { z } from "zod";

export const sizeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .min(4, "Name must be at least 4 characters."),
  value: z.string().min(1, "Size is required."),
});
