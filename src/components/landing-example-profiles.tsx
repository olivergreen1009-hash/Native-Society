import Image from "next/image";

const samples = [
  {
    id: "sample-a",
    name: "Alexandra",
    age: 32,
    neighborhood: "Upper East Side",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  },
  {
    id: "sample-b",
    name: "James",
    age: 35,
    neighborhood: "West Village",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  },
  {
    id: "sample-c",
    name: "Elena",
    age: 29,
    neighborhood: "Brooklyn Heights",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
  },
  {
    id: "sample-d",
    name: "Michael",
    age: 38,
    neighborhood: "Upper West Side",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  },
];

/** Illustrative only — not live member profiles. */
export function LandingExampleProfiles() {
  return (
    <section className="border-t border-ns-border py-10 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2 className="font-heading text-2xl md:text-3xl">Illustrative members</h2>
        <p className="mt-2 max-w-lg text-sm leading-snug text-ns-muted md:mt-3 md:leading-relaxed">
          Sample presentation only. Approved members see a small weekly selection—not
          a public gallery.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:mt-8 md:gap-4">
          {samples.map((profile) => (
            <article
              key={profile.id}
              className="overflow-hidden rounded border border-ns-border bg-ns-surface"
            >
              <div className="relative aspect-[4/3] overflow-hidden md:aspect-square">
                <Image
                  src={profile.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="px-2.5 py-2 md:px-3 md:py-3">
                <p className="font-heading text-sm md:text-base">
                  {profile.name} · {profile.age}
                </p>
                <p className="text-[11px] text-ns-muted md:text-xs">
                  {profile.neighborhood}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}