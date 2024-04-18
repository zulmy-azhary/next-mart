import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type FormCheckboxProps<T extends FieldValues> = React.ComponentPropsWithRef<"button"> & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description: string;
};

export const FormCheckbox = <TValues extends FieldValues>(props: FormCheckboxProps<TValues>) => {
  const { control, name, label, description, ...rest } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <div className="flex flex-row items-center gap-x-2">
            <FormControl>
              <Checkbox
                {...rest}
                checked={field.value}
                onCheckedChange={field.onChange}
                className={cn(fieldState.error && "border-red-500")}
              />
            </FormControl>
            <FormDescription className="cursor-default" onClick={() => field.onChange(!field.value)}>
              {description}
            </FormDescription>
          </div>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
