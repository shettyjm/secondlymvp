"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadPlaceholder } from "@/components/cases/upload-placeholder";
import {
  caseIntakeSchema,
  type CaseIntakeInput,
} from "@/lib/validators/cases";
import { createAndSubmitCaseAction } from "@/lib/cases/actions";

const steps = [
  "Patient details",
  "Medical situation",
  "Top questions",
  "Upload records",
  "Review and submit",
];

const defaults: CaseIntakeInput = {
  patient_name: "",
  patient_age: 0,
  patient_country: "",
  relationship_to_patient: "",
  main_issue: "",
  diagnosis: "",
  current_symptoms: "",
  current_medications: "",
  timeline: "",
  top_questions: ["", "", ""],
  preferred_turnaround: "Standard",
  consent: true,
  disclaimer_acknowledged: true,
};

function buildFormData(data: CaseIntakeInput): FormData {
  const fd = new FormData();
  fd.append("patient_name", data.patient_name);
  fd.append("patient_age", String(data.patient_age));
  fd.append("patient_country", data.patient_country);
  fd.append("relationship_to_patient", data.relationship_to_patient);
  fd.append("main_issue", data.main_issue);
  fd.append("diagnosis", data.diagnosis ?? "");
  fd.append("current_symptoms", data.current_symptoms);
  fd.append("current_medications", data.current_medications);
  fd.append("timeline", data.timeline);
  data.top_questions
    .filter(Boolean)
    .forEach((q) => fd.append("top_questions", q));
  fd.append("preferred_turnaround", data.preferred_turnaround);
  fd.append("consent", data.consent ? "true" : "false");
  fd.append(
    "disclaimer_acknowledged",
    data.disclaimer_acknowledged ? "true" : "false",
  );
  return fd;
}

export function NewCaseForm() {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<CaseIntakeInput>({
    resolver: zodResolver(caseIntakeSchema),
    defaultValues: defaults,
  });

  const values = form.watch();

  const visibleQuestions = useMemo(
    () => values.top_questions.filter(Boolean),
    [values.top_questions],
  );

  const onSubmit = form.handleSubmit(
    (data) => {
      setServerError(null);
      startTransition(async () => {
        const result = await createAndSubmitCaseAction(null, buildFormData(data));
        if (result && "error" in result) {
          setServerError(result.error);
        }
      });
    },
    (errors) => {
      const firstFieldWithError = Object.keys(errors)[0];
      const firstMessage =
        Object.values(errors)
          .map((e) => (e as { message?: string })?.message)
          .filter(Boolean)[0] ?? "Please fill in all required fields.";
      setServerError(`${firstMessage} (field: ${firstFieldWithError})`);
    },
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
      <Card className="h-fit space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-teal">Intake progress</p>
        {steps.map((label, index) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                index <= step ? "bg-ink text-white" : "bg-mist text-ocean"
              }`}
            >
              {index + 1}
            </div>
            <span className={index === step ? "font-semibold text-ink" : "text-slate-500"}>
              {label}
            </span>
          </div>
        ))}
      </Card>

      <Card className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-teal">
            Step {step + 1}
          </p>
          <h1 className="text-3xl font-semibold text-ink">{steps[step]}</h1>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Patient name" {...form.register("patient_name")} />
              <Input placeholder="Patient age" type="number" {...form.register("patient_age")} />
              <Input placeholder="Patient country" {...form.register("patient_country")} />
              <Input
                placeholder="Relationship to patient"
                {...form.register("relationship_to_patient")}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Textarea placeholder="Main medical issue" {...form.register("main_issue")} />
              <Textarea placeholder="Diagnosis, if known" {...form.register("diagnosis")} />
              <Textarea
                placeholder="Current symptoms"
                {...form.register("current_symptoms")}
              />
              <Textarea
                placeholder="Current medications"
                {...form.register("current_medications")}
              />
              <Textarea placeholder="Timeline of events" {...form.register("timeline")} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <Textarea
                  key={index}
                  placeholder={`Question ${index + 1}`}
                  {...form.register(`top_questions.${index}`)}
                />
              ))}
              <Input
                placeholder="Preferred turnaround"
                {...form.register("preferred_turnaround")}
              />
            </div>
          )}

          {step === 3 && (
            <UploadPlaceholder />
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Card className="bg-mist">
                <pre className="overflow-auto whitespace-pre-wrap text-sm text-slate-700">
                  {JSON.stringify(
                    {
                      ...values,
                      top_questions: visibleQuestions,
                    },
                    null,
                    2,
                  )}
                </pre>
              </Card>
              <div className="space-y-3 text-sm text-slate-600">
                <label className="flex gap-3">
                  <input type="checkbox" defaultChecked {...form.register("consent")} />
                  <span>I confirm I have the right to share these records.</span>
                </label>
                <label className="flex gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    {...form.register("disclaimer_acknowledged")}
                  />
                  <span>I understand this is not emergency care or a replacement for local treatment.</span>
                </label>
              </div>
              {(serverError || form.formState.errors.root) && (
                <p className="text-sm text-red-600" role="alert">
                  {serverError ?? form.formState.errors.root?.message}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={step === 0 || pending}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              Back
            </Button>
            <div className="flex gap-3">
              {step < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
                >
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={pending}>
                  {pending ? "Submitting…" : "Submit case"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
