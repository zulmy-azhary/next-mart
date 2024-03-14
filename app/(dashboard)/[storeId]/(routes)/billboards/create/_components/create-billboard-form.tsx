"use client";

import { FormInput } from "@/components/form/input";
import { FormInputFile } from "@/components/form/input-file";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { billboardSchema } from "@/schemas/billboard";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export const CreateBillboardForm: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof billboardSchema>>({
    resolver: zodResolver(billboardSchema),
    mode: "onChange",
    defaultValues: {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setLoading(true);
      await axios.post(`/api/${storeId}/billboards`, values);
      toast.success("Billboard created.");
      router.refresh();
      router.push(`/${storeId}/billboards`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormInput
            control={form.control}
            name="label"
            label="Billboard Label"
            placeholder="e.g. This Is My Example Billboard Label"
            isLoading={isLoading}
          />
          <FormInputFile
            control={form.control}
            name="imageUrl"
            label="Image"
            isLoading={isLoading}
          />
        </div>
        <Button type="submit" variant="primary" disabled={isLoading}>
          Create
        </Button>
      </form>
    </Form>
  );
};
