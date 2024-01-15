import { HTMLAttributes, ReactNode } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: "button" | "reset" | "submit";
}

function Button({ children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className="rounded bg-blue-600 text-white font-semibold px-2 py-1"
    >
      {children}
    </button>
  );
}

export default Button;
