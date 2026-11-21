import Link from "next/link";

const howItWorks = [
  {
    title: "Apply",
    body: "Tell us about your industry connection, what you bring, and whom you hope to meet.",
  },
  {
    title: "Personal review",
    body: "The founder reviews every application. You're invited to join only when we believe we can meaningfully serve your goals.",
  },
  {
    title: "Mutual introduction",
    body: "We propose a relevant connection. Both people agree before contact details are shared.",
  },
] as const;

export function LandingPage() {
  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-5 pb-10 pt-8 md:px-8 md:pb-14 md:pt-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ns-gold md:text-xs">
          New York real estate &amp; hospitality
        </p>
        <h1 className="font-heading mt-4 text-4xl leading-tight text-ns-cream md:mt-5 md:text-5xl">
          Personally introduced.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ns-muted md:mt-5 md:text-lg">
          A private, founder-led service for professional and social introductions. We
          connect people with substantive ties to these industries—when there&apos;s a
          clear reason to meet.
        </p>
        <div className="mt-6 md:mt-8">
          <Link
            href="/apply"
            className="inline-block rounded-full bg-ns-gold px-8 py-2.5 text-sm font-medium uppercase tracking-widest text-ns-bg transition hover:bg-ns-cream"
          >
            Apply for consideration
          </Link>
        </div>
        <p className="mt-4 text-sm leading-snug text-ns-muted">
          Private profiles. Mutual agreement. No open directory.
        </p>
      </section>

      {/* How it works */}
      <section className="border-t border-ns-border bg-ns-surface/40 py-10 md:py-12">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="font-heading text-2xl text-ns-cream md:text-3xl">How it works</h2>
          <ol className="mt-6 list-none space-y-5">
            {howItWorks.map((step, index) => (
              <li key={step.title} className="flex gap-4 border-b border-ns-border/60 pb-5 last:border-0 last:pb-0">
                <span className="font-heading shrink-0 text-lg text-ns-gold tabular-nums">
                  {index + 1}.
                </span>
                <div>
                  <h3 className="font-heading text-base text-ns-cream md:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ns-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Founder */}
      <section className="border-t border-ns-border py-10 md:py-12">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="font-heading text-2xl text-ns-cream md:text-3xl">Founder-led</h2>
          <p className="mt-4 text-sm leading-relaxed text-ns-muted md:text-base">
            Introductions are sourced, screened, and proposed personally—with a clear
            reason each time. The founder coordinates mutual acceptance, makes the joint
            introduction, and follows up. You are not paying for access to a list or
            directory.
          </p>
        </div>
      </section>

      {/* Membership */}
      <section className="border-t border-ns-border bg-ns-surface/40 py-10 md:py-12">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="font-heading text-2xl text-ns-cream md:text-3xl">Membership</h2>
          <p className="mt-4 text-sm leading-relaxed text-ns-muted md:text-base">
            Paid membership, by invitation following review. Fees and terms are shared
            before you join.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ns-muted md:text-base">
            No application fee. No payment until we confirm we can meaningfully serve your
            goals.
          </p>
          {/* TODO(counsel): Publish counsel-approved membership fee schedule and activation terms on this page when ready. */}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-ns-border py-10 md:py-12">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="font-heading text-2xl text-ns-cream md:text-3xl">FAQ</h2>
          <dl className="mt-6 space-y-6">
            <div>
              <dt className="font-heading text-base text-ns-cream">
                Is this a dating service?
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ns-muted">
                No. Native Society is for professional and social connections within New
                York real estate and hospitality.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Apply */}
      <section className="border-t border-ns-border bg-ns-surface/40 py-10 text-center md:py-12">
        <div className="mx-auto max-w-xl px-5 md:px-8">
          <h2 className="font-heading text-2xl text-ns-cream">Apply</h2>
          <p className="mt-3 text-sm text-ns-muted">
            One application. Personal review. No payment with your submission.
          </p>
          <Link
            href="/apply"
            className="mt-6 inline-block rounded-full border border-ns-gold px-8 py-2.5 text-xs uppercase tracking-widest text-ns-gold transition hover:bg-ns-gold hover:text-ns-bg"
          >
            Apply for consideration
          </Link>
        </div>
      </section>
    </div>
  );
}