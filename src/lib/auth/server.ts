import "server-only";

import { cookies } from "next/headers";
import { repositories } from "@/repositories/memory";
import { getMemoryDb } from "@/lib/data/memory-store";
import type { User } from "@/types/domain";
import {
  DEMO_PASSWORD_ADMIN,
  DEMO_PASSWORD_MEMBER,
  ensureSeeded,
} from "@/data/seed";
import {
  SESSION_COOKIE,
  decodeSession,
  sessionFromUser,
  userDisplayName,
  type SessionPayload,
} from "./session";

export async function getServerSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  return decodeSession(raw);
}

export async function authenticatePassword(
  email: string,
  password: string,
): Promise<User | null> {
  ensureSeeded();
  const user = await repositories.users.findByEmail(email);
  if (!user) return null;

  const normalized = email.trim().toLowerCase();
  if (normalized === "member@nativesociety.nyc") {
    return password === DEMO_PASSWORD_MEMBER ? user : null;
  }
  if (normalized === "admin@nativesociety.nyc") {
    return password === DEMO_PASSWORD_ADMIN ? user : null;
  }

  if (user.passwordHash && user.passwordHash === password) return user;
  return null;
}

export async function registerMember(input: {
  email: string;
  password: string;
  applicationId?: string | null;
}): Promise<User> {
  ensureSeeded();
  const existing = await repositories.users.findByEmail(input.email);
  if (existing) throw new Error("EMAIL_TAKEN");

  return repositories.users.create({
    email: input.email.trim().toLowerCase(),
    passwordHash: input.password,
    role: "member",
    approvedAt: null,
    active: true,
    applicationId: input.applicationId ?? null,
  });
}

export async function createMagicLink(email: string): Promise<string> {
  ensureSeeded();
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64url");
  const db = getMemoryDb();
  db.magicLinks.push({
    token,
    email: email.trim().toLowerCase(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  });
  return token;
}

export async function consumeMagicLink(token: string): Promise<User | null> {
  ensureSeeded();
  const db = getMemoryDb();
  const link = db.magicLinks.find((m) => m.token === token);
  if (!link) return null;
  if (new Date(link.expiresAt).getTime() < Date.now()) return null;

  let user = await repositories.users.findByEmail(link.email);
  if (!user) {
    user = await repositories.users.create({
      email: link.email,
      passwordHash: null,
      role: "member",
      approvedAt: null,
      active: true,
      applicationId: null,
    });
  }
  db.magicLinks = db.magicLinks.filter((m) => m.token !== token);
  return user;
}

export function buildSessionCookie(user: User) {
  return sessionFromUser(user, userDisplayName(user.id, user.email));
}