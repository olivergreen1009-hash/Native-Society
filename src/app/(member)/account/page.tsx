import { AccountSettings } from "@/components/account-settings";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Settings</p>
      <h1 className="font-heading mt-3 text-4xl">Account</h1>
      <p className="mt-4 text-sm text-ns-muted">
        Profile, discovery pause, notifications, blocks, and deletion request.
      </p>
      <AccountSettings />
    </div>
  );
}