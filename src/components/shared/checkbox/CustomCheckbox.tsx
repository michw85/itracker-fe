import { Checkbox } from "../../ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "../../ui/field";

export type CustomCheckboxProps = {
  id: string;
  name?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: boolean;
  checked?: boolean;
};

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  name,
  label,
  description,
  disabled,
  error,
  checked,
}) => {
  return (
    <Field
      orientation="horizontal"
      data-disabled={disabled}
      data-invalid={error}
    >
      <Checkbox
        id={id}
        name={name}
        defaultChecked={checked}
        disabled={disabled}
        aria-invalid={error}
      />
      {label && (
        <FieldContent>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}
        </FieldContent>
      )}
    </Field>
  );
};

CustomCheckbox.displayName = "CustomCheckbox";
