import type { User, UserRole } from "@/types/domain";

export const SESSION_COOKIE = "ns-session";

export type SessionPayload = {
  userId: string;
  role: UserRole;
  email: string;
  name: string;
};

export function encodeSession(session: SessionPayload): string {
  return Buffer.from(JSON.stringify(session), "utf-8").toString("base64url");
}

export function decodeSession(value: string): SessionPayload | null {
  try {
    const json = Buffer.from(value, "base64url").toString("utf-8");
    const parsed = JSON.parse(json) as SessionPayload;
    if (!parsed.userId || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function userDisplayName(userId: string, fallbackEmail: string): string {
  if (userId === "user-olivia") return "Olivia Mercer";
  if (userId === "user-oliver") return "Oliver Estreich";
  const first = fallbackEmail.split("@")[0] ?? "Member";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export function sessionFromUser(user: User, name?: string): SessionPayload {
  return {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: name ?? userDisplayName(user.id, user.email),
  };
}