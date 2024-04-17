import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

type FormMultiFileProps<TValues extends FieldValues> = React.ComponentPropsWithRef<"button"> & {
  control: Control<TValues>;
  name: Path<TValues>;
  label?: string;
};

export const FormMultiFile = <TValues extends FieldValues>(props: FormMultiFileProps<TValues>) => {
  const { control, name, label, className, ...rest } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <ImageUpload
              {...field}
              {...rest}
              endpoint="multiImageUploader"
              value={field.value.map((image: string) => image)}
              onRemove={(url: string) =>
                field.onChange(field.value.filter((current: string) => current !== url))
              }
              onChange={(
                res: Parameters<React.ComponentProps<typeof ImageUpload>["onChange"]>[number]
              ) => {
                const images = res.map((image) => image.url);
                field.onChange([...field.value, ...images]);
              }}
              className={cn(
                fieldState.error && "border border-red-500",
                className,
                "col-span-1 w-full h-[200px] md:h-[300px] lg:h-[350px] xl:h-[400px] 2xl:h-[350px] aspect-video"
              )}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
