"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  activeExampleProfiles,
  landingExampleProfiles,
  type LandingExampleProfile,
} from "@/lib/landing-example-profiles";

function pickRotatingBatch(): LandingExampleProfile[] {
  return activeExampleProfiles();
}

export function ExampleProfileCards() {
  const [batch, setBatch] = useState<LandingExampleProfile[]>(() =>
    typeof window === "undefined" ? landingExampleProfiles.slice(0, 4) : pickRotatingBatch(),
  );

  useEffect(() => {
    setBatch(pickRotatingBatch());
    const interval = setInterval(() => setBatch(pickRotatingBatch()), 15_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-2">
      {batch.map((profile) => (
        <ExampleCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}

function ExampleCard({ profile }: { profile: LandingExampleProfile }) {
  return (
    <article className="flex h-full flex-col border border-ns-border bg-ns-bg">
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
        <Image
          src={profile.imageUrl}
          alt=""
          fill
          className="object-cover object-top grayscale-[15%]"
          sizes="(max-width: 1024px) 100vw, 480px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ns-bg via-ns-bg/20 to-transparent" />
        <span className="absolute left-4 top-4 border border-ns-gold bg-ns-bg/90 px-2 py-1 text-xs font-medium tracking-widest text-ns-gold uppercase">
          Example
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 py-6 sm:px-7">
        <h3 className="font-heading text-2xl text-white">
          {profile.firstName}
          <span className="text-ns-muted"> · {profile.age}</span>
          <span className="text-ns-muted"> · </span>
          <span className="text-lg text-ns-gold">{profile.neighborhood}</span>
        </h3>
        <p className="mt-2 text-base text-ns-gold">{profile.schoolLine}</p>
        <p className="mt-4 text-sm leading-relaxed text-ns-muted">
          <span className="text-ns-cream">Interests: </span>
          {profile.interests.join(", ")}
        </p>
        <blockquote className="mt-4 border-l-2 border-ns-gold/50 pl-4 font-heading text-base italic leading-relaxed text-ns-cream">
          {profile.prompt}
        </blockquote>
        <p className="mt-4 text-sm text-ns-muted">
          <span className="text-white">Looking for: </span>
          {profile.lookingFor}
        </p>
        <div className="mt-6 flex flex-col gap-3 border-t border-ns-border pt-6 sm:flex-row">
          <button
            type="button"
            disabled
            className="flex-1 border border-ns-gold bg-ns-gold/15 px-4 py-3 text-base text-white"
            aria-label="Interested (example only)"
          >
            Interested
          </button>
          <button
            type="button"
            disabled
            className="flex-1 border border-ns-border px-4 py-3 text-base text-ns-muted"
            aria-label="Pass (example only)"
          >
            Pass
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-ns-muted">
          Buttons shown for layout only—not functional on examples.
        </p>
      </div>
    </article>
  );
}