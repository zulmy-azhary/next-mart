"use client";

import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { categorySchema } from "@/schemas/category";
import { FormSelect } from "@/components/form/form-select";
import { SelectItem } from "@/components/ui/select";

type EditCategoryFormProps = {
  category: Category;
  billboards: Billboard[];
};

export const EditCategoryForm: React.FC<EditCategoryFormProps> = (props) => {
  const { category, billboards } = props;

  const [isLoading, setLoading] = useState(false);
  const { storeId, id } = useParams<{ storeId: string; id: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: category,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setLoading(true);
      const response = await axios.patch(`/api/${storeId}/categories/${id}`, values);
      toast.success(response.data.message);
      router.push(`/${storeId}/categories`);
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          <FormInput
            control={form.control}
            name="name"
            label="Category Name"
            placeholder="e.g. Shirts"
            isLoading={isLoading}
          />
          <FormSelect
            control={form.control}
            name="billboardId"
            label="Billboard"
            placeholder="Select Billboard"
            isLoading={isLoading}
          >
            {billboards.map((billboard) => (
              <SelectItem key={billboard.id} value={billboard.id}>
                {billboard.label}
              </SelectItem>
            ))}
          </FormSelect>
        </div>
        <Button type="submit" variant="primary" disabled={isLoading}>
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
