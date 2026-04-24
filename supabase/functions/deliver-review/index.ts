import { corsHeaders } from "../_shared/cors.ts";
import { getAuthedUser } from "../_shared/auth.ts";
import { createAdminClient } from "../_shared/supabase.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getAuthedUser(request);
    const {
      case_id,
      case_summary,
      key_concerns,
      recommendations,
      questions_for_local_doctor,
      red_flags,
      limitations,
      final_opinion,
    } = await request.json();

    if (!case_id) {
      return Response.json(
        { error: "case_id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["physician", "admin"].includes(profile.role)) {
      return Response.json(
        { error: "Forbidden" },
        { status: 403, headers: corsHeaders },
      );
    }

    const now = new Date().toISOString();

    await admin.from("physician_reviews").upsert(
      {
        case_id,
        physician_id: user.id,
        case_summary,
        key_concerns,
        recommendations,
        questions_for_local_doctor,
        red_flags,
        limitations,
        final_opinion,
        status: "delivered",
        delivered_at: now,
        updated_at: now,
      },
      { onConflict: "case_id" },
    );

    await admin
      .from("cases")
      .update({
        status: "delivered",
        updated_at: now,
      })
      .eq("id", case_id);

    return Response.json(
      {
        ok: true,
        email_notification: "placeholder-not-implemented",
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
