"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { setClientSession } from "@/lib/auth/client";
import { accountToSession, authenticate } from "@/lib/auth";
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/discover";
  const magicToken = searchParams.get("magic");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [error, setError] = useState("");
  const [magicInfo, setMagicInfo] = useState("");
  const [magicHref, setMagicHref] = useState("");

  useEffect(() => {
    if (!magicToken) return;
    void (async () => {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "consume", token: magicToken }),
      });
      if (res.ok) {
        router.push(next);
        router.refresh();
      } else {
        setError("This sign-in link has expired.");
      }
    })();
  }, [magicToken, next, router]);

  const onPassword = (e: FormEvent<HTMLFormElement>) => {
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
    const session = accountToSession(account);
    setClientSession(session);
    void fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    router.push(account.role === "admin" ? "/admin" : next);
    router.refresh();
  };

  const onMagic = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMagicInfo("");
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, mode: "request" }),
    });
    const json = (await res.json()) as { demoUrl?: string; message?: string };
    if (!res.ok) {
      setError("Unable to send sign-in link. Try again or use your password.");
      return;
    }
    setMagicHref(json.demoUrl ?? "");
    setMagicInfo(
      json.demoUrl
        ? "Your sign-in link is ready."
        : (json.message ??
            "If this email is on file, you'll receive a sign-in link shortly."),
    );
  };

  return (
    <div className="mx-auto w-full max-w-md px-5">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-ns-gold">
        Members
      </p>
      <h1 className="font-heading mt-4 text-center text-3xl">Sign in</h1>
      <div className="mt-8 flex rounded-full border border-ns-border p-1 text-xs uppercase tracking-widest">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-full py-2 ${mode === "password" ? "bg-ns-gold text-ns-bg" : "text-ns-muted"}`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`flex-1 rounded-full py-2 ${mode === "magic" ? "bg-ns-gold text-ns-bg" : "text-ns-muted"}`}
        >
          Magic link
        </button>
      </div>

      {mode === "password" ? (
        <form onSubmit={onPassword} className="mt-8 space-y-5">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Field label="Email" name="email" type="email" />
          <Field label="Password" name="password" type="password" />
          <button
            type="submit"
            className="w-full rounded-full bg-ns-gold py-3 text-sm uppercase tracking-widest text-ns-bg"
          >
            Enter
          </button>
        </form>
      ) : (
        <form onSubmit={onMagic} className="mt-8 space-y-5">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {magicInfo && (
            <div className="rounded border border-ns-gold/30 bg-ns-surface p-4 text-xs text-ns-cream">
              <p>{magicInfo}</p>
              {magicHref ? (
                <Link href={magicHref} className="mt-2 inline-block text-ns-gold hover:underline">
                  Continue to sign in
                </Link>
              ) : null}
            </div>
          )}
          <Field label="Email" name="email" type="email" />
          <button
            type="submit"
            className="w-full rounded-full bg-ns-gold py-3 text-sm uppercase tracking-widest text-ns-bg"
          >
            Send link
          </button>
        </form>
      )}

      <p className="mt-10 text-center text-sm text-ns-muted">
        Use the email and password from your approval email.
      </p>
      <p className="mt-4 text-center text-sm text-ns-muted">
        No account?{" "}
        <Link href="/signup" className="text-ns-gold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <p>
      <label className="text-xs uppercase tracking-widest text-ns-muted">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required
        className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
      />
    </p>
  );
}

export default function LoginPage() {
  return (
    <>
      <SiteHeader variant="public" />
      <main className="min-h-screen pb-16 pt-28">
        <Suspense fallback={<p className="text-center text-ns-muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}