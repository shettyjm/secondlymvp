import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const tiers = [
  {
    name: "Standard written review",
    price: "$199",
    body: "Structured physician-reviewed written opinion with plain-English next steps.",
  },
  {
    name: "Expedited review",
    price: "$349",
    body: "Priority turnaround target for time-sensitive cases that still fit non-emergency criteria.",
  },
  {
    name: "Live consult add-on",
    price: "$149",
    body: "Placeholder add-on for a short physician conversation after the written review is delivered.",
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-10 py-8">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple, configurable MVP pricing"
        description="These values are placeholders in the starter and can be moved into admin-managed configuration later."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name} className="space-y-4">
            <h3 className="text-xl font-semibold text-ink">{tier.name}</h3>
            <p className="text-3xl font-semibold text-ocean">{tier.price}</p>
            <p className="text-sm leading-6 text-slate-600">{tier.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
