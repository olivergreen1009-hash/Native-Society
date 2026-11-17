"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Profile } from "@/types/domain";

export function DiscoverClient() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [batchId, setBatchId] = useState("");
  const [refreshAt, setRefreshAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/discover");
    setLoading(false);
    if (!res.ok) {
      setNotice("Complete onboarding before viewing introductions.");
      return;
    }
    const json = (await res.json()) as {
      profiles: Profile[];
      batchId: string;
      refreshAt: string;
    };
    setProfiles(json.profiles);
    setBatchId(json.batchId);
    setRefreshAt(json.refreshAt);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (
    toUserId: string,
    decision: "interested" | "pass" | "report",
  ) => {
    const res = await fetch("/api/discover/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId, batchId, decision }),
    });
    const json = (await res.json()) as { mutual?: boolean; matchId?: string };
    setProfiles((prev) => prev.filter((p) => p.userId !== toUserId));
    if (decision === "interested" && json.mutual) {
      setNotice("Mutual interest — view your match in Messages.");
    } else if (decision === "interested") {
      setNotice("Interest recorded. They will not see if you pass.");
    } else if (decision === "report") {
      setNotice("Report received. This introduction will not appear again.");
    }
  };

  const refreshLabel = refreshAt
    ? new Date(refreshAt).toLocaleString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">
        This week
      </p>
      <h1 className="font-heading mt-3 text-4xl">Introductions</h1>
      <p className="mt-4 max-w-2xl text-sm text-ns-muted">
        A small curated batch refreshes weekly. Express interest, pass quietly, or
        report a concern. Passes are never shared with the other member.
      </p>
      {refreshLabel && (
        <p className="mt-2 text-xs text-ns-muted">
          Next refresh: {refreshLabel}
        </p>
      )}
      {notice && (
        <p className="mt-4 rounded border border-ns-gold/30 bg-ns-surface px-4 py-3 text-sm">
          {notice}
        </p>
      )}
      {loading ? (
        <p className="mt-12 text-ns-muted">Preparing your batch…</p>
      ) : profiles.length === 0 ? (
        <p className="mt-12 rounded border border-ns-border bg-ns-surface p-8 text-sm text-ns-muted">
          {notice || "No introductions remain this week. Your next batch arrives on the refresh date above."}
        </p>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {profiles.map((profile) => (
            <article
              key={profile.id}
              className="overflow-hidden rounded border border-ns-border bg-ns-surface"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={
                    profile.photos[0]?.url ??
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800"
                  }
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-3 p-6">
                <h2 className="font-heading text-2xl">
                  {profile.firstName} · {profile.age}
                </h2>
                <p className="text-sm text-ns-muted">{profile.neighborhood}</p>
                <p className="text-sm leading-relaxed">{profile.bio}</p>
                <ul className="flex flex-wrap gap-2">
                  {profile.interests.map((i) => (
                    <li
                      key={i}
                      className="rounded border border-ns-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-ns-muted"
                    >
                      {i}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => void act(profile.userId, "interested")}
                    className="rounded-full bg-ns-gold px-5 py-2 text-xs uppercase tracking-widest text-ns-bg"
                  >
                    Interested
                  </button>
                  <button
                    type="button"
                    onClick={() => void act(profile.userId, "pass")}
                    className="rounded-full border border-ns-border px-5 py-2 text-xs uppercase tracking-widest text-ns-muted"
                  >
                    Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => void act(profile.userId, "report")}
                    className="rounded-full border border-red-900/50 px-5 py-2 text-xs uppercase tracking-widest text-red-300/80"
                  >
                    Report
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}