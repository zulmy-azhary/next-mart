"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LuTrash } from "react-icons/lu";
import { forwardRef } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import type { ClientUploadedFileData } from "uploadthing/types";
import { toast } from "sonner";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { cn } from "@/lib/utils";

type ImageUploadProps = Omit<React.ComponentProps<typeof Button>, "onChange"> & {
  onChange: (value: ClientUploadedFileData<{ uploadedBy: string }>[]) => void;
  onRemove: (value: string) => void;
  value: string[];
  endpoint: keyof OurFileRouter;
};

export const ImageUpload = forwardRef<HTMLButtonElement, ImageUploadProps>((props, ref) => {
  const { onChange, onRemove, value, endpoint, className, ...rest } = props;

  const onError = (error: Error) => {
    toast.error(`ERROR! ${error.message}`);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 items-center gap-4">
        {value.map((url) => (
          <div key={url} className={cn(className, "relative rounded-md overflow-hidden")}>
            <div className="absolute z-10 top-2 right-2">
              <Button
                ref={ref}
                {...rest}
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <LuTrash className="size-4" />
              </Button>
            </div>
            <Image
              fill
              priority
              className="object-cover select-none"
              sizes="auto"
              src={url}
              alt="Image upload"
            />
          </div>
        ))}
      </div>
      <UploadDropzone
        endpoint={endpoint}
        className="shadow ut-button:bg-primary ut-button:text-primary-foreground ut-button:shadow hover:ut-button:bg-primary/90 ut-button:text-sm ut-label:text-lg ut-label:text-primary ut-allowed-content:text-muted-foreground border-input"
        onClientUploadComplete={(res) => onChange(res)}
        onUploadError={onError}
      />
    </>
  );
});

ImageUpload.displayName = "ImageUpload";
