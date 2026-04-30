"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCaseDraft, submitCase } from "@/lib/cases";
import { caseIntakeSchema } from "@/lib/validators/cases";
import { requireUser } from "@/lib/auth/guards";

export type CaseSubmitState =
  | { error: string }
  | { caseId: string }
  | null;

export async function createAndSubmitCaseAction(
  _prev: CaseSubmitState,
  formData: FormData,
): Promise<CaseSubmitState> {
  const { user } = await requireUser();

  const raw = {
    patient_name: formData.get("patient_name"),
    patient_age: formData.get("patient_age"),
    patient_country: formData.get("patient_country"),
    relationship_to_patient: formData.get("relationship_to_patient"),
    main_issue: formData.get("main_issue"),
    diagnosis: formData.get("diagnosis") ?? "",
    current_symptoms: formData.get("current_symptoms"),
    current_medications: formData.get("current_medications"),
    timeline: formData.get("timeline"),
    top_questions: formData.getAll("top_questions").map(String).filter(Boolean),
    preferred_turnaround: formData.get("preferred_turnaround"),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
    disclaimer_acknowledged:
      formData.get("disclaimer_acknowledged") === "on" ||
      formData.get("disclaimer_acknowledged") === "true",
  };

  const parsed = caseIntakeSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  let caseId: string;
  try {
    const draft = await createCaseDraft(parsed.data, user.id);
    caseId = draft.id;
    await submitCase(caseId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to submit case" };
  }

  revalidatePath("/app");
  redirect(`/app/cases/${caseId}`);
}
