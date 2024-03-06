"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/store/modal";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { storeSchema } from "@/schemas/store";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { FormInput } from "@/components/form/input";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import axios from "axios";

export const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const [isLoading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof storeSchema>>({
    resolver: zodResolver(storeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/stores", values);
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              control={form.control}
              name="name"
              label="Store Name"
              placeholder="e.g. My Store"
              isLoading={isLoading}
            />
          </div>
          <div className="flex justify-end gap-x-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
