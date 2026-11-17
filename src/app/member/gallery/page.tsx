"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MemberGalleryCard } from "@/components/member-gallery-card";
import { WEEKLY_SELECTION_NOTE } from "@/lib/member-club-copy";
import { currentWeekLabel } from "@/lib/member-gallery-profiles";
import type { SocietyProfile } from "@/lib/types";

export default function GalleryPage() {
  const [profiles, setProfiles] = useState<SocietyProfile[]>([]);
  const [usingSamples, setUsingSamples] = useState(false);
  const [loading, setLoading] = useState(true);
  const weekOf = currentWeekLabel();

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/member/gallery");
    setLoading(false);
    if (!res.ok) return;
    const json = (await res.json()) as {
      profiles: SocietyProfile[];
      usingSamples: boolean;
    };
    setProfiles(json.profiles ?? []);
    setUsingSamples(Boolean(json.usingSamples));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-ns-gold">
            Weekly introductions
          </p>
          <h1 className="font-heading mt-3 text-4xl text-ns-cream">This week</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ns-muted">
            {WEEKLY_SELECTION_NOTE}
          </p>
        </div>
        <p className="text-xs uppercase tracking-widest text-ns-muted">
          Week of {weekOf}
        </p>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ns-muted">
        {usingSamples
          ? "Illustrative examples until more approved members are in your pool. Tap a card for detail—interest is private until mutual."
          : "Tap a card for detail; interest is private until mutual."}
      </p>

      {loading ? (
        <p className="mt-10 text-sm text-ns-muted">Preparing your batch…</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {profiles.map((profile) => (
            <MemberGalleryCard
              key={profile.id}
              profile={profile}
              href={`/member/gallery/${profile.id}`}
            />
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-ns-muted">
        New introductions every Monday · pass or express interest from the{" "}
        <Link href="/member/gallery" className="text-ns-gold hover:underline">
          detail view
        </Link>
      </p>
    </div>
  );
}