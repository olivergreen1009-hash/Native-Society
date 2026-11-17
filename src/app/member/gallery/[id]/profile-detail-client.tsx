"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";
import { addIntroduction } from "@/lib/client-store";
import { galleryLocationLine } from "@/lib/gallery-location-line";
import { DEMO_MEMBER } from "@/lib/sample-data";
import {
  cacheGalleryProfiles,
  getMemberGalleryProfile,
} from "@/lib/member-gallery-profiles";
import { displaySummerDestination } from "@/lib/summer-destination";
import type { SocietyProfile } from "@/lib/types";

export function ProfileDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const [profile, setProfile] = useState<SocietyProfile | undefined>();
  const [batchId, setBatchId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mutual, setMutual] = useState(false);
  const [message, setMessage] = useState(
    "I would welcome an introduction when timing allows.",
  );

  const load = useCallback(async () => {
    const res = await fetch("/api/member/gallery");
    if (res.ok) {
      const json = (await res.json()) as {
        profiles: SocietyProfile[];
        batchId: string;
      };
      cacheGalleryProfiles(json.profiles ?? []);
      setBatchId(json.batchId ?? "");
      setProfile(
        json.profiles?.find((p) => p.id === id) ?? getMemberGalleryProfile(id),
      );
    } else {
      setProfile(getMemberGalleryProfile(id));
    }
    const introRes = await fetch("/api/member/introductions");
    if (introRes.ok) {
      const introJson = (await introRes.json()) as {
        introductions: Array<{ profileId: string; status: string }>;
      };
      const intro = introJson.introductions?.find((i) => i.profileId === id);
      setMutual(intro?.status === "mutual_confirmed");
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!profile) {
    return (
      <section>
        <p className="text-ns-cream">Profile not found.</p>
        <Link href="/member/gallery" className="mt-4 inline-block text-ns-gold">
          Back to this week
        </Link>
      </section>
    );
  }

  const requestIntro = async (e: FormEvent) => {
    e.preventDefault();
    if (profile.isSample) {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
      const session = cookie
        ? decodeSession(decodeURIComponent(cookie.split("=")[1] ?? ""))
        : null;
      addIntroduction({
        memberId: session?.userId ?? DEMO_MEMBER.id,
        profileId: profile.id,
        message,
      });
      setSubmitted(true);
      setTimeout(() => router.push("/member/introductions"), 1200);
      return;
    }
    const res = await fetch("/api/member/gallery/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUserId: profile.id,
        batchId: batchId || `sample-local-${id}`,
        decision: "interested",
        message,
      }),
    });
    if (res.ok) {
      const json = (await res.json()) as { mutual?: boolean };
      setMutual(Boolean(json.mutual));
      setSubmitted(true);
      setTimeout(() => router.push("/member/introductions"), 1200);
    }
  };

  const pass = async () => {
    await fetch("/api/member/gallery/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUserId: profile.id,
        batchId: batchId || `sample-local-${id}`,
        decision: "pass",
      }),
    });
    router.push("/member/gallery");
  };

  const location = galleryLocationLine(
    profile.neighborhood,
    profile.raisedInBorough,
  );
  const summer = displaySummerDestination(
    profile.summerDestination,
    profile.summerOther,
  );

  return (
    <section className="mx-auto max-w-5xl">
      <Link href="/member/gallery" className="text-sm text-ns-gold hover:underline">
        ← This week
      </Link>
      <article className="mt-8 grid gap-10 md:grid-cols-2">
        <figure className="relative aspect-[3/4] overflow-hidden rounded border border-ns-border">
          <Image
            src={profile.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="50vw"
          />
          {profile.isSample ? (
            <span className="absolute left-3 top-3 rounded border border-ns-gold/80 bg-ns-bg/90 px-2 py-0.5 text-[10px] uppercase tracking-widest text-ns-gold">
              Example
            </span>
          ) : null}
        </figure>
        <section>
          <p className="text-xs uppercase tracking-widest text-ns-gold">Introduction</p>
          <h1 className="font-heading mt-2 text-4xl text-ns-cream">
            {profile.firstName} · {profile.age}
          </h1>
          {location ? <p className="mt-2 text-sm text-ns-muted">{location}</p> : null}
          <p className="text-sm text-ns-gold">
            {profile.schoolLine?.trim() || profile.school}
          </p>
          {summer ? (
            <p className="mt-1 text-sm text-ns-cream/90">Summers: {summer}</p>
          ) : null}
          {mutual && profile.favoriteNycDetail ? (
            <p className="mt-4 rounded border border-ns-border/80 bg-ns-surface px-4 py-3 text-sm text-ns-cream">
              <span className="text-xs uppercase tracking-widest text-ns-gold">
                Favorite NYC detail
              </span>
              <span className="mt-1 block">{profile.favoriteNycDetail}</span>
            </p>
          ) : null}
          <ul className="mt-4 flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <li
                key={interest}
                className="rounded-full border border-ns-border px-3 py-1 text-xs text-ns-cream"
              >
                {interest}
              </li>
            ))}
          </ul>
          <p className="mt-6 leading-relaxed text-ns-cream">{profile.memberBio}</p>
          {profile.compatibilityNotes && (
            <p className="mt-4 text-sm text-ns-muted">
              Looking for: {profile.compatibilityNotes}
            </p>
          )}

          {submitted ? (
            <p className="mt-10 rounded border border-ns-gold/40 bg-ns-surface p-5 text-sm text-ns-cream">
              Interest recorded. We&apos;ll facilitate only if they feel the same.
            </p>
          ) : (
            <div className="mt-10 space-y-4">
              <form onSubmit={requestIntro} className="space-y-4">
                <label className="block text-xs uppercase tracking-widest text-ns-gold">
                  Private note (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-full bg-ns-gold px-8 py-3 text-xs uppercase tracking-widest text-ns-bg hover:bg-ns-cream"
                  >
                    Express interest
                  </button>
                  <button
                    type="button"
                    onClick={() => void pass()}
                    className="rounded-full border border-ns-border px-8 py-3 text-xs uppercase tracking-widest text-ns-muted hover:text-ns-cream"
                  >
                    Pass
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </article>
    </section>
  );
}