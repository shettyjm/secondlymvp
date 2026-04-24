import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/cases/status-chip";
import { mockCases } from "@/lib/mock-data";

export default function PhysicianQueuePage() {
  return (
    <div className="space-y-8 py-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-teal">Physician queue</p>
        <h1 className="text-4xl font-semibold text-ink">
          Review submitted cases with structured AI support.
        </h1>
      </div>

      <div className="grid gap-4">
        {mockCases.map((item) => (
          <Link key={item.id} href={`/physician/cases/${item.id}`}>
            <Card className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr_0.7fr_0.5fr] lg:items-center">
              <div>
                <p className="text-lg font-semibold text-ink">{item.patient_name}</p>
                <p className="text-sm leading-6 text-slate-600">{item.main_issue}</p>
              </div>
              <div className="text-sm text-slate-600">
                <p>{item.patient_country}</p>
                <p>{item.patient_age} years old</p>
              </div>
              <div className="text-sm text-slate-600">
                <p>Urgency: {item.urgency_label}</p>
                <p>Turnaround: {item.preferred_turnaround}</p>
              </div>
              <StatusChip status={item.status} />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
