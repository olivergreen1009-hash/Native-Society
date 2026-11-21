"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";
import { DEMO_MEMBER } from "@/lib/sample-data";
import {
  MEMBER_LIFECYCLE_LABELS,
  type MemberLifecycleState,
} from "@/types/society";

export default function MemberDashboardPage() {
  const [lifecycle, setLifecycle] = useState<MemberLifecycleState>("active");
  const [pendingProposals, setPendingProposals] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
    const session = match
      ? decodeSession(decodeURIComponent(match.split("=")[1] ?? ""))
      : null;
    const memberId = session?.userId ?? DEMO_MEMBER.id;

    void (async () => {
      const res = await fetch("/api/member/proposals");
      if (!res.ok) return;
      const json = (await res.json()) as {
        lifecycle?: MemberLifecycleState;
        pauseDiscovery?: boolean;
        proposals?: { state: string }[];
      };
      if (json.lifecycle) setLifecycle(json.lifecycle);
      setPaused(Boolean(json.pauseDiscovery));
      const pending =
        json.proposals?.filter((p) => p.state === "awaiting_responses").length ??
        0;
      setPendingProposals(pending);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Member</p>
      <h1 className="font-heading mt-3 text-4xl text-ns-cream">Your status</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ns-muted">
        {paused
          ? "You are paused. New proposals are on hold; pending proposals follow the rules explained when you paused."
          : "Native Society proposes introductions when there is a clear reason to meet. You decide on each proposal; contact is shared only after mutual acceptance."}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded border border-ns-border bg-ns-surface p-6">
          <p className="text-xs uppercase tracking-widest text-ns-muted">Membership</p>
          <p className="font-heading mt-2 text-2xl text-ns-gold">
            {MEMBER_LIFECYCLE_LABELS[lifecycle]}
          </p>
        </div>
        <div className="rounded border border-ns-border bg-ns-surface p-6">
          <p className="text-xs uppercase tracking-widest text-ns-muted">
            Proposals awaiting you
          </p>
          <p className="font-heading mt-2 text-2xl text-ns-gold">{pendingProposals}</p>
        </div>
      </div>

      <div className="mt-12 rounded border border-ns-border bg-ns-bg/40 p-6">
        <h2 className="font-heading text-xl text-ns-cream">Operating rules</h2>
        <ul className="mt-4 space-y-2 text-sm text-ns-muted">
          <li>— Each proposal includes a limited profile and a specific reason to meet.</li>
          <li>— If you decline, the introduction closes with no contact shared.</li>
          <li>— After mutual acceptance, the founder sends a joint introduction.</li>
          <li>— Native Society does not promise access to capital or funding outcomes.</li>
        </ul>
      </div>

      <div className="mt-8">
        <Link
          href="/member/introductions"
          className="inline-flex rounded-full border border-ns-gold px-6 py-3 text-xs uppercase tracking-widest text-ns-gold hover:bg-ns-gold hover:text-ns-bg"
        >
          View proposed introductions →
        </Link>
      </div>
    </div>
  );
}