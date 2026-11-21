import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ns-border bg-ns-surface py-8 md:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 text-sm text-ns-muted sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p className="font-heading text-base text-ns-cream">Native Society</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/privacy" className="hover:text-ns-cream">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ns-cream">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-ns-cream">
            Contact
          </Link>
          <Link href="/apply" className="text-ns-gold hover:underline">
            Apply
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-6 max-w-6xl px-5 text-center text-xs text-ns-muted md:px-8">
        © {new Date().getFullYear()} Native Society. All rights reserved.
      </p>
    </footer>
  );
}