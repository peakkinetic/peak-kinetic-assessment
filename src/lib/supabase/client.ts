import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseProjectUrl, isSupabaseClientConfigured } from "@/lib/supabase/env";

export function createBrowserSupabaseClient() {
  if (!isSupabaseClientConfigured()) {
    return null;
  }

  const url = getSupabaseProjectUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) {
    return null;
  }

  return createBrowserClient(url, anonKey);
}
