import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    title: "Upload records",
    body: "Gather PDFs, labs, medication lists, or discharge paperwork into one case file.",
  },
  {
    title: "AI organizes the case",
    body: "A structured summary and urgency triage are generated for physician review.",
  },
  {
    title: "Physician reviews",
    body: "A licensed physician edits the draft, checks the facts, and adds clinical context.",
  },
  {
    title: "You receive next steps",
    body: "The patient-facing opinion highlights concerns, questions to ask, and red flags.",
  },
];

export function Workflow() {
  return (
    <section className="space-y-10 py-16">
      <SectionHeading
        eyebrow="How it works"
        title="A simple workflow that respects both speed and accountability."
        description="The product is designed around a careful division of labor: AI for organization, physician review for judgment, and clear messaging for families."
      />
      <div className="grid gap-4 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Card key={step.title} className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">
              Step {index + 1}
            </div>
            <h3 className="text-xl font-semibold text-ink">{step.title}</h3>
            <p className="text-sm leading-6 text-slate-600">{step.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
