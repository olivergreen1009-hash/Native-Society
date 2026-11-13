"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { addInquiry } from "@/lib/client-store";
import {
  features,
  landingMockProfileIds,
  pricingTiers,
  profilePublicBio,
  societyProfiles,
} from "@/lib/sample-data";

const mockProfiles = societyProfiles.filter((p) =>
  landingMockProfileIds.includes(p.id),
);

export function LandingSections() {
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryError, setInquiryError] = useState("");

  const onInquiry = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInquiryError("");
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const school = String(data.get("school") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !school) {
      setInquiryError("Please complete all required fields.");
      return;
    }
    addInquiry({ name, email, school, message });
    setInquirySent(true);
    e.currentTarget.reset();
  };

  return (
    <>
      <section className="relative flex min-h-[92vh] items-end overflow-hidden pt-16">
        <Image
          src="https://images.unsplash.com/photo-1600607686527-6fb8860908d1?w=1920&q=80"
          alt="Evening light in a private Manhattan club interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ns-bg/95 via-ns-bg/55 to-ns-bg/25" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
          <p className="text-xs uppercase tracking-[0.35em] text-ns-gold">
            Invitation only
          </p>
          <h1 className="font-heading mt-4 max-w-3xl text-4xl leading-tight text-ns-cream md:text-6xl md:leading-[1.1]">
            New York Born.
            <br />
            Personally Connected.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ns-muted md:text-lg">
            Curated introductions for adults who grew up in New York City.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ns-muted">
            Private matchmaking for alumni of independent and boarding schools—no
            public profiles, no casual browsing, and no unsolicited messages.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#inquiry"
              className="rounded-full bg-ns-gold px-8 py-3 text-center text-sm font-medium uppercase tracking-widest text-ns-bg transition hover:bg-ns-cream"
            >
              Request consideration
            </a>
            <a
              href="#gallery"
              className="rounded-full border border-ns-border px-8 py-3 text-center text-sm uppercase tracking-widest text-ns-cream transition hover:border-ns-gold hover:text-ns-gold"
            >
              View gallery sample (illustrative)
            </a>
          </div>
        </div>
      </section>

      <section id="concept" className="border-t border-ns-border bg-ns-bg py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-heading text-3xl text-ns-cream md:text-4xl">
              Courtship, not crowds
            </h2>
            <p className="mt-5 leading-relaxed text-ns-muted">
              We built Native Society for people who know what it means to belong
              to a city—not just live in it. Your gallery is hand-selected. Every
              introduction is intentional. The experience feels like being seated
              in a quiet room while the city hums outside.
            </p>
          </div>
          <div className="rounded border border-ns-border bg-ns-surface p-8">
            <p className="font-heading text-xl text-ns-gold">The promise</p>
            <ul className="mt-6 space-y-4 text-sm text-ns-cream">
              <li>No algorithmic feeds or endless browsing</li>
              <li>Profiles visible only to vetted members</li>
              <li>Introductions opened by you, advanced by our curators</li>
              <li>Compatibility informed by how you actually live in New York</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-ns-border bg-ns-surface py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-heading text-center text-3xl text-ns-cream">
            How membership works
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((f, i) => (
              <article
                key={f.title}
                className="rounded border border-ns-border bg-ns-bg/60 p-6"
              >
                <span className="text-xs text-ns-gold">0{i + 1}</span>
                <h3 className="font-heading mt-3 text-lg text-ns-cream">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ns-muted">{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="border-t border-ns-border py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-heading text-3xl text-ns-cream">Private Gallery</h2>
          <p className="mt-3 max-w-lg text-sm text-ns-muted">
            Illustrative sample only—not a live member gallery. Full profiles appear
            after your request is accepted.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {mockProfiles.map((profile) => (
              <article
                key={profile.id}
                className="group overflow-hidden rounded border border-ns-border bg-ns-surface"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={profile.imageUrl}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ns-bg via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <p className="font-heading text-2xl text-ns-cream">
                      {profile.firstName} · {profile.age}
                    </p>
                    <p className="mt-1 text-sm text-ns-muted">{profile.neighborhood}</p>
                    <ul className="mt-2 flex flex-wrap gap-1">
                      {profile.interests.slice(0, 3).map((interest) => (
                        <li
                          key={interest}
                          className="text-[10px] uppercase tracking-wider text-ns-muted"
                        >
                          {interest}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-ns-border p-6">
                  <p className="text-sm leading-relaxed text-ns-muted">
                    {profilePublicBio(profile)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="membership" className="border-t border-ns-border bg-ns-surface py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-heading text-center text-3xl text-ns-cream">Membership</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ns-muted">
            All tiers require referral and curator approval. Pricing shown for
            transparency; acceptance is never automatic.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <article
                key={tier.name}
                className={`flex flex-col rounded border p-8 ${
                  tier.featured
                    ? "border-ns-gold bg-ns-bg"
                    : "border-ns-border bg-ns-bg/40"
                }`}
              >
                <h3 className="font-heading text-2xl text-ns-cream">{tier.name}</h3>
                <p className="mt-2 text-ns-gold">{tier.price}</p>
                <p className="mt-4 text-sm leading-relaxed text-ns-muted">{tier.description}</p>
                <ul className="mt-6 flex-1 space-y-2 text-sm text-ns-cream">
                  {tier.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="text-ns-gold">—</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="inquiry" className="border-t border-ns-border py-20 md:py-28">
        <div className="mx-auto max-w-xl px-5 md:px-8">
          <h2 className="font-heading text-center text-3xl text-ns-cream">
            Membership inquiry
          </h2>
          <p className="mt-3 text-center text-sm text-ns-muted">
            Tell us where you grew up and which school line you carry. We respond
            privately within two weeks.
          </p>
          {inquirySent ? (
            <p className="mt-10 rounded border border-ns-gold/40 bg-ns-surface p-6 text-center text-sm text-ns-cream">
              Received. A curator will be in touch if your inquiry aligns with the
              current membership.
            </p>
          ) : (
            <form onSubmit={onInquiry} className="mt-10 space-y-5">
              {inquiryError && (
                <p className="text-sm text-red-400">{inquiryError}</p>
              )}
              <Field label="Full name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field
                label="School lineage"
                name="school"
                required
                placeholder="e.g. Dalton → Exeter"
              />
              <div>
                <label className="text-xs uppercase tracking-widest text-ns-muted">
                  Note to curators
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
                  placeholder="Optional context for your referral"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-ns-gold py-3 text-sm font-medium uppercase tracking-widest text-ns-bg transition hover:bg-ns-cream"
              >
                Submit inquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-ns-muted">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none placeholder:text-ns-muted/60 focus:border-ns-gold"
      />
    </div>
  );
}
