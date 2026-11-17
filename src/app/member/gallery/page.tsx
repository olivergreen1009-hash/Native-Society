"use client";

import Image from "next/image";
import Link from "next/link";
import {
  currentWeekLabel,
  weeklyRecommendationBatch,
} from "@/lib/member-gallery-profiles";

export default function GalleryPage() {
  const profiles = weeklyRecommendationBatch();
  const weekOf = currentWeekLabel();

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-ns-gold">
            Weekly introductions
          </p>
          <h1 className="font-heading mt-3 text-4xl text-ns-cream">This week</h1>
        </div>
        <p className="text-xs uppercase tracking-widest text-ns-muted">
          Week of {weekOf}
        </p>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ns-muted">
        Placeholder batch from sample profiles—refreshes on a weekly cadence in
        production. Tap a card for detail; interest is private until mutual.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {profiles.map((profile) => (
          <Link
            key={profile.id}
            href={`/member/gallery/${profile.id}`}
            className="group overflow-hidden rounded border border-ns-border bg-ns-surface transition hover:border-ns-gold/50"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={profile.imageUrl}
                alt=""
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ns-bg via-ns-bg/20 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <p className="font-heading text-xl text-ns-cream">
                  {profile.firstName} · {profile.age}
                </p>
                <p className="text-xs text-ns-muted">{profile.neighborhood}</p>
                <p className="mt-1 text-xs text-ns-gold">{profile.school}</p>
                <ul className="mt-2 flex flex-wrap gap-1">
                  {profile.interests.slice(0, 3).map((interest) => (
                    <li
                      key={interest}
                      className="rounded border border-ns-border/60 px-2 py-0.5 text-[10px] text-ns-cream"
                    >
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-ns-muted">
        New introductions every Monday · pass or express interest from the detail view
      </p>
    </div>
  );
}