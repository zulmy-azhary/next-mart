import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

type FormFileProps<TValues extends FieldValues> = React.ComponentPropsWithRef<"button"> & {
  control: Control<TValues>;
  name: Path<TValues>;
  label?: string;
};

export const FormFile = <TValues extends FieldValues>(props: FormFileProps<TValues>) => {
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
              endpoint="imageUploader"
              value={field.value ? [field.value] : []}
              onRemove={() => field.onChange("")}
              onChange={(
                res: Parameters<React.ComponentProps<typeof ImageUpload>["onChange"]>[number]
              ) => field.onChange(res[0].url)}
              className={cn(
                fieldState.error && "border border-red-500",
                className,
                "col-span-full w-full h-[150px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px] aspect-video"
              )}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
