import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  submitted: "bg-blue-100 text-blue-700",
  ai_processing: "bg-cyan-100 text-cyan-700",
  physician_review: "bg-amber-100 text-amber-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        statusStyles[status] ?? "bg-slate-100 text-slate-700",
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
