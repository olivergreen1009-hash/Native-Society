import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function LegalDocument({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader variant="public" />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
        <h1 className="font-heading text-4xl">{title}</h1>
        <div className="prose prose-invert mt-8 space-y-4 text-sm leading-relaxed text-ns-muted">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}