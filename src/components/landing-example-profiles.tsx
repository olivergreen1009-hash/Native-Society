import Image from "next/image";
import { landingExampleProfiles } from "@/lib/landing-example-profiles";

/** Illustrative only — not live member profiles. */
export function LandingExampleProfiles() {
  return (
    <section
      className="border-t border-ns-border py-10 md:py-24"
      aria-labelledby="landing-examples-heading"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Examples only</p>
        <h2
          id="landing-examples-heading"
          className="font-heading mt-2 text-2xl md:mt-3 md:text-3xl"
        >
          Illustrative members
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-snug text-ns-muted md:mt-3 md:leading-relaxed">
          Sample presentation only—not real members. Approved members see a small weekly
          selection, not a public gallery.
        </p>
        <ul
          className="mt-4 grid list-none grid-cols-2 gap-2.5 sm:grid-cols-3 md:mt-8 md:gap-4 lg:grid-cols-5"
          aria-label="Illustrative example member cards"
        >
          {landingExampleProfiles.map((profile) => (
            <li key={profile.id}>
              <article
                className="overflow-hidden rounded border border-ns-border bg-ns-surface"
                aria-label={`Example profile: ${profile.firstName}, illustrative only`}
              >
                <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5] md:aspect-square">
                  <Image
                    src={profile.imageUrl}
                    alt=""
                    fill
                    className="object-cover object-[center_20%] sm:object-[center_18%] md:object-[center_20%]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <span className="absolute left-1.5 top-1.5 rounded border border-ns-gold/80 bg-ns-bg/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-ns-gold md:left-2 md:top-2 md:px-2 md:text-[11px]">
                    Example
                  </span>
                </div>
                <div className="min-h-[4.75rem] px-2.5 py-2 md:min-h-0 md:px-3 md:py-3">
                  <p className="font-heading text-sm text-ns-cream md:text-base">
                    {profile.firstName} · {profile.age}
                  </p>
                  <p className="text-[11px] leading-snug text-ns-muted md:text-xs">
                    {profile.neighborhood}
                  </p>
                  <p className="mt-0.5 text-balance text-[11px] leading-snug text-ns-gold [overflow-wrap:anywhere] md:mt-1 md:text-xs">
                    {profile.schoolLine}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}