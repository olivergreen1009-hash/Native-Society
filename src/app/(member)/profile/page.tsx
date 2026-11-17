import { ProfileEditor } from "@/components/profile-editor";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">You</p>
      <h1 className="font-heading mt-3 text-4xl">Profile</h1>
      <p className="mt-4 text-sm text-ns-muted">
        Visible only to approved members. Photo upload will connect to private storage
        in a later phase.
      </p>
      <ProfileEditor />
    </div>
  );
}