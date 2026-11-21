import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ApplyForm } from "@/components/apply-form";

export default function ApplyPage() {
  return (
    <>
      <SiteHeader variant="public" />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-28 md:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Application</p>
        <h1 className="font-heading mt-4 text-4xl text-ns-cream">Apply for consideration</h1>
        <p className="mt-4 text-sm leading-relaxed text-ns-muted">
          Native Society serves people with substantive ties to New York real estate and
          hospitality. No payment is collected with your application.
        </p>
        <ApplyForm />
      </main>
      <SiteFooter />
    </>
  );
}