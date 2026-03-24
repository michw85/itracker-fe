import type { ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface ITEM {
  label: string;
  value: string | null;
}

export type CustomSelectProps = {
  id?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  description?: ReactNode;
  error?: ReactNode | boolean;
  alignItemWithTrigger?: boolean;
  items: ITEM[];
  defaultValue?: string;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  label,
  required,
  disabled,
  description,
  error,
  alignItemWithTrigger,
  items,
  defaultValue,
}) => {
  return (
    <Field data-invalid={!!error} className="w-full">
      {label && (
        <FieldLabel for={id}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </FieldLabel>
      )}
      <Select items={items} defaultValue={defaultValue} disabled={disabled}>
        <SelectTrigger id={id} aria-invalid={!!error}>
          <SelectValue/>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={alignItemWithTrigger}>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                disabled={disabled}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};

CustomSelect.displayName = "CustomSelect";
