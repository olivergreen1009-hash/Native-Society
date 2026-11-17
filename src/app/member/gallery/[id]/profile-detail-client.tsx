"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";
import { addIntroduction } from "@/lib/client-store";
import { getMemberGalleryProfile } from "@/lib/member-gallery-profiles";
import { DEMO_MEMBER } from "@/lib/sample-data";

export function ProfileDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const profile = useMemo(() => getMemberGalleryProfile(id), [id]);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState(
    "I would welcome an introduction when timing allows.",
  );

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

  const requestIntro = (e: FormEvent) => {
    e.preventDefault();
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
    const session = cookie
      ? decodeSession(decodeURIComponent(cookie.split("=")[1] ?? ""))
      : null;
    const memberId = session?.userId ?? DEMO_MEMBER.id;
    addIntroduction({ memberId, profileId: profile.id, message });
    setSubmitted(true);
    setTimeout(() => router.push("/member/introductions"), 1200);
  };

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
        </figure>
        <section>
          <p className="text-xs uppercase tracking-widest text-ns-gold">Introduction</p>
          <h1 className="font-heading mt-2 text-4xl text-ns-cream">
            {profile.firstName} · {profile.age}
          </h1>
          <p className="mt-2 text-sm text-ns-muted">{profile.neighborhood}</p>
          <p className="text-sm text-ns-gold">{profile.school}</p>
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
            <form onSubmit={requestIntro} className="mt-10 space-y-4">
              <label className="block text-xs uppercase tracking-widest text-ns-gold">
                Private note (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
              />
              <button
                type="submit"
                className="rounded-full bg-ns-gold px-8 py-3 text-xs uppercase tracking-widest text-ns-bg hover:bg-ns-cream"
              >
                Express interest
              </button>
            </form>
          )}
        </section>
      </article>
    </section>
  );
}