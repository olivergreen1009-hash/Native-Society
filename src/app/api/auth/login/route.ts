import { NextResponse } from "next/server";
import { SESSION_COOKIE, encodeSession } from "@/lib/auth/session";
import {
  authenticatePassword,
  buildSessionCookie,
} from "@/lib/auth/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const user = await authenticatePassword(
    body.email ?? "",
    body.password ?? "",
  );
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const session = encodeSession(buildSessionCookie(user));
  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}