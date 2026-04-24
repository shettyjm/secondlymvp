import { NewCaseForm } from "@/components/cases/new-case-form";

export default function NewCasePage() {
  return (
    <div className="space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-teal">New case</p>
        <h1 className="text-4xl font-semibold text-ink">
          Gather the medical story in one place.
        </h1>
      </div>
      <NewCaseForm />
    </div>
  );
}
