import { corsHeaders } from "../_shared/cors.ts";
import { getAuthedUser } from "../_shared/auth.ts";
import { createAdminClient } from "../_shared/supabase.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getAuthedUser(request);
    const { case_id } = await request.json();

    if (!case_id) {
      return Response.json(
        { error: "case_id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const admin = createAdminClient();
    const { data: caseRecord, error: caseError } = await admin
      .from("cases")
      .select("id, user_id, status")
      .eq("id", case_id)
      .single();

    if (caseError || !caseRecord) {
      return Response.json(
        { error: "Case not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    if (caseRecord.user_id !== user.id) {
      return Response.json(
        { error: "Forbidden" },
        { status: 403, headers: corsHeaders },
      );
    }

    const { error: updateError } = await admin
      .from("cases")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", case_id);

    if (updateError) {
      throw updateError;
    }

    const functionUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-case-summary`;
    const authHeader = request.headers.get("Authorization") ?? "";

    const summaryResponse = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ case_id }),
    });

    return Response.json(
      {
        ok: true,
        queued_summary: summaryResponse.ok,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500, headers: corsHeaders },
    );
  }
});
