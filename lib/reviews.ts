import { createClient } from "@/lib/supabase/server";

export async function getCaseReview(caseId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("physician_reviews")
    .select("*")
    .eq("case_id", caseId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function deliverReview(input: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.functions.invoke("deliver-review", {
    body: input,
  });

  if (error) {
    throw error;
  }
}
