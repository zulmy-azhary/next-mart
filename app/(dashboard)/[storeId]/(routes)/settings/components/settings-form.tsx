"use client";

import { FormInput } from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { storeSchema } from "@/schemas/store";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Store } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ApiClipboard } from "@/components/ui/api-clipboard";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteStoreModal } from "./delete-store-modal";

type SettingsFormProps = {
  store: Store;
};

export const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof storeSchema>>({
    resolver: zodResolver(storeSchema),
    mode: "onChange",
    defaultValues: store,
  });

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${store.id}`);
      router.refresh();
      router.push("/");
      toast.success("Store deleted.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${store.id}`, values);
      router.refresh();
      toast.success("Store updated.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <section className="flex flex-col gap-y-8">
      <div className="flex justify-between items-center">
        <Heading title="Settings" description="Manage store settings and preferences" />
        <DeleteStoreModal
          title="Delete Store"
          description="Are you sure you want to delete this store? This action cannot be undone."
          onClick={onDelete}
        />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormInput
              control={form.control}
              name="name"
              label="Store Name"
              placeholder="e.g. My Store"
              isLoading={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Save Changes
          </Button>
        </form>
      </Form>
      <ApiClipboard
        title="PUBLIC API URL"
        variant="public"
        text={`${process.env.NEXT_PUBLIC_API_URL}/api/${store.id}`}
      />
    </section>
  );
};
