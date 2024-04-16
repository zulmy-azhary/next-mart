import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required."),
  images: z.string().array().min(1, "Images is required."),
  price: z.coerce.number().min(1, "Price is required."),
  categoryId: z.string().min(1, "Category is required."),
  colorId: z.string().min(1, "Color is required."),
  sizeId: z.string().min(1, "Size is required."),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});
