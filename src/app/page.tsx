import { LandingSections } from "@/components/landing-sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader variant="public" />
      <main className="bg-ns-bg">
        <LandingSections />
      </main>
      <SiteFooter />
    </>
  );
}