import { notFound } from "next/navigation";
import { CaseTimeline } from "@/components/cases/case-timeline";
import { StatusChip } from "@/components/cases/status-chip";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/guards";
import { getCaseById } from "@/lib/cases";

export default async function PatientCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const record = await getCaseById(id);

  if (!record) {
    notFound();
  }

  return (
    <div className="grid gap-6 py-8 lg:grid-cols-[0.35fr_0.65fr]">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold text-ink">{record.patient_name}</h1>
        <StatusChip status={record.status} />
        <CaseTimeline status={record.status} />
      </Card>
      <div className="space-y-6">
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">Intake summary</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Main issue</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-700">{record.main_issue}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Diagnosis</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-700">{record.diagnosis}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Symptoms</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-700">{record.current_symptoms}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Medications</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-700">{record.current_medications}</dd>
            </div>
          </dl>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">Uploaded documents</h2>
          <p className="text-sm leading-6 text-slate-600">
            Hook this section to signed Supabase Storage URLs so patients can
            see upload status and physicians can review files without public
            access.
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">Final physician opinion</h2>
          <p className="text-sm leading-6 text-slate-600">
            Delivered reviews should render here once `physician_reviews.status`
            is `delivered`.
          </p>
        </Card>
      </div>
    </div>
  );
}
