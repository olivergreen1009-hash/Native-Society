"use client";

import Image from "next/image";
import { ApplicationForm } from "@/components/application-form";
import { ExampleProfileCards } from "@/components/example-profile-cards";

const howItWorks = [
  {
    title: "Apply",
    description:
      "Share your background and preferences. Every application is reviewed.",
  },
  {
    title: "Get approved",
    description: "We confirm eligibility and that a relevant pool exists.",
  },
  {
    title: "Receive recommendations",
    description:
      "A small weekly batch matched to your preferences. No feeds. No swiping.",
  },
  {
    title: "Mutual interest",
    description: "If both of you are interested, a match is created.",
  },
  {
    title: "Message",
    description: "Private text chat unlocks. You decide what happens next.",
  },
] as const;

export function LandingSections() {
  return (
    <>
      <section className="relative flex min-h-[min(100vh,54rem)] items-end overflow-hidden pt-24">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover opacity-30 saturate-[0.45]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ns-bg via-ns-bg/92 to-ns-bg" />
        <div className="relative mx-auto w-full max-w-5xl px-5 pb-14 pt-6 sm:px-8 md:pb-20 md:pt-10">
          <Eyebrow>Application only · New York</Eyebrow>
          <h1 className="font-heading mt-5 max-w-2xl text-[2.5rem] font-normal leading-[1.08] tracking-[0.02em] text-white sm:text-[2.85rem] md:text-[3.35rem]">
            New York Born.
            <br />
            <span className="text-ns-gold">Introduced Well.</span>
          </h1>
          <p className="font-heading mt-6 max-w-2xl text-xl font-light leading-relaxed text-white md:text-2xl">
            A private dating site for adults who grew up in New York City and attended
            independent or boarding schools.
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white sm:text-[1.05rem]">
            No public profiles. No endless browsing. No unsolicited messages. Each week, a
            small batch of people who fit what you&apos;re looking for.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ns-muted">
            Currently admitting ages 23–40. Membership is paid. Billing starts only after
            approval and a confirmed reciprocal pool.
          </p>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
            <a href="#apply" className="club-btn-apply w-full text-center sm:w-auto">
              Apply
            </a>
            <a
              href="#examples"
              className="text-center text-base text-ns-muted transition hover:text-ns-gold sm:text-left"
            >
              View example profiles
            </a>
          </div>
        </div>
      </section>

      <Section id="how-it-works" subdued>
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl text-white md:text-3xl">How it works</h2>
          <ol className="mt-10 space-y-0 divide-y divide-ns-border border-y border-ns-border">
            {howItWorks.map((step, i) => (
              <li
                key={step.title}
                className="grid gap-3 py-7 sm:grid-cols-[2.5rem_1fr] sm:gap-8 sm:py-8"
              >
                <span className="font-heading text-2xl text-ns-gold tabular-nums">{i + 1}</span>
                <div>
                  <h3 className="font-heading text-xl text-white">
                    {step.title}
                    <span className="text-ns-muted"> — </span>
                    <span className="text-base font-sans font-normal text-ns-muted sm:text-[1.05rem]">
                      {step.description}
                    </span>
                  </h3>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="examples">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium tracking-wide text-ns-gold uppercase">
            Illustrative only — not real members
          </p>
          <h2 className="font-heading mt-2 text-2xl text-white md:text-3xl">
            Example profiles
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ns-muted">
            These cards mirror the weekly recommendation view—four examples rotate from a
            broader set. They are not a live directory.
          </p>
          <ExampleProfileCards />
        </div>
      </Section>

      <Section id="apply" subdued>
        <div className="mx-auto max-w-2xl">
          <h2 className="font-heading text-center text-2xl text-white md:text-3xl">
            Application
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-base leading-relaxed text-ns-muted">
            Structured questions below help us check eligibility and whether a reciprocal pool
            exists for your preferences.
          </p>
          <ApplicationForm />
        </div>
      </Section>
    </>
  );
}

function Section({
  id,
  children,
  subdued,
}: {
  id?: string;
  children: React.ReactNode;
  subdued?: boolean;
}) {
  return (
    <section
      id={id}
      className={`border-t border-ns-border px-5 py-14 sm:px-8 md:py-20 ${
        subdued ? "bg-ns-surface" : "bg-ns-bg"
      }`}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-heading text-xs tracking-[0.28em] text-ns-gold uppercase sm:text-[0.72rem]">
      {children}
    </p>
  );
}
