import type { User, UserRole } from "@/types/domain";

export const SESSION_COOKIE = "ns-session";

export type SessionPayload = {
  userId: string;
  role: UserRole;
  email: string;
  name: string;
};

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const base64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded =
    value + "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary =
    typeof atob !== "undefined"
      ? atob(base64)
      : Buffer.from(base64, "base64").toString("binary");
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

export function encodeSession(session: SessionPayload): string {
  const json = JSON.stringify(session);
  return bytesToBase64Url(new TextEncoder().encode(json));
}

export function decodeSession(value: string): SessionPayload | null {
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(value));
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