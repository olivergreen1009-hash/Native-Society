"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Unable to sign up.");
      return;
    }
    router.push("/onboarding/profile");
    router.refresh();
  };

  return (
    <>
      <SiteHeader variant="public" />
      <main className="mx-auto max-w-md px-5 pb-20 pt-28">
        <h1 className="font-heading text-center text-3xl">Create account</h1>
        <p className="mt-3 text-center text-sm text-ns-muted">
          For approved applicants. Your email should match your application.
        </p>
        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Field label="Email" name="email" type="email" />
          <Field label="Password" name="password" type="password" />
          <button
            type="submit"
            className="w-full rounded-full bg-ns-gold py-3 text-sm uppercase tracking-widest text-ns-bg"
          >
            Continue
          </button>
        </form>
        <p className="mt-8 text-center text-sm">
          <Link href="/login" className="text-ns-gold hover:underline">
            Already have an account? Sign in
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
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
        minLength={type === "password" ? 8 : undefined}
        className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
      />
    </p>
  );
}