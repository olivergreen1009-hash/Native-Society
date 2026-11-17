"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfileEditor } from "@/components/profile-editor";
import type { NotificationPreferences, User } from "@/types/domain";

type Tab = "profile" | "discovery" | "notifications" | "blocked" | "danger";

export function AccountSettings() {
  const [tab, setTab] = useState<Tab>("profile");
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] =
    useState<NotificationPreferences | null>(null);
  const [blocks, setBlocks] = useState<
    Array<{ block: { id: string; blockedId: string }; profile: { firstName: string } | null }>
  >([]);
  const [message, setMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const loadAccount = async () => {
    const res = await fetch("/api/account");
    if (!res.ok) return;
    const json = (await res.json()) as {
      user: User;
      notifications: NotificationPreferences;
    };
    setUser(json.user);
    setNotifications(json.notifications);
  };

  const loadBlocks = async () => {
    const res = await fetch("/api/account/blocks");
    if (!res.ok) return;
    const json = (await res.json()) as { blocks: typeof blocks };
    setBlocks(json.blocks);
  };

  useEffect(() => {
    void loadAccount();
  }, []);

  useEffect(() => {
    if (tab === "blocked") void loadBlocks();
  }, [tab]);

  const patchAccount = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      await loadAccount();
      setMessage("Saved.");
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "discovery", label: "Discovery" },
    { id: "notifications", label: "Notifications" },
    { id: "blocked", label: "Blocked" },
    { id: "danger", label: "Account" },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-ns-border pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              setMessage("");
            }}
            className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest ${
              tab === t.id
                ? "bg-ns-gold text-ns-bg"
                : "border border-ns-border text-ns-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {message && <p className="mt-4 text-sm text-ns-gold">{message}</p>}

      {tab === "profile" && (
        <div className="mt-8">
          <p className="text-sm text-ns-muted">
            Edit the same fields as onboarding.{" "}
            <Link href="/profile" className="text-ns-gold hover:underline">
              Open profile page
            </Link>
          </p>
          <ProfileEditor />
        </div>
      )}

      {tab === "discovery" && user && (
        <div className="mt-8 rounded border border-ns-border bg-ns-surface p-6">
          <h2 className="font-heading text-xl">Pause discovery</h2>
          <p className="mt-3 text-sm text-ns-muted">
            While paused, you will not appear in new weekly batches and will not
            receive new introductions. Matches and messages stay available.
          </p>
          <label className="mt-6 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={user.pauseDiscovery}
              onChange={(e) =>
                void patchAccount({ pauseDiscovery: e.target.checked })
              }
              className="h-4 w-4"
            />
            Pause new introductions
          </label>
        </div>
      )}

      {tab === "notifications" && notifications && (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-ns-muted">
            Mock preferences (stored in memory until email/in-app providers ship).
          </p>
          {(
            [
              ["emailNewIntroductions", "Email — new introductions"],
              ["emailMutualMatches", "Email — mutual matches"],
              ["emailMessages", "Email — messages"],
              ["inAppNewIntroductions", "In-app — new introductions"],
              ["inAppMutualMatches", "In-app — mutual matches"],
              ["inAppMessages", "In-app — messages"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-4 text-sm">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(e) => {
                  const next = { ...notifications, [key]: e.target.checked };
                  setNotifications(next);
                  void patchAccount({ notifications: next });
                }}
              />
            </label>
          ))}
        </div>
      )}

      {tab === "blocked" && (
        <div className="mt-8 space-y-3">
          {blocks.length === 0 ? (
            <p className="text-sm text-ns-muted">No blocked members.</p>
          ) : (
            blocks.map(({ block, profile }) => (
              <div
                key={block.id}
                className="flex items-center justify-between rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm"
              >
                <span>{profile?.firstName ?? block.blockedId}</span>
                <button
                  type="button"
                  onClick={async () => {
                    await fetch(`/api/account/blocks?id=${encodeURIComponent(block.id)}`, {
                      method: "DELETE",
                    });
                    await loadBlocks();
                  }}
                  className="text-xs uppercase tracking-widest text-ns-gold"
                >
                  Unblock
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "danger" && user && (
        <div className="mt-8 rounded border border-red-900/40 bg-ns-surface p-6">
          <h2 className="font-heading text-xl text-red-200/90">Delete account</h2>
          {user.accountStatus === "pending_deletion" ? (
            <div className="mt-4 text-sm text-ns-muted">
              <p>Deletion request pending (demo). You may cancel below.</p>
              <button
                type="button"
                onClick={() => void patchAccount({ cancelDeletion: true })}
                className="mt-4 rounded-full border border-ns-gold px-6 py-2 text-xs uppercase tracking-widest text-ns-gold"
              >
                Cancel deletion request
              </button>
            </div>
          ) : (
            <>
              <p className="mt-3 text-sm text-ns-muted">
                Type <strong className="text-ns-cream">DELETE</strong> to request
                account removal. In production, admissions would complete this
                manually.
              </p>
              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="mt-4 w-full rounded border border-ns-border bg-ns-bg px-4 py-3 text-sm"
                placeholder="DELETE"
              />
              <button
                type="button"
                disabled={deleteConfirm !== "DELETE"}
                onClick={() => void patchAccount({ requestDeletion: true })}
                className="mt-4 rounded-full bg-red-900/60 px-6 py-2 text-xs uppercase tracking-widest text-ns-cream disabled:opacity-40"
              >
                Request deletion
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}