export function isSupabaseClientConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Server-side: requires service role key for database actions. */
export function isSupabaseConfigured(): boolean {
  return Boolean(isSupabaseClientConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
