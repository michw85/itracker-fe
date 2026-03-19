export interface ButtonProps {
    type?: "button" | "submit" | "reset";
    name: string;
    className?: string;
    disabled?: boolean;
    onClick?: () => {}
}