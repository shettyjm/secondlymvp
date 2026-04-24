import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { mockCases } from "@/lib/mock-data";

export default async function PhysicianCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = mockCases.find((item) => item.id === id);

  if (!record) {
    notFound();
  }

  return (
    <div className="grid gap-6 py-8 lg:grid-cols-[0.42fr_0.58fr]">
      <div className="space-y-6">
        <Card className="space-y-4">
          <h1 className="text-2xl font-semibold text-ink">{record.patient_name}</h1>
          <p className="text-sm leading-6 text-slate-600">{record.main_issue}</p>
          <p className="text-sm leading-6 text-slate-600">
            Submitted records should be listed here with signed URLs generated
            server-side from the private `case-documents` bucket.
          </p>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">AI summary</h2>
          <p className="text-sm leading-6 text-slate-700">
            Family is requesting help understanding the diagnosis, medication
            changes, and which follow-up questions to ask locally. Record packet
            appears incomplete and should be confirmed against discharge
            paperwork.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-mist p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Urgency</p>
              <p className="mt-2 text-lg font-semibold text-ocean">
                {record.urgency_label} ({record.urgency_score}/5)
              </p>
            </div>
            <div className="rounded-3xl bg-mist p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Missing info</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Current vitals, lab trend, imaging impression, discharge medication reconciliation.
              </p>
            </div>
          </div>
        </Card>
      </div>
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold text-ink">Physician review draft</h2>
        <div className="grid gap-4">
          {[
            "Case summary",
            "Key concerns",
            "Recommendations",
            "Questions for local doctor",
            "Red flags",
            "Limitations",
            "Final opinion",
          ].map((label) => (
            <label key={label} className="space-y-2">
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <textarea
                className="min-h-24 w-full rounded-3xl border border-line px-4 py-3 text-sm"
                placeholder={label}
              />
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
