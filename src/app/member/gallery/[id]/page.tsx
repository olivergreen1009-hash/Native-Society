import { Suspense } from "react";
import { ProfileDetailClient } from "./profile-detail-client";

export default function ProfileDetailPage() {
  return (
    <Suspense fallback={<p className="px-5 text-ns-muted">Loading profile…</p>}>
      <ProfileDetailClient />
    </Suspense>
  );
}
