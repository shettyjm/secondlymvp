import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

export default function DisclaimerPage() {
  return (
    <div className="space-y-10 py-8">
      <SectionHeading
        eyebrow="Legal"
        title="Important disclaimer"
        description="This language should be reviewed by counsel before launch, especially across physician licensing, state scope, and international patient scenarios."
      />
      <Card className="space-y-4">
        {[
          "StandbyHealth is not emergency care.",
          "This service is not a replacement for a local treating physician.",
          "The written review is educational and based only on information and records the user provides.",
          "Users should contact local emergency services or seek urgent in-person care for emergent symptoms.",
          "A physician may request more information before offering a final written opinion.",
        ].map((line) => (
          <p key={line} className="text-sm leading-7 text-slate-700">
            {line}
          </p>
        ))}
      </Card>
    </div>
  );
}
