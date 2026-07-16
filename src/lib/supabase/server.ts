import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./env";

export function createServiceClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Add credentials to .env.local");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
