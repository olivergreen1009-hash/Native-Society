import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ns-border bg-ns-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-heading text-2xl text-ns-cream">Native Society</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ns-muted">
            New York Born. Personally Connected. An invitation-only club for
            adults who grew up in the city and its schools—and want courtship
            without the noise.
          </p>
        </div>
        <div className="text-sm text-ns-muted">
          <p className="text-ns-cream">Founded by Oliver Estreich</p>
          <p className="mt-1">Manhattan · Brooklyn · By referral only</p>
          <Link href="/login" className="mt-4 inline-block text-ns-gold hover:underline">
            Member entrance
          </Link>
        </div>
      </div>
      <div className="border-t border-ns-border py-4 text-center text-xs text-ns-muted">
        © 2026 Native Society. All introductions are
        confidential.
      </div>
    </footer>
  );
}
