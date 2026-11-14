"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEMO_MEMBER } from "@/lib/sample-data";
import {
  getCurationMap,
  getIntroductions,
  getFoundingQuestionnaire,
} from "@/lib/client-store";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";

export default function MemberDashboardPage() {
  const [stats, setStats] = useState({
    galleryCount: 0,
    intros: 0,
    questionnaireDone: false,
  });

  useEffect(() => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
    const session = match
      ? decodeSession(decodeURIComponent(match.split("=")[1] ?? ""))
      : null;
    const memberId = session?.userId ?? DEMO_MEMBER.id;
    const curation = getCurationMap();
    const intros = getIntroductions().filter((i) => i.memberId === memberId);
    const q = getFoundingQuestionnaire(memberId);
    setStats({
      galleryCount: curation[memberId]?.length ?? 0,
      intros: intros.length,
      questionnaireDone: Boolean(q.submittedAt),
    });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Member home</p>
      <h1 className="font-heading mt-3 text-4xl text-ns-cream">Your dashboard</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ns-muted">
        Welcome back. Your curator has refreshed your gallery this week. Review
        compatibilities, complete your questionnaire, and request introductions
        at your own pace.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <StatCard label="Gallery profiles" value={String(stats.galleryCount)} />
        <StatCard label="Introduction requests" value={String(stats.intros)} />
        <StatCard
          label="Questionnaire"
          value={stats.questionnaireDone ? "Complete" : "Pending"}
        />
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <ActionCard
          title="Private Gallery"
          body="View the profiles curated for you this month."
          href="/member/gallery"
          cta="Open gallery"
        />
        <ActionCard
          title="Compatibility review"
          body="Tell curators how you live in New York so introductions stay precise."
          href="/member/questionnaire"
          cta="Continue questionnaire"
        />
        <ActionCard
          title="Your profile"
          body="Update how fellow members will understand your lineage and rhythm."
          href="/member/profile"
          cta="Edit profile"
        />
        <ActionCard
          title="Introductions"
          body="Track pending requests and curator follow-up."
          href="/member/introductions"
          cta="View requests"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded border border-ns-border bg-ns-surface p-6">
      <p className="text-xs uppercase tracking-widest text-ns-muted">{label}</p>
      <p className="font-heading mt-2 text-3xl text-ns-gold">{value}</p>
    </Card>
  );
}

function ActionCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <article className="flex flex-col rounded border border-ns-border bg-ns-surface p-6">
      <h2 className="font-heading text-xl text-ns-cream">{title}</h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ns-muted">{body}</p>
      <Link
        href={href}
        className="mt-6 inline-flex text-sm uppercase tracking-widest text-ns-gold hover:underline"
      >
        {cta} →
      </Link>
    </article>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
