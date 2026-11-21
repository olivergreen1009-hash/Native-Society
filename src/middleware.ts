import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, decodeSession } from "./lib/auth/session";

const protectedPrefixes = [
  "/member",
  "/profile",
  "/onboarding",
  "/account",
  "/admin",
];

const datingRedirects: Record<string, string> = {
  "/discover": "/member/introductions",
  "/matches": "/member/introductions",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = sessionCookie ? decodeSession(sessionCookie) : null;

  for (const [from, to] of Object.entries(datingRedirects)) {
    if (pathname === from || pathname.startsWith(`${from}/`)) {
      return NextResponse.redirect(new URL(to, request.url));
    }
  }

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected) {
    if (!session) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    if (pathname.startsWith("/admin") && session.role !== "admin") {
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
    }
  }

  if ((pathname === "/login" || pathname === "/signup") && session) {
    const dest =
      session.role === "admin" ? "/admin/applications" : "/member/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/discover/:path*",
    "/matches/:path*",
    "/member/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};