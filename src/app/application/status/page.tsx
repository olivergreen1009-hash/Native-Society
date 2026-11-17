import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { repositories } from "@/repositories/memory";
import type { ApplicationStatus } from "@/types/domain";
import { ensureSeeded } from "@/data/seed";

const demoCopy: Record<
  ApplicationStatus,
  { title: string; body: string }
> = {
  pending: {
    title: "Under review",
    body: "Your application is with our admissions team. We typically respond within two weeks.",
  },
  more_info_needed: {
    title: "More information requested",
    body: "We need a bit more context before we can proceed. Watch your inbox for a private note from admissions.",
  },
  approved: {
    title: "Approved",
    body: "Welcome. Create your account to complete onboarding and join the weekly introduction cycle.",
  },
  declined: {
    title: "Not proceeding at this time",
    body: "We’re unable to extend membership right now. This decision is final for this cycle, and we appreciate your interest.",
  },
};

type SearchParams = Promise<{ id?: string; demo?: ApplicationStatus }>;

export default async function ApplicationStatusPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  ensureSeeded();
  const params = await searchParams;

  let status: ApplicationStatus = "pending";
  let applicationId = params.id ?? "demo";

  if (params.demo && params.demo in demoCopy) {
    status = params.demo;
  } else if (params.id) {
    const app = await repositories.applications.findById(params.id);
    if (app) status = app.status;
  }

  const copy = demoCopy[status];

  return (
    <>
      <SiteHeader variant="public" />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-28 text-center md:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Application</p>
        <h1 className="font-heading mt-4 text-4xl">{copy.title}</h1>
        <p className="mt-6 text-sm leading-relaxed text-ns-muted">{copy.body}</p>
        <p className="mt-4 text-xs text-ns-muted">Reference: {applicationId}</p>
        <div className="mt-10 flex flex-col items-center gap-3">
          {status === "approved" && (
            <Link
              href="/signup"
              className="rounded-full bg-ns-gold px-8 py-3 text-sm uppercase tracking-widest text-ns-bg"
            >
              Create account
            </Link>
          )}
          <p className="text-xs text-ns-muted">
            Demo states:{" "}
            <Link href="?demo=pending" className="text-ns-gold">
              pending
            </Link>
            {" · "}
            <Link href="?demo=more_info_needed" className="text-ns-gold">
              more info
            </Link>
            {" · "}
            <Link href="?demo=approved" className="text-ns-gold">
              approved
            </Link>
            {" · "}
            <Link href="?demo=declined" className="text-ns-gold">
              declined
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}