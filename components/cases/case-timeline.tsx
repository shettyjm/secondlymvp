import { CheckCircle2, Circle } from "lucide-react";

const steps = ["draft", "submitted", "ai_processing", "physician_review", "delivered"];

export function CaseTimeline({ status }: { status: string }) {
  const activeIndex = Math.max(steps.indexOf(status), 0);

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const complete = index <= activeIndex;
        return (
          <div key={step} className="flex items-center gap-3">
            {complete ? (
              <CheckCircle2 className="h-5 w-5 text-teal" />
            ) : (
              <Circle className="h-5 w-5 text-slate-300" />
            )}
            <span className={complete ? "text-ink" : "text-slate-500"}>
              {step.replace("_", " ")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
