import type { ReactNode } from "react";
import { Checkbox } from "../../ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../ui/field";

export type CustomCheckboxProps = {
  id: string;
  name?: string;
  label?: string;
  required?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode | boolean;
  checked?: boolean;
};

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  name,
  label,
  required,
  description,
  disabled,
  error,
  checked,
}) => {
  return (
    <Field
      orientation="horizontal"
      data-disabled={disabled}
      data-invalid={!!error}
    >
      <Checkbox
        id={id}
        name={name}
        defaultChecked={checked}
        disabled={disabled}
        aria-invalid={!!error}
      />
      {(label || error) && (
        <FieldContent>
          <FieldLabel htmlFor={id}>{label}{required && <span className="text-destructive"> *</span>}</FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}
          {error && <FieldError>{error}</FieldError>}
        </FieldContent>
      )}
    </Field>
  );
};

CustomCheckbox.displayName = "CustomCheckbox";
