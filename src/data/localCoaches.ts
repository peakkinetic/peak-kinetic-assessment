export interface LocalCoachAccount {
  id: string;
  username: string;
  password: string;
  displayName: string;
}

/** Demo coach logins used when Supabase is not configured. */
export const localCoachAccounts: LocalCoachAccount[] = [
  {
    id: "coach-moody",
    username: "moody",
    password: "pkp2026",
    displayName: "Coach Moody",
  },
  {
    id: "coach-suttle",
    username: "suttle",
    password: "pkp2026",
    displayName: "Coach Suttle",
  },
  {
    id: "coach-gannon",
    username: "gannon",
    password: "pkp2026",
    displayName: "Coach Gannon",
  },
  {
    id: "coach-john",
    username: "john",
    password: "pkp2026",
    displayName: "Coach John",
  },
  {
    id: "coach-cole",
    username: "cole",
    password: "pkp2026",
    displayName: "Coach Cole",
  },
];

export function findLocalCoachAccount(username: string, password: string) {
  const normalizedUsername = username.trim().toLowerCase();

  return localCoachAccounts.find(
    (coach) =>
      coach.username.toLowerCase() === normalizedUsername && coach.password === password
  );
}
