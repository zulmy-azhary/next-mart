import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/ui/color-picker";

type FormColorProps<T extends FieldValues> = React.ComponentPropsWithRef<"input"> & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  isLoading?: boolean;
};

export const FormColor = <TValues extends FieldValues>(props: FormColorProps<TValues>) => {
  const { control, name, label, isLoading, disabled, ...rest } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <ColorPicker
              {...field}
              {...rest}
              background={field.value}
              setBackground={field.onChange}
              className={cn(fieldState.error && "border-red-500")}
              disabled={isLoading || disabled}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
