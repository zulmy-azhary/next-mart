import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category Name is required.").min(4, "Category Name must be at least 4 characters."),
  billboardId: z.string().min(1, "Billboard is required.")
})