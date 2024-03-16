import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FormSelectProps<T extends FieldValues> = React.ComponentPropsWithRef<"button"> & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  isLoading?: boolean;
  placeholder?: string;
  children: React.ReactNode;
};

export const FormSelect = <TValues extends FieldValues>(props: FormSelectProps<TValues>) => {
  const { control, name, label, isLoading, disabled, placeholder, children, ...rest } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Select
              disabled={disabled || isLoading}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger
                className={cn(
                  fieldState.error && "border-red-500",
                  "data-[placeholder]:text-muted-foreground"
                )}
                {...rest}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>{children}</SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
