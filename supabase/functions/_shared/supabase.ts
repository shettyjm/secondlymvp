import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

export function createAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment configuration.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getBearerToken(request: Request) {
  const authHeader = request.headers.get("Authorization");
  return authHeader?.replace("Bearer ", "") ?? "";
}
