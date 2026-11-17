"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/types/domain";

export function AdminProfiles() {
  const [flagged, setFlagged] = useState<Profile[]>([]);
  const [all, setAll] = useState<Profile[]>([]);
  const [showAll, setShowAll] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/profiles");
    const json = (await res.json()) as { flagged: Profile[]; all: Profile[] };
    setFlagged(json.flagged);
    setAll(json.all);
  };

  useEffect(() => {
    void load();
  }, []);

  const moderate = async (
    profileId: string,
    moderationStatus: Profile["moderationStatus"],
  ) => {
    await fetch("/api/admin/profiles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, moderationStatus }),
    });
    await load();
  };

  const list = showAll ? all : flagged;

  return (
    <div>
      <h1 className="font-heading text-4xl">Profile moderation</h1>
      <button
        type="button"
        onClick={() => setShowAll((v) => !v)}
        className="mt-4 text-xs uppercase tracking-widest text-ns-gold"
      >
        {showAll ? "Show flagged only" : "Show all profiles"}
      </button>
      <ul className="mt-8 space-y-4">
        {list.map((profile) => (
          <li
            key={profile.id}
            className="rounded border border-ns-border bg-ns-surface p-5 text-sm"
          >
            <p className="font-heading text-lg">
              {profile.firstName} · {profile.moderationStatus}
            </p>
            <p className="mt-2 text-ns-muted line-clamp-2">{profile.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["approved", "hidden", "pending_review", "flagged"] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void moderate(profile.id, status)}
                    className="rounded-full border border-ns-border px-3 py-1 text-[10px] uppercase tracking-widest text-ns-muted"
                  >
                    {status}
                  </button>
                ),
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}