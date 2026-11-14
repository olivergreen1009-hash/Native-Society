import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";

export const instant = false;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<header className="fixed top-0 z-50 h-16 w-full border-b border-ns-border bg-[#0c0c0c]/85" />}>
        <SiteHeader variant="app" />
      </Suspense>
      <main className="min-h-screen bg-ns-bg pt-24 pb-16">{children}</main>
    </>
  );
}
