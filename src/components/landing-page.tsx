import Link from "next/link";

const howItWorks = [
  {
    title: "Apply",
    body: "Tell us about your connection to the industry, the experience you bring, and the people you hope to meet.",
  },
  {
    title: "Personal review",
    body: "The founder reviews each application for relevance and whether Native Society can meaningfully serve your goals.",
  },
  {
    title: "An invitation to join",
    body: "Qualified applicants are invited to activate membership when relevant introduction opportunities exist. Applying does not require payment.",
  },
  {
    title: "Thoughtful introductions",
    body: "Receive a private proposal explaining who the person is and why meeting could be worthwhile. You both decide whether to proceed.",
  },
  {
    title: "A personal follow-through",
    body: "After mutual acceptance, the founder makes the introduction and follows up.",
  },
] as const;

export function LandingPage() {
  return (
    <div className="pt-16">
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        <p className="text-xs uppercase tracking-[0.35em] text-ns-gold">
          New York real estate and hospitality
        </p>
        <p className="font-heading mt-4 text-sm uppercase tracking-[0.25em] text-ns-muted md:text-base">
          Personally introduced
        </p>
        <h1 className="font-heading mt-6 max-w-3xl text-4xl leading-tight text-ns-cream md:text-6xl">
          Native Society
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-ns-muted md:text-lg">
          A private, founder-led introduction service for people with substantive ties
          to New York real estate and hospitality.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ns-muted md:text-lg">
          I personally review every application and propose introductions when there is a
          clear reason for two people to meet. Every introduction requires mutual
          agreement.
        </p>
        <div className="mt-10">
          <Link
            href="/apply"
            className="inline-block rounded-full bg-ns-gold px-10 py-3 text-sm font-medium uppercase tracking-widest text-ns-bg transition hover:bg-ns-cream"
          >
            Apply for consideration
          </Link>
        </div>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-ns-muted">
          No public profiles. No member directory. Contact details shared only after both
          people agree.
        </p>
      </section>

      <section className="border-t border-ns-border bg-ns-surface py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-heading text-3xl text-ns-cream">How it works</h2>
          <ol className="mt-10 grid list-none gap-6 md:grid-cols-2 lg:grid-cols-5">
            {howItWorks.map((step, index) => (
              <li
                key={step.title}
                className="rounded border border-ns-border bg-ns-bg/50 p-6"
              >
                <span className="text-xs text-ns-gold">{index + 1}</span>
                <h3 className="font-heading mt-3 text-lg text-ns-cream">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ns-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-ns-border py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="font-heading text-3xl text-ns-cream">Membership</h2>
          <p className="mt-6 text-base leading-relaxed text-ns-muted">
            Membership is paid and by invitation. Fees and service terms are provided
            before you decide whether to activate. No payment is collected with your
            application.
          </p>
          {/* TODO(counsel): Replace placeholder with counsel-approved membership fees and terms. */}
        </div>
      </section>

      <section className="border-t border-ns-border bg-ns-surface py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="font-heading text-3xl text-ns-cream">Purpose</h2>
          <p className="mt-6 text-base leading-relaxed text-ns-muted">
            Native Society is for professional and social connections. It is not a dating
            or romantic matchmaking service.
          </p>
        </div>
      </section>
    </div>
  );
}