"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import {
  SESSION_COOKIE,
  accountToSession,
  authenticate,
  encodeSession,
} from "@/lib/auth";
import {
  DEMO_ADMIN,
  DEMO_MEMBER,
  DEMO_PASSWORD_ADMIN,
  DEMO_PASSWORD_MEMBER,
} from "@/lib/sample-data";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/member/dashboard";
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const account = authenticate(email, password);
    if (!account) {
      setError("Those credentials are not recognized.");
      return;
    }
    const session = encodeSession(accountToSession(account));
    document.cookie = `${SESSION_COOKIE}=${session}; path=/; max-age=604800; SameSite=Lax`;
    if (account.role === "admin" && next.startsWith("/member")) {
      router.push("/admin");
    } else {
      router.push(next);
    }
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-md px-5">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-ns-gold">
        Members only
      </p>
      <h1 className="font-heading mt-4 text-center text-3xl text-ns-cream">
        Sign in
      </h1>
      <p className="mt-3 text-center text-sm text-ns-muted">
        Demo access for curators and members evaluating the experience.
      </p>
      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <p>
          <label className="text-xs uppercase tracking-widest text-ns-muted">Email</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
          />
        </p>
        <p>
          <label className="text-xs uppercase tracking-widest text-ns-muted">Password</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
          />
        </p>
        <button
          type="submit"
          className="w-full rounded-full bg-ns-gold py-3 text-sm font-medium uppercase tracking-widest text-ns-bg hover:bg-ns-cream"
        >
          Enter
        </button>
      </form>
      <div className="mt-10 rounded border border-ns-border bg-ns-surface p-5 text-xs leading-relaxed text-ns-muted">
        <p className="text-ns-cream">Demo credentials</p>
        <p className="mt-2">
          Member: {DEMO_MEMBER.email} / {DEMO_PASSWORD_MEMBER}
        </p>
        <p>
          Admin: {DEMO_ADMIN.email} / {DEMO_PASSWORD_ADMIN}
        </p>
      </div>
      <p className="mt-8 text-center text-sm">
        <Link href="/" className="text-ns-gold hover:underline">
          ← Return to public site
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={<header className="fixed top-0 z-50 h-16 w-full border-b border-ns-border bg-[#0c0c0c]/85" />}>
        <SiteHeader variant="public" />
      </Suspense>
      <main className="flex min-h-screen flex-col justify-center pb-20 pt-28">
        <Suspense fallback={<p className="text-center text-ns-muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
