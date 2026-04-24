import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-ink text-white shadow-card hover:bg-ocean",
        variant === "secondary" &&
          "border border-line bg-white text-ink hover:border-ocean hover:text-ocean",
        variant === "ghost" && "text-ocean hover:bg-mist",
        className,
      )}
      {...props}
    />
  );
}
