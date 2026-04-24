import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { mockCases } from "@/lib/mock-data";
import type { CaseIntakeInput } from "@/lib/validators/cases";

export const listCases = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return mockCases;
  }

  return data ?? mockCases;
});

export const getCaseById = cache(async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return mockCases.find((item) => item.id === id) ?? null;
  }

  return data;
});

export async function createCaseDraft(input: CaseIntakeInput, userId: string) {
  const supabase = await createClient();
  const payload = {
    user_id: userId,
    patient_name: input.patient_name,
    patient_age: input.patient_age,
    patient_country: input.patient_country,
    relationship_to_patient: input.relationship_to_patient,
    main_issue: input.main_issue,
    diagnosis: input.diagnosis || null,
    current_symptoms: input.current_symptoms,
    current_medications: input.current_medications,
    timeline: input.timeline,
    top_questions: input.top_questions.filter(Boolean),
    preferred_turnaround: input.preferred_turnaround,
    status: "draft",
  };

  const { data, error } = await supabase.from("cases").insert(payload).select().single();

  if (error) {
    throw error;
  }

  return data;
}

export async function submitCase(caseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.functions.invoke("submit-case", {
    body: { case_id: caseId },
  });

  if (error) {
    throw error;
  }
}
