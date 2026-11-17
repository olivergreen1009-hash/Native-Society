import { NextResponse } from "next/server";
import { SESSION_COOKIE, encodeSession } from "@/lib/auth/session";
import {
  buildSessionCookie,
  consumeMagicLink,
  createMagicLink,
} from "@/lib/auth/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    token?: string;
    mode?: "request" | "consume";
  };

  if (body.mode === "consume" && body.token) {
    const user = await consumeMagicLink(body.token);
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
    }
    const session = encodeSession(buildSessionCookie(user));
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  const token = await createMagicLink(body.email ?? "");
  const demoUrl = `/login?magic=${encodeURIComponent(token)}`;
  return NextResponse.json({
    ok: true,
    message: "Magic link created (demo)",
    demoUrl,
    token,
  });
}