import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ApplyForm } from "@/components/apply-form";

export default function ApplyPage() {
  return (
    <>
      <SiteHeader variant="public" />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-28 md:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Membership</p>
        <h1 className="font-heading mt-4 text-4xl">Application</h1>
        <p className="mt-4 text-sm leading-relaxed text-ns-muted">
          For adults raised in New York City with independent or boarding school
          backgrounds. All fields are reviewed by our admissions team.
        </p>
        <ApplyForm />
      </main>
      <SiteFooter />
    </>
  );
}