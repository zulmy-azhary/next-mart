"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LuTrash } from "react-icons/lu";
import { forwardRef } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";
import { toast } from "sonner";

type ImageUploadProps = Omit<React.ComponentProps<typeof Button>, "onChange"> & {
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  url: string;
};

export const ImageUpload = forwardRef<HTMLButtonElement, ImageUploadProps>((props, ref) => {
  const { onChange, onRemove, url, ...rest } = props;

  const onComplete = (res: ClientUploadedFileData<{ uploadedBy: string }>[]) => {
    onChange(res[0].url);
  };

  const onError = (error: Error) => {
    toast.error(`ERROR! ${error.message}`);
  };

  const onRemoveHandler = () => {
    onRemove(url);
  };

  return !!url ? (
    <div className="flex items-center gap-4">
      <div
        key={url}
        className="relative w-full h-[150px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px] aspect-video rounded-md overflow-hidden"
      >
        <div className="absolute z-10 top-2 right-2">
          <Button
            {...rest}
            type="button"
            onClick={onRemoveHandler}
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
    </div>
  ) : (
    <UploadDropzone
      endpoint="imageUploader"
      className="shadow ut-button:bg-primary ut-button:text-primary-foreground ut-button:shadow hover:ut-button:bg-primary/90 ut-button:text-sm ut-label:text-lg ut-label:text-primary ut-allowed-content:text-muted-foreground border-input"
      onClientUploadComplete={onComplete}
      onUploadError={onError}
    />
  );
});
