import { useState, type ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../ui/field";
import { Input } from "../../ui/input";
import type React from "react";
import { Button } from "../../ui/button";
import { Eye, EyeOff } from "lucide-react";

export type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name?: string;
  label?: string;
  type?: "text" | "password" | "email" | "tel" | "number";
  id?: string;
  required?: boolean;
  disabled?: boolean;
  isViewSwitcher?: boolean;
  error?: ReactNode | boolean;
  description?: ReactNode;
  className?: string;
};

export const CustomInput: React.FC<CustomInputProps> = ({
  name,
  label,
  type = "text",
  id,
  required = false,
  disabled = false,
  isViewSwitcher = false,
  error,
  description,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const isPassword = type === "password";

  const actualType =
    isPassword && isViewSwitcher ? (isVisible ? "text" : "password") : type;
  return (
    <Field data-invalid={error ? true : false}>
      {label && (
        <FieldLabel for={id}>
          {label}{required && <span className="text-destructive"> *</span>}
        </FieldLabel>
      )}
      <div className="relative">
        <Input
          type={actualType}
          id={id}
          name={name}
          required={required}
          disabled={disabled}
          className={className}
          aria-invalid={!!error}
          {...props}
        />
        {isPassword && isViewSwitcher && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible((prev) => !prev)}
            className="absolute right-2"
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        )}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};

CustomInput.displayName = "CustomInput";
