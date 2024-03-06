import { z } from "zod";

export const storeSchema = z.object({
  name: z
    .string()
    .min(1, "Store Name is required.")
    .min(4, "Store Name must be at least 4 characters.")
    .max(16, "Maximum length of Store Name is 16 characters."),
});
