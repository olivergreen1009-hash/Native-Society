import { SiteHeader } from "@/components/site-header";

export default function MemberShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader variant="member" />
      <main className="min-h-screen pt-24 pb-16">{children}</main>
    </>
  );
}