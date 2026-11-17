import Link from "next/link";

const included = [
  "Human review of every application",
  "A small weekly selection of members—never a feed",
  "Mutual interest before messaging",
  "Private profiles visible only to approved members",
];

const notIncluded = [
  "Public browsing or swipe mechanics",
  "Activity metrics or popularity scores",
  "Events, concierge, or tiered memberships (phase 1)",
  "Video, voice, or AI matching interfaces",
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

export function LandingPage() {
  return (
    <div className="pt-16">
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 md:px-8 md:pt-24">
        <p className="text-xs uppercase tracking-[0.35em] text-ns-gold">
          Invitation only · NYC
        </p>
        <h1 className="font-heading mt-6 max-w-3xl text-4xl leading-tight md:text-6xl">
          Dating for those who grew up in the city—and in its schools.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ns-muted md:text-lg">
          Native Society is a private members’ introduction club for adults raised in
          New York City who attended independent private or boarding school. No
          public profiles. No endless scrolling. Just considered introductions,
          refreshed weekly.
        </p>
        <div className="mt-10">
          <Link
            href="/apply"
            className="inline-block rounded-full bg-ns-gold px-10 py-3 text-sm font-medium uppercase tracking-widest text-ns-bg transition hover:bg-ns-cream"
          >
            Apply for membership
          </Link>
        </div>
      </section>

      <section className="border-t border-ns-border bg-ns-surface py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-heading text-3xl">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded border border-ns-border bg-ns-bg/50 p-6"
              >
                <span className="text-xs text-ns-gold">0{index + 1}</span>
                <h3 className="font-heading mt-3 text-lg">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ns-muted">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ns-border py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:px-8">
          <BulletList title="Included" items={included} />
          <BulletList title="Not in phase 1" items={notIncluded} muted />
        </div>
      </section>

      <section className="border-t border-ns-border bg-ns-surface py-16 text-center md:py-20">
        <div className="mx-auto max-w-xl px-5 md:px-8">
          <h2 className="font-heading text-3xl">Ready when you are</h2>
          <p className="mt-4 text-sm leading-relaxed text-ns-muted">
            One application. Private review. If approved, you&apos;ll receive sign-in
            instructions to complete your profile and join the weekly introduction
            cycle.
          </p>
          <Link
            href="/apply"
            className="mt-8 inline-block rounded-full border border-ns-gold px-10 py-3 text-sm uppercase tracking-widest text-ns-gold hover:bg-ns-gold hover:text-ns-bg"
          >
            Apply
          </Link>
        </div>
      </section>
    </div>
  );
}

function BulletList({
  title,
  items,
  muted,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div>
      <h2 className="font-heading text-2xl">{title}</h2>
      <ul
        className={`mt-6 space-y-3 text-sm ${muted ? "text-ns-muted" : "text-ns-cream"}`}
      >
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-ns-gold">—</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}