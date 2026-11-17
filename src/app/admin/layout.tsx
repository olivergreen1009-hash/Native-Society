import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense
        fallback={
          <header className="fixed top-0 z-50 h-16 w-full border-b border-ns-border bg-ns-bg/85" />
        }
      >
        <SiteHeader variant="member" />
      </Suspense>
      <main className="min-h-screen bg-ns-bg pb-16 pt-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <AdminNav />
          {children}
        </div>
      </main>
    </>
  );
}