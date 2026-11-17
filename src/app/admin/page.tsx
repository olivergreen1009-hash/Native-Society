import Link from "next/link";
import { getServerSession } from "@/lib/auth/server";
import { SiteHeader } from "@/components/site-header";

export default async function AdminPage() {
  const session = await getServerSession();

  return (
    <>
      <SiteHeader variant="member" />
      <main className="mx-auto max-w-4xl px-5 pb-20 pt-28 md:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Internal</p>
        <h1 className="font-heading mt-3 text-4xl">Administration</h1>
        <p className="mt-4 text-sm text-ns-muted">
          Phase 1 shell for admissions review, reports, and member support. Signed in as{" "}
          {session?.email ?? "unknown"}.
        </p>
        <div className="mt-10 rounded border border-ns-border bg-ns-surface p-8">
          <ul className="space-y-3 text-sm text-ns-muted">
            <li>Application queue (coming soon)</li>
            <li>Member discovery flags (coming soon)</li>
            <li>Reports & blocks inbox (coming soon)</li>
          </ul>
          <p className="mt-8 text-xs text-ns-muted">
            Legacy email templates remain at{" "}
            <Link href="/admin/emails" className="text-ns-gold hover:underline">
              /admin/emails
            </Link>{" "}
            from the earlier prototype.
          </p>
        </div>
      </main>
    </>
  );
}