"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";
import { getIntroductions } from "@/lib/client-store";
import { getMemberGalleryProfile } from "@/lib/member-gallery-profiles";
import { DEMO_MEMBER } from "@/lib/sample-data";
import type { SocietyProfile } from "@/lib/types";

type IntroRow = {
  id: string;
  profileId: string;
  message: string;
  status: "pending" | "mutual_confirmed";
  createdAt: string;
  profile?: SocietyProfile;
};

export default function IntroductionsPage() {
  const [items, setItems] = useState<IntroRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/member/introductions");
    setLoading(false);
    if (!res.ok) return;
    const json = (await res.json()) as { introductions: IntroRow[] };
    const apiItems = json.introductions ?? [];
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
    const session = match
      ? decodeSession(decodeURIComponent(match.split("=")[1] ?? ""))
      : null;
    const memberId = session?.userId ?? DEMO_MEMBER.id;
    const local = getIntroductions()
      .filter((i) => i.memberId === memberId)
      .map((i) => {
        const profile = getMemberGalleryProfile(i.profileId);
        return {
          id: i.id,
          profileId: i.profileId,
          message: i.message,
          status:
            i.status === "mutual_confirmed" ||
            i.status === "coordinated" ||
            i.status === "introduced"
              ? ("mutual_confirmed" as const)
              : ("pending" as const),
          createdAt: i.createdAt,
          profile,
        };
      });
    const byId = new Set(apiItems.map((i) => i.id));
    setItems([...apiItems, ...local.filter((l) => !byId.has(l.id))]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Introductions</p>
      <h1 className="font-heading mt-3 text-4xl text-ns-cream">Your requests</h1>
      <p className="mt-4 text-sm text-ns-muted">
        Interest you&apos;ve expressed appears here until mutual confirmation.
      </p>

      {loading ? (
        <p className="mt-12 text-sm text-ns-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-12 rounded border border-ns-border bg-ns-surface p-8 text-sm text-ns-cream">
          No requests yet.{" "}
          <Link href="/member/gallery" className="text-ns-gold underline">
            Open this week&apos;s batch
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-10 space-y-4">
          {items.map((item) => {
            const profile = item.profile;
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
                {item.message ? (
                  <p className="mt-3 text-sm text-ns-cream">{item.message}</p>
                ) : null}
                {item.status === "mutual_confirmed" && profile?.favoriteNycDetail ? (
                  <p className="mt-3 border-t border-ns-border pt-3 text-sm text-ns-muted">
                    <span className="text-xs uppercase tracking-widest text-ns-gold">
                      Favorite NYC detail
                    </span>
                    <span className="mt-1 block text-ns-cream">
                      {profile.favoriteNycDetail}
                    </span>
                  </p>
                ) : null}
                {profile ? (
                  <Link
                    href={`/member/gallery/${profile.id}`}
                    className="mt-4 inline-block text-xs text-ns-gold hover:underline"
                  >
                    View profile
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function statusLabel(status: IntroRow["status"]): string {
  return status === "mutual_confirmed"
    ? "Mutual interest confirmed"
    : "Awaiting response";
}