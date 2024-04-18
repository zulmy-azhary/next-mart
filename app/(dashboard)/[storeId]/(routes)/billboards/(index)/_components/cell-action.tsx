"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuCopy, LuTrash2 } from "react-icons/lu";
import { RxDotsHorizontal } from "react-icons/rx";
import { FiEdit3 } from "react-icons/fi";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import type { BillboardColumn } from "./columns";
import { useState } from "react";
import { DeleteModal } from "@/components/modals/delete-modal";
import Image from "next/image";
import axios from "axios";

type CellActionProps = {
  billboard: BillboardColumn;
};

export const CellAction: React.FC<CellActionProps> = (props) => {
  const { billboard } = props;
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Billboard ID copied to clipboard.");
  };

  const onEdit = () => {
    router.push(`/${storeId}/billboards/${billboard.id}`);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/${storeId}/billboards/${billboard.id}`);
      toast.success(response.data.message);
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <RxDotsHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onCopy(billboard.id)}>
            <LuCopy className="size-4 mr-2" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <FiEdit3 className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <LuTrash2 className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteModal
        title="Delete Billboard"
        description="Are you sure you want to delete this billboard? This action cannot be undone."
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
      >
        <div className="relative w-full h-[150px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px] aspect-video rounded-md overflow-hidden">
          <Image
            fill
            priority
            className="object-cover select-none"
            sizes="auto"
            src={billboard.imageUrl}
            alt="Image upload"
          />
        </div>
      </DeleteModal>
    </>
  );
};
