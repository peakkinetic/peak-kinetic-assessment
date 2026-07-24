export function isSupabaseClientConfigured(): boolean {
  return Boolean(getSupabaseProjectUrl() && getSupabaseAnonKey());
}

/** Server-side: requires service role key for database actions. */
export function isSupabaseConfigured(): boolean {
  return Boolean(isSupabaseClientConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseProjectUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;

  if (!raw.includes(".supabase.co")) {
    return null;
  }

  return raw.replace(/\/+$/, "");
}

export function getSupabaseAnonKey(): string | null {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return key || null;
}
