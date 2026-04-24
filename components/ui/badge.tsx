import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-line bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ocean",
        className,
      )}
    >
      {children}
    </span>
  );
}
