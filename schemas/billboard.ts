import { z } from "zod";

export const billboardSchema = z.object({
  label: z.string().min(1, "Billboard Label is required.").min(10, "Billboard Label must be at least 10 characters."),
  imageUrl: z.string().min(1, "Image is required."),
});
