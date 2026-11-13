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

  return (
    <header className="fixed top-0 z-50 w-full border-b border-ns-border bg-[#0c0c0c]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="font-heading text-xl tracking-[0.12em] text-ns-cream md:text-2xl">
          Native Society
        </Link>
        <nav className="flex items-center gap-4 text-sm text-ns-muted md:gap-8">
          {variant === "public" ? (
            <>
              <a href="#concept" className="hidden hover:text-ns-cream sm:inline">
                Concept
              </a>
              <a href="#gallery" className="hidden hover:text-ns-cream sm:inline">
                Gallery
              </a>
              <a href="#membership" className="hidden hover:text-ns-cream md:inline">
                Membership
              </a>
              <a href="#inquiry" className="hidden hover:text-ns-cream md:inline">
                Inquiry
              </a>
            </>
          ) : (
            <>
              {session?.role === "admin" && (
                <>
                  <Link
                    href="/admin"
                    className={
                      pathname === "/admin" ? "text-ns-gold" : "hover:text-ns-cream"
                    }
                  >
                    Admin
                  </Link>
                  <Link
                    href="/admin/emails"
                    className={
                      pathname.startsWith("/admin/emails")
                        ? "text-ns-gold"
                        : "hover:text-ns-cream"
                    }
                  >
                    Emails
                  </Link>
                </>
              )}
              <Link
                href="/member/dashboard"
                className={pathname === "/member/dashboard" ? "text-ns-gold" : "hover:text-ns-cream"}
              >
                Dashboard
              </Link>
              <Link
                href="/member/gallery"
                className={pathname.startsWith("/member/gallery") ? "text-ns-gold" : "hover:text-ns-cream"}
              >
                Gallery
              </Link>
            </>
          )}
          {session ? (
            <button
              type="button"
              onClick={signOut}
              className="rounded-full border border-ns-border px-4 py-1.5 text-xs uppercase tracking-widest text-ns-cream transition hover:border-ns-gold hover:text-ns-gold"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-ns-gold/60 px-4 py-1.5 text-xs uppercase tracking-widest text-ns-gold transition hover:bg-ns-gold hover:text-ns-bg"
            >
              Member sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
