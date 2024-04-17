"use client";

import { FormCheckbox } from "@/components/form/form-checkbox";
import { FormInput } from "@/components/form/form-input";
import { FormMultiFile } from "@/components/form/form-multifile";
import { FormSelect } from "@/components/form/form-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { productSchema } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category, Color, Image, Product, Size } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type EditProductFormProps = {
  data: {
    product: Product & { images: Image[] };
    categories: Category[];
    sizes: Size[];
    colors: Color[];
  };
};

export const EditProductForm: React.FC<EditProductFormProps> = (props) => {
  const { product, categories, sizes, colors } = props.data;

  const [isLoading, setLoading] = useState(false);
  const { storeId, id } = useParams<{ storeId: string; id: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      ...product,
      price: parseFloat(String(product.price)),
      images: product.images.map((image) => image.url),
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${storeId}/products/${id}`, values);
      router.push(`/${storeId}/products`);
      router.refresh();
      toast.success("Product updated.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormMultiFile control={form.control} name="images" label="Image" disabled={isLoading} />
        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-8 space-y-4 md:space-y-0">
          <FormInput
            control={form.control}
            name="name"
            label="Product Name"
            placeholder="e.g. Navy Blue Suit"
            isLoading={isLoading}
          />
          <FormInput
            control={form.control}
            type="number"
            name="price"
            label="Price"
            placeholder="e.g. 19.99"
            isLoading={isLoading}
          />
          <FormSelect
            control={form.control}
            name="categoryId"
            label="Category"
            placeholder="Select Category"
            isLoading={isLoading}
          >
            {categories.map(({ id, name }) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </FormSelect>
          <FormSelect
            control={form.control}
            name="sizeId"
            label="Size"
            placeholder="Select Size"
            isLoading={isLoading}
          >
            {sizes.map(({ id, name }) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </FormSelect>
          <FormSelect
            control={form.control}
            name="colorId"
            label="Color"
            placeholder="Select Color"
            isLoading={isLoading}
          >
            {colors.map(({ id, name, value }) => (
              <SelectItem key={id} value={id}>
                <div className="w-full flex items-center gap-2">
                  <span
                    className="size-5 rounded-full !bg-center !bg-cover transition-all border"
                    style={{ background: value }}
                  />
                  <p className="truncate flex-1">{name}</p>
                </div>
              </SelectItem>
            ))}
          </FormSelect>
        </div>
        <div className="sm:grid sm:grid-cols-2 xl:grid-cols-3 sm:gap-8 space-y-4 sm:space-y-0">
          <FormCheckbox
            control={form.control}
            name="isFeatured"
            description="This product will appear on the home page."
            label="Featured"
            disabled={isLoading}
          />
          <FormCheckbox
            control={form.control}
            name="isArchived"
            description="This product will not appear anywhere in the store."
            label="Archived"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" variant="primary" disabled={isLoading}>
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
