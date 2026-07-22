"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { findLocalCoachAccount } from "@/data/localCoaches";
import {
  readCoachAuthSession,
  writeCoachAuthSession,
  type CoachAuthSession,
} from "@/lib/coachAuthSession";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

interface CoachAuthContextValue {
  coach: CoachAuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  usesSupabaseAuth: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const CoachAuthContext = createContext<CoachAuthContextValue | null>(null);

export function CoachAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [coach, setCoach] = useState<CoachAuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const usesSupabaseAuth = isSupabaseConfigured();

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const stored = readCoachAuthSession();

      if (!usesSupabaseAuth) {
        if (!cancelled) {
          setCoach(stored);
          setIsLoading(false);
        }
        return;
      }

      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        if (!cancelled) {
          setCoach(stored);
          setIsLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (user) {
        const session: CoachAuthSession = {
          coachId: user.id,
          displayName:
            (typeof user.user_metadata?.display_name === "string" &&
              user.user_metadata.display_name) ||
            user.email?.split("@")[0] ||
            "Coach",
          email: user.email,
          mode: "supabase",
        };
        writeCoachAuthSession(session);
        if (!cancelled) setCoach(session);
      } else if (stored?.mode === "supabase") {
        writeCoachAuthSession(null);
        if (!cancelled) setCoach(null);
      } else if (!cancelled) {
        setCoach(stored);
      }

      if (!cancelled) setIsLoading(false);
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [usesSupabaseAuth]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      const trimmedIdentifier = identifier.trim();
      if (!trimmedIdentifier || !password) {
        throw new Error("Enter your login and password.");
      }

      if (usesSupabaseAuth) {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
          throw new Error("Supabase auth is not available.");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedIdentifier,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        const user = data.user;
        if (!user) {
          throw new Error("Could not sign in.");
        }

        const session: CoachAuthSession = {
          coachId: user.id,
          displayName:
            (typeof user.user_metadata?.display_name === "string" &&
              user.user_metadata.display_name) ||
            user.email?.split("@")[0] ||
            "Coach",
          email: user.email,
          mode: "supabase",
        };

        writeCoachAuthSession(session);
        setCoach(session);
        return;
      }

      const account = findLocalCoachAccount(trimmedIdentifier, password);
      if (!account) {
        throw new Error("Invalid coach login or password.");
      }

      const session: CoachAuthSession = {
        coachId: account.id,
        displayName: account.displayName,
        mode: "local",
      };

      writeCoachAuthSession(session);
      setCoach(session);
    },
    [usesSupabaseAuth]
  );

  const logout = useCallback(async () => {
    if (usesSupabaseAuth) {
      const supabase = createBrowserSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }

    writeCoachAuthSession(null);
    setCoach(null);
    router.push("/login");
  }, [router, usesSupabaseAuth]);

  const value = useMemo(
    () => ({
      coach,
      isAuthenticated: Boolean(coach),
      isLoading,
      usesSupabaseAuth,
      login,
      logout,
    }),
    [coach, isLoading, usesSupabaseAuth, login, logout]
  );

  return <CoachAuthContext.Provider value={value}>{children}</CoachAuthContext.Provider>;
}

export function useCoachAuth() {
  const context = useContext(CoachAuthContext);
  if (!context) {
    throw new Error("useCoachAuth must be used within CoachAuthProvider");
  }
  return context;
}

export function athleteBelongsToCoach(athleteCoach: string, coach: CoachAuthSession | null) {
  if (!coach) return false;
  if (!athleteCoach.trim()) return true;
  return athleteCoach === coach.displayName || athleteCoach === coach.coachId;
}
