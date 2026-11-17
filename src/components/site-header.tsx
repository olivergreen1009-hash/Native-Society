"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";

function readClientSession() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  return decodeSession(decodeURIComponent(match.split("=")[1] ?? ""));
}

export function SiteHeader({ variant = "public" }: { variant?: "public" | "app" }) {
  const pathname = usePathname();
  const [session, setSession] = useState<ReturnType<typeof readClientSession>>(null);

  useEffect(() => {
    setSession(readClientSession());
  }, [pathname]);

  const signOut = () => {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
    window.location.href = "/";
  };

  const navLink =
    "font-heading text-[1.05rem] text-ns-muted transition hover:text-white sm:text-[1.125rem]";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-ns-border bg-ns-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8">
        <Link
          href="/"
          className="font-heading text-xl tracking-[0.04em] text-ns-cream sm:text-[1.35rem]"
        >
          Native Society
        </Link>
        <nav className="flex items-center gap-4 sm:gap-7">
          {variant === "public" ? (
            <>
              <a href="#how-it-works" className={`hidden sm:inline ${navLink}`}>
                How it works
              </a>
              <a href="#examples" className={`hidden sm:inline ${navLink}`}>
                Examples
              </a>
              <a href="#apply" className="club-btn-apply px-4 py-2 text-sm sm:px-5 sm:text-base">
                Apply
              </a>
            </>
          ) : (
            <>
              {session?.role === "admin" && (
                <>
                  <Link
                    href="/admin"
                    className={
                      pathname === "/admin" ? "text-ns-gold" : navLink
                    }
                  >
                    Admin
                  </Link>
                  <Link
                    href="/admin/emails"
                    className={
                      pathname.startsWith("/admin/emails") ? "text-ns-gold" : navLink
                    }
                  >
                    Emails
                  </Link>
                </>
              )}
              <Link
                href="/member/dashboard"
                className={pathname === "/member/dashboard" ? "text-ns-gold" : navLink}
              >
                Dashboard
              </Link>
              <Link
                href="/member/gallery"
                className={pathname.startsWith("/member/gallery") ? "text-ns-gold" : navLink}
              >
                Gallery
              </Link>
            </>
          )}
          {session ? (
            <button
              type="button"
              onClick={signOut}
              className={`${navLink} hidden sm:inline`}
            >
              Sign out
            </button>
          ) : (
            <Link href="/login" className={`${navLink} hidden md:inline`}>
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}