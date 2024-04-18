"use client";

import { FormColor } from "@/components/form/form-color";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { colorSchema } from "@/schemas/color";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export const CreateColorForm: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof colorSchema>>({
    resolver: zodResolver(colorSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      value: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/${storeId}/colors`, values);
      toast.success(response.data.message);
      router.push(`/${storeId}/colors`);
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
            placeholder="e.g. Mint Turquoise"
            isLoading={isLoading}
          />
          <FormColor control={form.control} name="value" label="Color" isLoading={isLoading} />
        </div>
        <Button type="submit" variant="primary" disabled={isLoading}>
          Create
        </Button>
      </form>
    </Form>
  );
};
