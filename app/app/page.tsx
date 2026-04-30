import Link from "next/link";
import { mockCases } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/cases/status-chip";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireUser } from "@/lib/auth/guards";

export default async function PatientDashboardPage() {
  const { user } = await requireUser();

  return (
    <div className="space-y-8 py-8">
      <Card className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-teal">
            Patient dashboard · {user.email}
          </p>
          <h1 className="text-3xl font-semibold text-ink">
            Welcome back. Your cases stay organized in one secure workspace.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/app/cases/new">
            <Button>Start new case</Button>
          </Link>
          <SignOutButton />
        </div>
      </Card>

      <div className="grid gap-4">
        {mockCases.map((item) => (
          <Card key={item.id} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-ink">{item.patient_name}</h2>
                <StatusChip status={item.status} />
              </div>
              <p className="text-sm text-slate-600">{item.main_issue}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {item.patient_country} • {item.preferred_turnaround}
              </p>
            </div>
            <Link href={`/app/cases/${item.id}`}>
              <Button variant="secondary">Open case</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
