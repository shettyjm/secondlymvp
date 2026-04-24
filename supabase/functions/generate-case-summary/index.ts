import { corsHeaders } from "../_shared/cors.ts";
import { getAuthedUser } from "../_shared/auth.ts";
import { createAdminClient } from "../_shared/supabase.ts";

type SummaryShape = {
  one_paragraph_summary: string;
  timeline: string;
  current_medications: string;
  key_findings: string[];
  missing_information: string[];
  red_flags: string[];
  suggested_questions_for_physician: string[];
  urgency_score_1_to_5: number;
  urgency_rationale: string;
};

function buildPrompt(caseRecord: Record<string, unknown>, documents: Array<Record<string, unknown>>) {
  return `
You are assisting a licensed physician reviewer. You are not making a diagnosis or final treatment decision. Summarize the patient-provided case information into a concise, clinically useful structure.

Return JSON with:
- one_paragraph_summary
- timeline
- current_medications
- key_findings
- missing_information
- red_flags
- suggested_questions_for_physician
- urgency_score_1_to_5
- urgency_rationale

Use plain English. Do not invent facts. If records are missing or unclear, say so.

Case:
${JSON.stringify(caseRecord, null, 2)}

Documents:
${JSON.stringify(documents, null, 2)}
`;
}

function fallbackSummary(caseRecord: Record<string, unknown>, documentCount: number): SummaryShape {
  const mainIssue = String(caseRecord.main_issue ?? "Medical concern");
  const symptoms = String(caseRecord.current_symptoms ?? "Symptoms not fully described");
  const medications = String(caseRecord.current_medications ?? "Medication list not provided");
  const timeline = String(caseRecord.timeline ?? "Timeline not provided");

  return {
    one_paragraph_summary: `${mainIssue}. Symptoms noted: ${symptoms}. ${documentCount} documents were uploaded for review. Information should be confirmed against the source records before any clinical conclusion is made.`,
    timeline,
    current_medications: medications,
    key_findings: [
      `Primary concern: ${mainIssue}`,
      `Uploaded documents: ${documentCount}`,
      "Family is seeking a physician-reviewed written explanation.",
    ],
    missing_information: [
      "Complete source records and formal diagnoses may still need verification.",
      "Medication reconciliation should be confirmed against the latest discharge or clinic note.",
    ],
    red_flags: [
      "If symptoms are worsening quickly, seek urgent local medical evaluation.",
      "Any severe breathing issues, chest pain, confusion, or sudden deterioration need urgent attention.",
    ],
    suggested_questions_for_physician: [
      "What is still uncertain from the records provided?",
      "What questions should the family ask the local treating team next?",
      "Which warning signs should prompt urgent in-person care?",
    ],
    urgency_score_1_to_5: 3,
    urgency_rationale: "Default moderate urgency placeholder used because no AI provider key is configured.",
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    await getAuthedUser(request);
    const { case_id } = await request.json();

    if (!case_id) {
      return Response.json(
        { error: "case_id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const admin = createAdminClient();
    const [{ data: caseRecord, error: caseError }, { data: documents, error: docsError }] =
      await Promise.all([
        admin.from("cases").select("*").eq("id", case_id).single(),
        admin.from("case_documents").select("*").eq("case_id", case_id),
      ]);

    if (caseError || !caseRecord) {
      return Response.json(
        { error: "Case not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    if (docsError) {
      throw docsError;
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const prompt = buildPrompt(caseRecord, documents ?? []);

    let summary: SummaryShape = fallbackSummary(caseRecord, documents?.length ?? 0);
    let modelName = "placeholder-deterministic";

    if (openAiKey) {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          input: prompt,
          text: {
            format: {
              type: "json_schema",
              name: "case_summary",
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  one_paragraph_summary: { type: "string" },
                  timeline: { type: "string" },
                  current_medications: { type: "string" },
                  key_findings: { type: "array", items: { type: "string" } },
                  missing_information: { type: "array", items: { type: "string" } },
                  red_flags: { type: "array", items: { type: "string" } },
                  suggested_questions_for_physician: {
                    type: "array",
                    items: { type: "string" },
                  },
                  urgency_score_1_to_5: { type: "number" },
                  urgency_rationale: { type: "string" },
                },
                required: [
                  "one_paragraph_summary",
                  "timeline",
                  "current_medications",
                  "key_findings",
                  "missing_information",
                  "red_flags",
                  "suggested_questions_for_physician",
                  "urgency_score_1_to_5",
                  "urgency_rationale",
                ],
              },
            },
          },
        }),
      });

      if (response.ok) {
        const payload = await response.json();
        const parsed = payload.output?.[0]?.content?.[0]?.text;
        if (parsed) {
          summary = JSON.parse(parsed) as SummaryShape;
          modelName = "gpt-5-mini";
        }
      }
    }

    await admin.from("case_ai_summaries").insert({
      case_id,
      summary: summary.one_paragraph_summary,
      key_findings: summary.key_findings,
      risk_flags: summary.red_flags,
      suggested_questions: summary.suggested_questions_for_physician,
      triage_rationale: `${summary.urgency_rationale}\n\nMissing information:\n${summary.missing_information.join("\n")}`,
      model_name: modelName,
    });

    await admin
      .from("cases")
      .update({
        status: "physician_review",
        urgency_score: summary.urgency_score_1_to_5,
        urgency_label:
          summary.urgency_score_1_to_5 >= 4
            ? "High"
            : summary.urgency_score_1_to_5 >= 3
              ? "Moderate"
              : "Low",
      })
      .eq("id", case_id);

    return Response.json(
      { ok: true, model_name: modelName },
      { headers: corsHeaders },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500, headers: corsHeaders },
    );
  }
});
