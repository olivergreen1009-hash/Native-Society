"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";
import { getCurationMap } from "@/lib/client-store";
import { DEMO_MEMBER, societyProfiles } from "@/lib/sample-data";
import type { SocietyProfile } from "@/lib/types";

function LockIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4 text-ns-gold"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M7 11V8a5 5 0 0110 0v3M6 11h12v9H6z" />
    </svg>
  );
}

export default function GalleryPage() {
  const [profiles, setProfiles] = useState<SocietyProfile[]>([]);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
    const session = cookie
      ? decodeSession(decodeURIComponent(cookie.split("=")[1] ?? ""))
      : null;
    const memberId = session?.userId ?? DEMO_MEMBER.id;
    const ids = getCurationMap()[memberId] ?? [];
    setProfiles(societyProfiles.filter((p) => ids.includes(p.id)));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Curated for you</p>
          <h1 className="font-heading mt-3 text-4xl text-ns-cream">Private Gallery</h1>
        </div>
        <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-ns-muted">
          <LockIcon />
          Confidential · mutual interest required
        </p>
      </div>
      <p className="mt-4 max-w-2xl text-sm text-ns-muted">
        A limited selection of curated profiles. Request an introduction when someone
        interests you; we facilitate only when interest is mutual.
      </p>

      {profiles.length === 0 ? (
        <p className="mt-12 rounded border border-ns-border bg-ns-surface p-8 text-sm leading-relaxed text-ns-muted">
          Your curator is preparing your next selection. You will be notified when new
          profiles are ready.
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ns-bg via-ns-bg/20 to-transparent" />
                <div className="absolute bottom-0 p-5">
                  <p className="font-heading text-xl text-ns-cream">
                    {profile.firstName} · {profile.age}
                  </p>
                  <p className="text-xs text-ns-muted">{profile.neighborhood}</p>
                  <ul className="mt-2 flex flex-wrap gap-1">
                    {profile.interests.slice(0, 3).map((interest) => (
                      <li
                        key={interest}
                        className="rounded border border-ns-border/60 px-2 py-0.5 text-[10px] text-ns-muted"
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
      )}
    </div>
  );
}
