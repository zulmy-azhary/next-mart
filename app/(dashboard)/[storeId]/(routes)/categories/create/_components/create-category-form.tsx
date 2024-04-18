"use client";

import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { categorySchema } from "@/schemas/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type CreateCategoryFormProps = {
  billboards: Billboard[];
};

export const CreateCategoryForm: React.FC<CreateCategoryFormProps> = (props) => {
  const { billboards } = props;

  const [isLoading, setLoading] = useState(false);
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/${storeId}/categories`, values);
      toast.success(response.data.message);
      router.push(`/${storeId}/categories`);
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-8 space-y-4 md:space-y-0">
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
          Create
        </Button>
      </form>
    </Form>
  );
};
