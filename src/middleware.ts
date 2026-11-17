import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, decodeSession } from "./lib/auth/session";

const protectedPrefixes = [
  "/discover",
  "/matches",
  "/profile",
  "/onboarding",
  "/account",
  "/admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = sessionCookie ? decodeSession(sessionCookie) : null;

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected) {
    if (!session) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    if (pathname.startsWith("/admin") && session.role !== "admin") {
      return NextResponse.redirect(new URL("/discover", request.url));
    }
  }

  if ((pathname === "/login" || pathname === "/signup") && session) {
    const dest = session.role === "admin" ? "/admin" : "/discover";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (pathname.startsWith("/member")) {
    const map: Record<string, string> = {
      "/member/dashboard": "/discover",
      "/member/gallery": "/discover",
      "/member/profile": "/profile",
      "/member/introductions": "/matches",
    };
    const dest = map[pathname];
    if (dest) {
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/discover/:path*",
    "/matches/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/member/:path*",
  ],
};