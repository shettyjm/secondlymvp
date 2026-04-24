import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const faqs = [
  {
    q: "Is this emergency care?",
    a: "No. This product is for educational second opinions and care navigation support. Urgent symptoms should be directed to local emergency services.",
  },
  {
    q: "Does AI make the final decision?",
    a: "No. AI is used to organize case information. A physician reviews and delivers the final written opinion.",
  },
  {
    q: "Can I upload private medical records?",
    a: "The architecture uses private storage, signed access, RLS, and server-side processing, but HIPAA readiness still depends on vendor agreements, ops controls, auditing, and legal review.",
  },
];

export function FAQ() {
  return (
    <section className="space-y-10 py-16">
      <SectionHeading
        eyebrow="FAQ"
        title="Clear boundaries build trust."
        description="These answers make the product safer to understand and easier to position with patients and physicians."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {faqs.map((item) => (
          <Card key={item.q} className="space-y-3">
            <h3 className="text-lg font-semibold text-ink">{item.q}</h3>
            <p className="text-sm leading-6 text-slate-600">{item.a}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
