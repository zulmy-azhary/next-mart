"use client";

import { FormInput } from "@/components/form/form-input";
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
import { DeleteModal } from "@/components/modals/delete-modal";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { LuTrash2 } from "react-icons/lu";

type SettingsFormProps = {
  store: Store;
};

export const SettingsForm: React.FC<SettingsFormProps> = (props) => {
  const { store } = props;

  const [isLoading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
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
      if (values.name === store.name) {
        throw new Error("Store is already updated.");
      }
      await axios.patch(`/api/stores/${store.id}`, values);
      toast.success("Store updated.");
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Section>
      <SectionHeader>
        <Heading title="Settings" description="Manage store settings and preferences" />
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <LuTrash2 className="mr-2 size-4" /> Delete Store
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
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
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || form.getValues().name === store.name}
            >
              Save Changes
            </Button>
          </form>
        </Form>
        <ApiClipboard
          title="PUBLIC API URL"
          variant="public"
          text={`${process.env.NEXT_PUBLIC_API_URL}/api/${store.id}`}
        />
      </SectionContent>
      <DeleteModal
        title="Delete Store"
        description="Are you sure you want to delete this store? This action cannot be undone."
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        onSubmit={onDelete}
      />
    </Section>
  );
};
