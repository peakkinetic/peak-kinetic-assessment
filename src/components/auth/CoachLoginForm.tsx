"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useCoachAuth } from "@/context/CoachAuthContext";
import { localCoachAccounts } from "@/data/localCoaches";

export function CoachLoginForm() {
  const router = useRouter();
  const { login, usesSupabaseAuth } = useCoachAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(identifier, password);
      router.replace("/coach");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setIsSubmitting(false);
    }
  }

  return (
    <Card accent className="mx-auto max-w-md">
      <CardHeader
        title="Coach Sign In"
        subtitle={
          usesSupabaseAuth
            ? "Sign in with your coach email and password"
            : "Sign in with your coach username and password"
        }
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-pkp-black">
            {usesSupabaseAuth ? "Email" : "Username"}
          </span>
          <input
            type={usesSupabaseAuth ? "email" : "text"}
            autoComplete="username"
            required
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
            placeholder={usesSupabaseAuth ? "coach@peakkinetic.com" : "moody"}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-pkp-black">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
            placeholder="Enter password"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-pkp-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
        >
          <LogIn className="h-4 w-4" />
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      {!usesSupabaseAuth && (
        <div className="mt-6 rounded-xl border border-pkp-gray-100 bg-pkp-gray-50/70 px-4 py-3 text-sm text-pkp-gray-600">
          <p className="font-semibold text-pkp-black">Demo coach logins</p>
          <ul className="mt-2 space-y-1">
            {localCoachAccounts.map((account) => (
              <li key={account.id}>
                <span className="font-medium">{account.displayName}</span> — username{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-xs">{account.username}</code>{" "}
                / password{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-xs">{account.password}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="mt-4 text-sm font-medium text-pkp-red">{error}</p>}
    </Card>
  );
}
