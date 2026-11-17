import { ProfileEditor } from "@/components/profile-editor";
import { SiteHeader } from "@/components/site-header";

export default function OnboardingProfilePage() {
  return (
    <>
      <SiteHeader variant="member" />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-28 md:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Onboarding</p>
        <h1 className="font-heading mt-3 text-4xl">Your profile</h1>
        <p className="mt-4 text-sm text-ns-muted">
          Complete the essentials before joining the weekly introduction cycle.
        </p>
        <ProfileEditor onboarding />
      </main>
    </>
  );
}