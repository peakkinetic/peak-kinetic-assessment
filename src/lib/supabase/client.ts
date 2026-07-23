import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseClientConfigured } from "@/lib/supabase/env";

export function createBrowserSupabaseClient() {
  if (!isSupabaseClientConfigured()) {
    return null;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
