import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, decodeSession } from "./lib/auth";

const memberPrefixes = ["/member"];
const adminPrefix = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = sessionCookie ? decodeSession(sessionCookie) : null;

  const isMemberRoute = memberPrefixes.some((p) => pathname.startsWith(p));
  const isAdminRoute = pathname.startsWith(adminPrefix);

  if (isMemberRoute || isAdminRoute) {
    if (!session) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    if (isAdminRoute && session.role !== "admin") {
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
    }
  }

  if (pathname === "/login" && session) {
    const dest =
      session.role === "admin" ? "/admin" : "/member/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/admin/:path*", "/login"],
};
