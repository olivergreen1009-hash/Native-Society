import Link from "next/link";

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/safety", label: "Safety" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-ns-border bg-ns-surface">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 md:py-20">
        <div className="h-px w-16 bg-ns-gold/60" />
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto] md:gap-14">
          <div>
            <p className="font-heading text-2xl text-ns-cream">Native Society</p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ns-muted">
              New York Born. Introduced Well. Application-only membership for adults
              who grew up in the city and attended independent or boarding schools—no
              public profiles, no casual browsing, no unsolicited messages.
            </p>
          </div>
          <div className="text-base md:text-right">
            <p className="font-heading text-ns-cream">Founded by Oliver Estreich</p>
            <p className="mt-2 text-ns-muted">New York City</p>
            <Link
              href="/login"
              className="mt-5 inline-block font-heading text-ns-gold transition hover:text-ns-cream"
            >
              Member sign in
            </Link>
          </div>
        </div>
        <nav
          className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-ns-border pt-8 text-base"
          aria-label="Legal and contact"
        >
          {legal.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ns-muted transition hover:text-ns-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-ns-border px-5 py-5 text-center text-sm text-ns-muted sm:px-8">
        © 2026 Native Society
      </div>
    </footer>
  );
}