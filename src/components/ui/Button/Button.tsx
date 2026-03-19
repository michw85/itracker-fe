import type { ButtonProps } from "./types";
import "./styles.css";

const Button = ({
  type = "button",
  name,
  className = "rounded bg-black px-4 py-1.5 font-medium text-white hover:bg-gray-800 transition",
  disabled = false,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`
        ${className}
        ${disabled
          ? "bg-gray-800"
          : ""}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
