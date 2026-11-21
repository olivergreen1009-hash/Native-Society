"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";
import { clearClientSession } from "@/lib/auth/client";

function readClientSession() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  return decodeSession(decodeURIComponent(match.split("=")[1] ?? ""));
}

export function SiteHeader({
  variant = "public",
}: {
  variant?: "public" | "member";
}) {
  const pathname = usePathname();
  const [session, setSession] = useState<ReturnType<typeof readClientSession>>(null);

  useEffect(() => {
    setSession(readClientSession());
  }, [pathname]);

  const signOut = () => {
    clearClientSession();
    window.location.href = "/";
  };

  const hideApplyCta =
    pathname === "/apply" || pathname.startsWith("/application/");

  return (
    <header className="fixed top-0 z-50 w-full border-b border-ns-border bg-ns-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5 md:h-14 md:px-8">
        <Link
          href="/"
          className="font-heading text-lg tracking-[0.1em] text-ns-cream md:text-xl"
        >
          Native Society
        </Link>
        <nav className="flex items-center gap-2 text-sm text-ns-muted md:gap-4">
          {variant === "public" ? (
            <>
              <Link
                href="/login"
                className="hidden items-center py-2 hover:text-ns-cream sm:inline-flex"
              >
                Sign in
              </Link>
              {!hideApplyCta && (
                <Link
                  href="/apply"
                  className="inline-flex items-center rounded-full border border-ns-gold/60 px-3 py-1.5 text-xs uppercase tracking-widest text-ns-gold transition hover:bg-ns-gold hover:text-ns-bg"
                >
                  Apply
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/member/dashboard"
                className={
                  pathname.startsWith("/member/dashboard")
                    ? "text-ns-gold"
                    : "hidden hover:text-ns-cream sm:inline"
                }
              >
                Home
              </Link>
              <Link
                href="/member/introductions"
                className={
                  pathname.startsWith("/member/introductions")
                    ? "text-ns-gold"
                    : "hover:text-ns-cream"
                }
              >
                Introductions
              </Link>
              <Link
                href="/member/profile"
                className={
                  pathname.startsWith("/member/profile")
                    ? "text-ns-gold"
                    : "hidden hover:text-ns-cream md:inline"
                }
              >
                Shareable profile
              </Link>
              <Link
                href="/account"
                className={
                  pathname.startsWith("/account")
                    ? "text-ns-gold"
                    : "hidden hover:text-ns-cream md:inline"
                }
              >
                Account
              </Link>
              {session?.role === "admin" && (
                <Link
                  href="/admin"
                  className={
                    pathname.startsWith("/admin")
                      ? "text-ns-gold"
                      : "hover:text-ns-cream"
                  }
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={signOut}
                className="min-h-11 rounded-full border border-ns-border px-3 text-xs uppercase tracking-widest text-ns-cream transition hover:border-ns-gold"
              >
                Sign out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}