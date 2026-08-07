import { createClient } from "@supabase/supabase-js";
import { getSupabaseProjectUrl, isSupabaseConfigured } from "./env";

export function createServiceClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Add credentials to .env.local");
  }

  const url = getSupabaseProjectUrl();
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be your https://xxxx.supabase.co project URL."
    );
  }

  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
}
