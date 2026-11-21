import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { repositories } from "@/repositories/memory";
import type { ApplicationStatus } from "@/types/domain";
import { ensureSeeded } from "@/data/seed";

const demoCopy: Record<ApplicationStatus, { title: string; body: string }> = {
  applied: {
    title: "Applied",
    body: "We received your application. The founder reviews each submission personally. You will hear back privately—typically within two weeks. No payment is required at this stage.",
  },
  under_review: {
    title: "Under review",
    body: "Your application is in review. We may reach out if we need additional context before deciding whether Native Society can meaningfully serve your goals.",
  },
  more_info_needed: {
    title: "More information requested",
    body: "We need a bit more context before we can proceed. Watch your inbox for a private note from the founder.",
  },
  qualified_waiting: {
    title: "Qualified — waiting",
    body: "You are qualified for membership. We will invite you to activate when we can identify specific, plausible introduction opportunities relevant to your stated goals.",
  },
  invited_to_activate: {
    title: "Invited to activate",
    body: "You are invited to activate membership. Fees and service terms will be provided before you decide whether to proceed. Sign in or create your account to continue.",
  },
  declined: {
    title: "Not proceeding at this time",
    body: "We are unable to extend membership right now. This decision is final for this cycle. Thank you for your interest.",
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

  let status: ApplicationStatus = "applied";
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
        <h1 className="font-heading mt-4 text-4xl text-ns-cream">{copy.title}</h1>
        <p className="mt-6 text-sm leading-relaxed text-ns-muted">{copy.body}</p>
        <p className="mt-4 text-xs text-ns-muted">Reference: {applicationId}</p>
        <div className="mt-10 flex flex-col items-center gap-3">
          {status === "invited_to_activate" && (
            <Link
              href="/signup"
              className="rounded-full bg-ns-gold px-8 py-3 text-sm uppercase tracking-widest text-ns-bg"
            >
              Activate membership
            </Link>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}