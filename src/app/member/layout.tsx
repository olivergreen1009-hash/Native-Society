import { Suspense } from "react";
import { MemberNav } from "@/components/member-nav";
import { SiteHeader } from "@/components/site-header";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<header className="fixed top-0 z-50 h-16 w-full border-b border-ns-border bg-[#0c0c0c]/85" />}>
        <SiteHeader variant="member" />
      </Suspense>
      <main className="min-h-screen bg-ns-bg pb-16 pt-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <MemberNav />
          {children}
        </div>
      </main>
    </>
  );
}
