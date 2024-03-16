import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

type FormFileProps<TValues extends FieldValues> = React.ComponentPropsWithRef<"button"> & {
  control: Control<TValues>;
  name: Path<TValues>;
  label?: string;
  isLoading?: boolean;
};

export const FormFile = <TValues extends FieldValues>(props: FormFileProps<TValues>) => {
  const { control, name, label, isLoading, disabled, ...rest } = props;

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
              url={field.value}
              onRemove={() => field.onChange("")}
              onChange={(url: string) => field.onChange(url)}
              className={cn(fieldState.error && "border border-red-500")}
              disabled={isLoading || disabled}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
