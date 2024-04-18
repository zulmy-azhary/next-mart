"use client";

import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { sizeSchema } from "@/schemas/size";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Size } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type EditSizeFormProps = {
  size: Size;
};

export const EditSizeForm: React.FC<EditSizeFormProps> = (props) => {
  const { size } = props;

  const [isLoading, setLoading] = useState(false);
  const { storeId, id } = useParams<{ storeId: string; id: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof sizeSchema>>({
    resolver: zodResolver(sizeSchema),
    mode: "onChange",
    defaultValues: size,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setLoading(true);
      const response = await axios.patch(`/api/${storeId}/sizes/${id}`, values);
      toast.success(response.data.message);
      router.push(`/${storeId}/sizes`);
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
            label="Name"
            placeholder="e.g. Extra Small"
            isLoading={isLoading}
          />
          <FormInput
            control={form.control}
            name="value"
            label="Size"
            placeholder="e.g. XS"
            isLoading={isLoading}
          />
        </div>
        <Button type="submit" variant="primary" disabled={isLoading}>
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
