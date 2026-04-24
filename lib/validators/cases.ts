import { z } from "zod";

export const caseIntakeSchema = z.object({
  patient_name: z.string().min(2, "Patient name is required"),
  patient_age: z.coerce.number().int().min(0).max(120),
  patient_country: z.string().min(2, "Country is required"),
  relationship_to_patient: z.string().min(2, "Relationship is required"),
  main_issue: z.string().min(10, "Describe the main issue"),
  diagnosis: z.string().optional(),
  current_symptoms: z.string().min(10, "Add current symptoms"),
  current_medications: z.string().min(3, "Add current medications"),
  timeline: z.string().min(10, "Add a brief timeline"),
  top_questions: z
    .array(z.string().min(5))
    .min(1, "Add at least one question")
    .max(3, "Up to three questions"),
  preferred_turnaround: z.string().min(2, "Choose a turnaround"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
  disclaimer_acknowledged: z.literal(true, {
    errorMap: () => ({ message: "Acknowledgement is required" }),
  }),
});

export type CaseIntakeInput = z.infer<typeof caseIntakeSchema>;
