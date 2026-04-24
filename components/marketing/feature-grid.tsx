import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const useCases = [
  "A parent abroad with fragmented records shared over WhatsApp",
  "Hospital or ICU confusion when the care plan is not clear",
  "A new diagnosis that needs a second set of eyes",
  "Surgery decisions with unresolved questions or tradeoffs",
  "Medication review when the regimen feels overwhelming",
];

export function FeatureGrid() {
  return (
    <section className="space-y-10 py-16">
      <SectionHeading
        eyebrow="Where it helps"
        title="Built for moments when families need clarity fast."
        description="The MVP centers on the cases where records are scattered, advice is conflicting, and families need a physician-reviewed explanation they can trust."
      />
      <div className="grid gap-4 lg:grid-cols-5">
        {useCases.map((item) => (
          <Card key={item} className="min-h-40 bg-white">
            <p className="text-base leading-7 text-slate-700">{item}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
