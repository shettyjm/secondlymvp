import { CASE_STATUSES, USER_ROLES } from "@/lib/constants";

export type CaseStatus = (typeof CASE_STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];

export type CaseRecord = {
  id: string;
  user_id: string;
  patient_name: string;
  patient_age: number | null;
  patient_country: string | null;
  relationship_to_patient: string | null;
  main_issue: string;
  diagnosis: string | null;
  current_symptoms: string | null;
  current_medications: string | null;
  timeline: string | null;
  top_questions: string[];
  preferred_turnaround: string | null;
  status: CaseStatus;
  urgency_score: number | null;
  urgency_label: string | null;
  created_at: string;
  submitted_at: string | null;
  updated_at: string;
};
