import { ensureSeeded, DEMO_PASSWORD_ADMIN, DEMO_PASSWORD_MEMBER } from "@/data/seed";
import { getMemoryDb } from "@/lib/data/memory-store";
import { canSignIn } from "@/lib/membership/visibility";
import type { User } from "@/types/domain";
import {
  sessionFromUser,
  userDisplayName,
  type SessionPayload,
} from "@/lib/auth/session";

export {
  SESSION_COOKIE,
  decodeSession,
  encodeSession,
  sessionFromUser,
  userDisplayName,
} from "@/lib/auth/session";

export type { SessionPayload };

/** Synchronous demo auth for client login form. */
export function authenticate(email: string, password: string): User | null {
  ensureSeeded();
  const normalized = email.trim().toLowerCase();
  const db = getMemoryDb();
  const userId = db.usersByEmail.get(normalized);
  if (!userId) return null;
  const user = db.users.get(userId);
  if (!user) return null;

  if (normalized === "member@nativesociety.nyc") {
    return password === DEMO_PASSWORD_MEMBER && canSignIn(user) ? user : null;
  }
  if (normalized === "admin@nativesociety.nyc") {
    return password === DEMO_PASSWORD_ADMIN && canSignIn(user) ? user : null;
  }
  if (user.passwordHash && user.passwordHash === password) {
    return canSignIn(user) ? user : null;
  }
  return null;
}

export function accountToSession(user: User): SessionPayload {
  return sessionFromUser(user, userDisplayName(user.id, user.email));
}