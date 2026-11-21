"use client";

import { useEffect, useState } from "react";
import {
  INTRODUCTION_STATE_LABELS,
  type IntroductionProposal,
  type IntroductionProposalState,
} from "@/types/society";

const advanceStates: IntroductionProposalState[] = [
  "awaiting_responses",
  "mutually_accepted",
  "introduced",
  "follow_up_complete",
  "declined",
  "withdrawn",
];

export function AdminIntroductions() {
  const [proposals, setProposals] = useState<IntroductionProposal[]>([]);

  const load = async () => {
    const res = await fetch("/api/admin/introductions");
    const json = (await res.json()) as { proposals?: IntroductionProposal[] };
    setProposals(json.proposals ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const advance = async (proposalId: string, state: IntroductionProposalState) => {
    await fetch("/api/admin/introductions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId, state }),
    });
    await load();
  };

  return (
    <div>
      <h1 className="font-heading text-4xl">Introductions</h1>
      <p className="mt-2 text-sm text-ns-muted">
        Draft proposals in person; members see limited profiles and reasons. Advance states
        after mutual acceptance and founder joint introduction.
      </p>
      <p className="mt-2 text-xs text-ns-muted">
        Creating proposals via API POST is wired; full admin compose UI is a follow-up.
      </p>
      <ul className="mt-8 space-y-4">
        {proposals.map((p) => (
          <li
            key={p.id}
            className="rounded border border-ns-border bg-ns-surface p-5 text-sm"
          >
            <p className="font-heading text-lg text-ns-cream">
              {p.limitedProfileSnapshot.displayName} ·{" "}
              {INTRODUCTION_STATE_LABELS[p.state]}
            </p>
            <p className="mt-2 text-ns-muted">{p.reason}</p>
            <p className="mt-1 text-xs text-ns-muted">{p.proposalText}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {advanceStates
                .filter((s) => s !== p.state)
                .map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => void advance(p.id, state)}
                    className="rounded border border-ns-gold px-2 py-1 text-[10px] uppercase tracking-widest text-ns-gold"
                  >
                    → {INTRODUCTION_STATE_LABELS[state]}
                  </button>
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}