export interface CoachAuthSession {
  coachId: string;
  displayName: string;
  email?: string;
  mode: "local" | "supabase";
}

const AUTH_KEY = "pkp-coach-auth";

export function readCoachAuthSession(): CoachAuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as CoachAuthSession) : null;
  } catch {
    return null;
  }
}

export function writeCoachAuthSession(session: CoachAuthSession | null) {
  if (typeof window === "undefined") return;

  if (session) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getCoachDisplayName(): string {
  return readCoachAuthSession()?.displayName ?? "Coach Moody";
}
