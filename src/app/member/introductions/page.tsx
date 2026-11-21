"use client";

import { useCallback, useEffect, useState } from "react";
import {
  INTRODUCTION_STATE_LABELS,
  type IntroductionProposal,
} from "@/types/society";

export default function ProposedIntroductionsPage() {
  const [items, setItems] = useState<IntroductionProposal[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/member/proposals");
    const json = (await res.json()) as {
      proposals?: IntroductionProposal[];
      error?: string;
    };
    if (!res.ok) {
      setError(json.error ?? "Could not load proposals.");
      setItems([]);
    } else {
      setError("");
      setItems(json.proposals ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const respond = async (
    proposalId: string,
    response: "accepted" | "declined",
  ) => {
    const res = await fetch("/api/member/proposals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId, response }),
    });
    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Could not save your response.");
      return;
    }
    await load();
  };

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">
        Proposed introductions
      </p>
      <h1 className="font-heading mt-3 text-4xl text-ns-cream">Your proposals</h1>
      <p className="mt-4 text-sm text-ns-muted">
        Each proposal shows a limited profile and why meeting may be worthwhile. Accept
        or decline privately—no contact details are shared unless both accept.
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-12 text-sm text-ns-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-12 rounded border border-ns-border bg-ns-surface p-8 text-sm text-ns-muted">
          No active proposals. The founder will reach out when there is a clear reason for
          an introduction.
        </p>
      ) : (
        <ul className="mt-10 space-y-6">
          {items
            .filter((p) => p.state !== "draft")
            .map((item) => (
              <li
                key={item.id}
                className="rounded border border-ns-border bg-ns-surface p-6"
              >
                <p className="text-xs uppercase tracking-widest text-ns-gold">
                  {INTRODUCTION_STATE_LABELS[item.state]}
                </p>
                <p className="font-heading mt-2 text-xl text-ns-cream">
                  {item.limitedProfileSnapshot.displayName}
                </p>
                <p className="mt-1 text-sm text-ns-muted">
                  {item.limitedProfileSnapshot.headline}
                </p>
                <p className="mt-3 text-sm text-ns-cream">{item.reason}</p>
                <p className="mt-2 text-xs text-ns-muted">{item.proposalText}</p>
                {item.state === "awaiting_responses" && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void respond(item.id, "accepted")}
                      className="rounded-full bg-ns-gold px-5 py-2 text-xs uppercase tracking-widest text-ns-bg"
                    >
                      Accept proposal
                    </button>
                    <button
                      type="button"
                      onClick={() => void respond(item.id, "declined")}
                      className="rounded-full border border-ns-border px-5 py-2 text-xs uppercase tracking-widest text-ns-muted hover:text-ns-cream"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}