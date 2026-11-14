"use client";

import { useEffect, useState } from "react";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";
import { getIntroductions } from "@/lib/client-store";
import { DEMO_MEMBER, societyProfiles } from "@/lib/sample-data";
import type { IntroductionRequest } from "@/lib/types";

export default function IntroductionsPage() {
  const [items, setItems] = useState<IntroductionRequest[]>([]);

  useEffect(() => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
    const session = match
      ? decodeSession(decodeURIComponent(match.split("=")[1] ?? ""))
      : null;
    const memberId = session?.userId ?? DEMO_MEMBER.id;
    setItems(getIntroductions().filter((i) => i.memberId === memberId));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Introductions</p>
      <h1 className="font-heading mt-3 text-4xl text-ns-cream">Your requests</h1>
      <p className="mt-4 text-sm text-ns-muted">
        Status updates appear here once curators advance your request.
      </p>

      {items.length === 0 ? (
        <p className="mt-12 rounded border border-ns-border bg-ns-surface p-8 text-sm text-ns-muted">
          No introduction requests yet. Visit your gallery when you are ready.
        </p>
      ) : (
        <ul className="mt-10 space-y-4">
          {items.map((item) => {
            const profile = societyProfiles.find((p) => p.id === item.profileId);
            return (
              <li
                key={item.id}
                className="rounded border border-ns-border bg-ns-surface p-6"
              >
                <p className="font-heading text-xl text-ns-cream">
                  {profile?.firstName ?? "Member"} · {statusLabel(item.status)}
                </p>
                <p className="mt-2 text-xs text-ns-muted">
                  Submitted {new Date(item.createdAt).toLocaleString()}
                </p>
                <p className="mt-3 text-sm text-ns-muted">{item.message}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function statusLabel(status: IntroductionRequest["status"]): string {
  switch (status) {
    case "pending":
      return "Awaiting curator";
    case "mutual_confirmed":
      return "Mutual interest confirmed";
    case "coordinated":
      return "Coordination in progress";
    case "introduced":
      return "Introduction facilitated";
    default:
      return status;
  }
}
