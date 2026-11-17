import Link from "next/link";
import { LandingExampleProfiles } from "@/components/landing-example-profiles";

const included = [
  "Human review of every application",
  "A small weekly selection of members—never a feed",
  "Mutual interest before messaging",
  "Private profiles visible only to approved members",
];

const steps = [
  {
    title: "Apply",
    body: "Share your NYC upbringing, school history, and intentions. We review privately.",
  },
  {
    title: "Approval",
    body: "Admissions is selective. You may be approved, asked for more detail, or declined.",
  },
  {
    title: "Profile",
    body: "After approval, complete a thoughtful profile—photos, bio, prompts, preferences.",
  },
  {
    title: "Weekly introductions",
    body: "Each week, view a curated batch. Express interest, pass quietly, or report concerns.",
  },
  {
    title: "Mutual matches",
    body: "When interest is mutual, messaging opens. Pass decisions stay private.",
  },
];

const ctaButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-full px-8 text-sm font-medium uppercase tracking-widest transition md:px-10";

export function LandingPage() {
  return (
    <div className="pt-16">
      {/* Hero — tighter vertical rhythm on mobile */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-10 md:px-8 md:pb-20 md:pt-24">
        <p className="text-xs uppercase tracking-[0.35em] text-ns-gold">
          Invitation only · NYC
        </p>
        <h1 className="font-heading mt-3 max-w-3xl text-[1.75rem] leading-tight md:mt-6 md:text-6xl">
          Dating for those who grew up in the city—and in its schools.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ns-muted md:mt-6 md:text-lg">
          Native Society is a private members’ introduction club for adults raised in
          New York City who attended independent private or boarding school. No
          public profiles. No endless scrolling. Just considered introductions,
          refreshed weekly.
        </p>
        <div className="mt-6 md:mt-10">
          <Link
            href="/apply"
            className={`${ctaButtonClass} bg-ns-gold text-ns-bg hover:bg-ns-cream`}
          >
            Apply for membership
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-ns-border bg-ns-surface py-10 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-heading text-2xl md:text-3xl">How it works</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:mt-10 md:gap-6 lg:grid-cols-5">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded border border-ns-border bg-ns-bg/50 p-4 md:p-6"
              >
                <span className="text-xs text-ns-gold">0{index + 1}</span>
                <h3 className="font-heading mt-2 text-base md:mt-3 md:text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-ns-muted md:mt-3 md:leading-relaxed">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LandingExampleProfiles />

      <section className="border-t border-ns-border py-10 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <BulletList title="Included" items={included} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-ns-border bg-ns-surface py-10 text-center md:py-20">
        <div className="mx-auto max-w-xl px-5 md:px-8">
          <h2 className="font-heading text-2xl md:text-3xl">Ready when you are</h2>
          <p className="mt-3 text-sm leading-relaxed text-ns-muted md:mt-4">
            One application. Private review. If approved, you&apos;ll receive sign-in
            instructions to complete your profile and join the weekly introduction
            cycle.
          </p>
          <Link
            href="/apply"
            className={`${ctaButtonClass} mt-6 border border-ns-gold text-ns-gold hover:bg-ns-gold hover:text-ns-bg md:mt-8`}
          >
            Apply
          </Link>
        </div>
      </section>
    </div>
  );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-heading text-xl md:text-2xl">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm text-ns-cream md:mt-6 md:space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2 md:gap-3">
            <span className="text-ns-gold">—</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}