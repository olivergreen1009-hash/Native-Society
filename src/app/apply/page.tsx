import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ApplicationForm } from "@/components/application-form";
import { ADMISSION_AGE_COPY } from "@/lib/application-options";

export default function ApplyPage() {
  return (
    <>
      <SiteHeader variant="public" />
      <main className="mx-auto max-w-2xl px-5 pb-12 pt-20 md:max-w-3xl md:px-8 md:pb-20 md:pt-28">
        <p className="text-xs uppercase tracking-[0.35em] text-ns-gold">
          Application only · New York
        </p>
        <h1 className="font-heading mt-2 text-3xl text-ns-cream md:mt-4 md:text-4xl">
          Application
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ns-muted md:mt-4 md:text-base">
          For adults raised in New York City with independent or boarding school
          backgrounds. Every field is reviewed by our admissions team.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ns-muted">
          {ADMISSION_AGE_COPY} Membership is paid. Billing starts only after approval and
          a confirmed reciprocal pool.
        </p>
        <ApplicationForm />
      </main>
      <SiteFooter />
    </>
  );
}