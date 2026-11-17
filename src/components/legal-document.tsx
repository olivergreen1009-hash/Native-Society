import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function LegalDocument({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader variant="public" />
      <main className="bg-ns-bg pt-24 pb-16">
        <article className="mx-auto max-w-2xl px-5 sm:px-8">
          <Link href="/" className="text-base text-ns-gold transition hover:text-ns-cream">
            ← Home
          </Link>
          <h1 className="font-heading mt-6 text-3xl text-ns-cream">{title}</h1>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-ns-muted">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}