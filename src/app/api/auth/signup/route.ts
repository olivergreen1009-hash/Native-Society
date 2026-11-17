import { NextResponse } from "next/server";
import { SESSION_COOKIE, encodeSession } from "@/lib/auth/session";
import {
  buildSessionCookie,
  registerMember,
} from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    applicationId?: string | null;
  };
  try {
    const email = (body.email ?? "").trim().toLowerCase();
    const application = body.applicationId
      ? await repositories.applications.findById(body.applicationId)
      : await repositories.applications.findByEmail(email);

    const user = await registerMember({
      email,
      password: body.password ?? "",
      applicationId: application?.id ?? body.applicationId ?? null,
    });

    if (application?.status === "approved") {
      await repositories.users.update(user.id, {
        approvedAt: new Date().toISOString(),
      });
    }

    const refreshed = (await repositories.users.findById(user.id)) ?? user;
    const session = encodeSession(buildSessionCookie(refreshed));
    const res = NextResponse.json({ ok: true, userId: refreshed.id });
    res.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }
}