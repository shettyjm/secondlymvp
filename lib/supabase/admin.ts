import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";

export function createAdminClient() {
  const env = getEnv();

  if (!env.supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations.");
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
