"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";
import { getFoundingQuestionnaire } from "@/lib/client-store";
import {
  currentWeekLabel,
  weeklyGalleryProfileIds,
} from "@/lib/member-gallery-profiles";

export default function MemberDashboardPage() {
  const [name, setName] = useState("Member");
  const [questionnaireDone, setQuestionnaireDone] = useState(false);

  useEffect(() => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
    const session = match
      ? decodeSession(decodeURIComponent(match.split("=")[1] ?? ""))
      : null;
    if (session?.name) setName(session.name.split(" ")[0] ?? session.name);
    const memberId = session?.userId ?? "user-olivia";
    const q = getFoundingQuestionnaire(memberId);
    setQuestionnaireDone(Boolean(q.submittedAt));
  }, []);

  const batchSize = weeklyGalleryProfileIds().length;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.35em] text-ns-gold">Member</p>
      <h1 className="font-heading mt-3 text-4xl text-ns-cream md:text-5xl">
        You&apos;re in, {name}.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ns-muted">
        Your membership is active. Review this week&apos;s introductions, keep your
        profile current, and express interest only when the fit feels right—no public
        browsing, no unsolicited messages.
      </p>

      <div className="mt-10 rounded border border-ns-gold/40 bg-ns-surface p-6 md:p-8">
        <p className="text-xs uppercase tracking-widest text-ns-gold">Next steps</p>
        <ol className="mt-4 space-y-4 text-sm text-ns-cream">
          <Step
            done={false}
            title="Review this week's batch"
            body={`${batchSize} sample profiles · week of ${currentWeekLabel()}`}
            href="/member/gallery"
            cta="Open gallery"
          />
          <Step
            done={false}
            title="Finish your member profile"
            body="Photo, bio, and match preferences stay private until mutual interest."
            href="/member/profile"
            cta="Edit profile"
          />
          <Step
            done={questionnaireDone}
            title="Complete compatibility questions"
            body="Optional depth for sharper matching—five minutes."
            href="/member/questionnaire"
            cta={questionnaireDone ? "View answers" : "Start questionnaire"}
          />
        </ol>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="This week" value={String(batchSize)} hint="Introductions" />
        <StatCard label="Status" value="Active" hint="Approved member" />
        <StatCard
          label="Questionnaire"
          value={questionnaireDone ? "Done" : "Pending"}
          hint="Optional"
        />
      </div>
    </div>
  );
}

function Step({
  done,
  title,
  body,
  href,
  cta,
}: {
  done: boolean;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <li className="flex flex-col gap-3 border-t border-ns-border pt-4 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-heading text-ns-cream">
          {done ? "✓ " : ""}
          {title}
        </p>
        <p className="mt-1 text-ns-muted">{body}</p>
      </div>
      <Link
        href={href}
        className="shrink-0 rounded-full border border-ns-gold px-4 py-2 text-center text-xs uppercase tracking-widest text-ns-gold transition hover:bg-ns-gold hover:text-ns-bg"
      >
        {cta}
      </Link>
    </li>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded border border-ns-border bg-ns-surface p-5">
      <p className="text-xs uppercase tracking-widest text-ns-muted">{label}</p>
      <p className="font-heading mt-2 text-2xl text-ns-gold">{value}</p>
      <p className="mt-1 text-xs text-ns-muted">{hint}</p>
    </div>
  );
}