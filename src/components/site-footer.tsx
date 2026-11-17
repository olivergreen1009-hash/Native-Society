import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ns-border bg-ns-surface py-10 md:py-12">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 text-sm text-ns-muted md:grid-cols-3 md:gap-8 md:px-8">
        <div>
          <p className="font-heading text-lg text-ns-cream">Native Society</p>
          <p className="mt-2 max-w-xs leading-relaxed md:mt-3">
            Private introductions for adults raised in New York City with
            independent and boarding school roots.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-ns-gold">Legal</p>
          <Link href="/privacy" className="hover:text-ns-cream">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ns-cream">
            Terms
          </Link>
          <Link href="/safety" className="hover:text-ns-cream">
            Safety
          </Link>
          <Link href="/contact" className="hover:text-ns-cream">
            Contact
          </Link>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ns-gold">
            Membership
          </p>
          <p className="mt-2 leading-relaxed md:mt-3">
            Admission is human-reviewed. Apply once; we respond privately.
          </p>
          <Link
            href="/apply"
            className="mt-3 inline-flex min-h-11 items-center text-ns-gold hover:underline md:mt-4"
          >
            Begin application →
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-5 text-center text-xs text-ns-muted md:mt-10 md:px-8">
        © {new Date().getFullYear()} Native Society. All rights reserved.
      </p>
    </footer>
  );
}