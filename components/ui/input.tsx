import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-ocean",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
