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

  return (
    <header className="fixed top-0 z-50 w-full border-b border-ns-border bg-ns-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="font-heading text-xl tracking-[0.12em] text-ns-cream md:text-2xl"
        >
          Native Society
        </Link>
        <nav className="flex items-center gap-3 text-sm text-ns-muted md:gap-6">
          {variant === "public" ? (
            <>
              <Link href="/login" className="hidden min-h-11 items-center hover:text-ns-cream sm:inline-flex">
                Sign in
              </Link>
              <Link
                href="/apply"
                className="inline-flex min-h-11 items-center rounded-full border border-ns-gold/60 px-4 text-xs uppercase tracking-widest text-ns-gold transition hover:bg-ns-gold hover:text-ns-bg"
              >
                Apply
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/discover"
                className={
                  pathname.startsWith("/discover")
                    ? "text-ns-gold"
                    : "hover:text-ns-cream"
                }
              >
                Discover
              </Link>
              <Link
                href="/matches"
                className={
                  pathname.startsWith("/matches")
                    ? "text-ns-gold"
                    : "hover:text-ns-cream"
                }
              >
                Matches
              </Link>
              <Link
                href="/profile"
                className={
                  pathname === "/profile" ? "text-ns-gold" : "hover:text-ns-cream"
                }
              >
                Profile
              </Link>
              <Link
                href="/account"
                className={
                  pathname.startsWith("/account")
                    ? "text-ns-gold"
                    : "hover:text-ns-cream"
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