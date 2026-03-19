import type { ChangeEvent } from "react";

export interface InputProps {
    name?: string;
    label?: string;
    type?: "text" | "password" | "email" | "tel" | "number";
    id?: string;
    className?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    value?: string;
    isViewSwitcher?: boolean;
    error?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
