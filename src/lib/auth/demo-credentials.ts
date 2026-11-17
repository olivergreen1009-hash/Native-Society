import type { SessionPayload } from "./session";

/** Demo logins for local / staging — not for production without gating. */
export const DEMO_MEMBER_EMAIL = "member@nativesociety.nyc";
export const DEMO_MEMBER_PASSWORD = "member2024";
export const DEMO_ADMIN_EMAIL = "admin@nativesociety.nyc";
export const DEMO_ADMIN_PASSWORD = "admin2024";

export function demoSessionFromCredentials(
  email: string,
  password: string,
): SessionPayload | null {
  const normalized = email.trim().toLowerCase();
  if (
    normalized === DEMO_MEMBER_EMAIL &&
    password === DEMO_MEMBER_PASSWORD
  ) {
    return {
      userId: "user-olivia",
      role: "member",
      email: normalized,
      name: "Olivia Mercer",
    };
  }
  if (
    normalized === DEMO_ADMIN_EMAIL &&
    password === DEMO_ADMIN_PASSWORD
  ) {
    return {
      userId: "user-oliver",
      role: "admin",
      email: normalized,
      name: "Oliver Estreich",
    };
  }
  return null;
}