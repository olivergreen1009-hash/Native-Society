import {
  DEMO_ADMIN,
  DEMO_MEMBER,
  DEMO_PASSWORD_ADMIN,
  DEMO_PASSWORD_MEMBER,
} from "./sample-data";
import type { MemberAccount } from "./types";

export const SESSION_COOKIE = "ns-session";

export type SessionPayload = {
  userId: string;
  role: "member" | "admin";
  email: string;
  name: string;
};

export function authenticate(
  email: string,
  password: string,
): MemberAccount | null {
  const normalized = email.trim().toLowerCase();
  if (
    normalized === DEMO_MEMBER.email &&
    password === DEMO_PASSWORD_MEMBER
  ) {
    return DEMO_MEMBER;
  }
  if (normalized === DEMO_ADMIN.email && password === DEMO_PASSWORD_ADMIN) {
    return DEMO_ADMIN;
  }
  return null;
}

export function accountToSession(account: MemberAccount): SessionPayload {
  return {
    userId: account.id,
    role: account.role,
    email: account.email,
    name: account.name,
  };
}

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
