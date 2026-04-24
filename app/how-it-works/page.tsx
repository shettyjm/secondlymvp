import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

export default function HowItWorksPage() {
  return (
    <div className="space-y-10 py-8">
      <SectionHeading
        eyebrow="Workflow"
        title="How StandbyHealth works"
        description="A physician-reviewed workflow designed for patients and families who need a careful written explanation, not generic advice."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["1. Start a case", "Create an account, answer intake questions, and describe the medical situation in plain language."],
          ["2. Upload records", "Add discharge summaries, labs, medication lists, and imaging reports into a private document bucket."],
          ["3. AI organizes the case", "A structured summary is prepared for physician review with clear gaps, risks, and suggested follow-up questions."],
          ["4. Physician review", "A physician reviews the record, edits the draft, and prepares a patient-friendly written opinion."],
        ].map(([title, body]) => (
          <Card key={title} className="space-y-3">
            <h3 className="text-xl font-semibold text-ink">{title}</h3>
            <p className="text-sm leading-6 text-slate-600">{body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
