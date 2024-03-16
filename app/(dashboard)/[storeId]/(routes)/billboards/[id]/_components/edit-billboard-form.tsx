"use client";

import { FormInput } from "@/components/form/form-input";
import { FormFile } from "@/components/form/form-file";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { billboardSchema } from "@/schemas/billboard";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Billboard } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type EditBillboardFormProps = {
  billboard: Billboard;
};

export const EditBillboardForm: React.FC<EditBillboardFormProps> = (props) => {
  const { billboard } = props;

  const [isLoading, setLoading] = useState(false);
  const { storeId, id } = useParams<{ storeId: string; id: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof billboardSchema>>({
    resolver: zodResolver(billboardSchema),
    mode: "onChange",
    defaultValues: billboard,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${storeId}/billboards/${id}`, values);
      router.push(`/${storeId}/billboards`);
      router.refresh();
      toast.success("Billboard updated.");
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
          <FormFile
            control={form.control}
            name="imageUrl"
            label="Image"
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
