import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ns-border bg-ns-surface py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 text-sm text-ns-muted md:grid-cols-3 md:px-8">
        <div>
          <p className="font-heading text-lg text-ns-cream">Native Society</p>
          <p className="mt-3 max-w-sm leading-relaxed">
            A private, founder-led introduction service for people with substantive ties
            to New York real estate and hospitality.
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
          <Link href="/contact" className="hover:text-ns-cream">
            Contact
          </Link>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ns-gold">Membership</p>
          <p className="mt-3 leading-relaxed">
            Membership is paid and by invitation. No payment is collected with your
            application.
          </p>
          <Link href="/apply" className="mt-4 inline-block text-ns-gold hover:underline">
            Apply for consideration →
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-5 text-center text-xs text-ns-muted md:px-8">
        © {new Date().getFullYear()} Native Society. All rights reserved.
      </p>
    </footer>
  );
}