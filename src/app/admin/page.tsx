"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DEMO_MEMBER,
  members,
  societyProfiles,
} from "@/lib/sample-data";
import { ADMIN_QUESTIONNAIRE_SCORING } from "@/lib/questionnaire-schema";
import {
  getCurationMap,
  getIntroductions,
  getMemberNotes,
  refreshMemberGallery,
  setMemberGallery,
  setMemberNote,
  updateIntroduction,
} from "@/lib/client-store";
import type { IntroductionRequest } from "@/lib/types";

const statusLabels: Record<IntroductionRequest["status"], string> = {
  pending: "Pending review",
  mutual_confirmed: "Mutual interest confirmed",
  coordinated: "Coordination in progress",
  introduced: "Introduction facilitated",
};

export default function AdminPage() {
  const [tab, setTab] = useState<"queue" | "gallery" | "notes">("queue");
  const [memberId, setMemberId] = useState(DEMO_MEMBER.id);
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [intros, setIntros] = useState<IntroductionRequest[]>([]);
  const [note, setNote] = useState("");

  const reload = () => {
    const map = getCurationMap();
    setSelected(map[memberId] ?? []);
    setIntros(getIntroductions());
    setNote(getMemberNotes()[memberId] ?? "");
  };

  useEffect(() => {
    reload();
  }, [memberId]);

  const toggle = (profileId: string) => {
    setSelected((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId],
    );
  };

  const saveGallery = () => {
    setMemberGallery(memberId, selected);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const doRefresh = () => {
    const next = refreshMemberGallery(memberId);
    setSelected(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveNote = () => {
    setMemberNote(memberId, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const pending = intros.filter((i) => i.status === "pending");

  return (
    <div className="mx-auto max-w-5xl px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Founder console</p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-heading text-4xl text-ns-cream">Admin</h1>
        <Link href="/admin/emails" className="text-sm text-ns-gold hover:underline">
          Onboarding email templates →
        </Link>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["queue", "Introduction queue"],
            ["gallery", "Gallery curation"],
            ["notes", "Member notes"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest ${
              tab === key
                ? "border-ns-gold bg-ns-gold/10 text-ns-cream"
                : "border-ns-border text-ns-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "queue" && (
        <section className="mt-10 space-y-4">
          <p className="text-sm text-ns-muted">
            Review pending requests, confirm mutual interest, and coordinate introductions.
          </p>
          {pending.length === 0 ? (
            <p className="rounded border border-ns-border bg-ns-surface p-6 text-sm text-ns-muted">
              No pending introduction requests.
            </p>
          ) : (
            pending.map((item) => {
              const member = members.find((m) => m.id === item.memberId);
              const profile = societyProfiles.find((p) => p.id === item.profileId);
              return (
                <article
                  key={item.id}
                  className="rounded border border-ns-border bg-ns-surface p-6"
                >
                  <p className="font-heading text-xl text-ns-cream">
                    {member?.name ?? "Member"} → {profile?.firstName ?? "Profile"}
                  </p>
                  <p className="mt-1 text-xs text-ns-muted">
                    {statusLabels[item.status]} · {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-3 text-sm text-ns-muted">{item.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateIntroduction(item.id, { status: "mutual_confirmed" });
                        reload();
                      }}
                      className="rounded-full border border-ns-gold px-4 py-2 text-xs uppercase tracking-widest text-ns-gold"
                    >
                      Mark mutual interest
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateIntroduction(item.id, {
                          status: "coordinated",
                          coordinatedAt: new Date().toISOString(),
                        });
                        reload();
                      }}
                      className="rounded-full bg-ns-gold px-4 py-2 text-xs uppercase tracking-widest text-ns-bg"
                    >
                      Coordinate introduction
                    </button>
                  </div>
                </article>
              );
            })
          )}
          <details className="mt-8 rounded border border-ns-border bg-ns-bg/60 p-4">
            <summary className="cursor-pointer text-xs uppercase tracking-widest text-ns-gold">
              Internal questionnaire scoring (concierge only)
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ns-muted">
              {ADMIN_QUESTIONNAIRE_SCORING}
            </p>
          </details>
        </section>
      )}

      {tab === "gallery" && (
        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="text-xs uppercase tracking-widest text-ns-muted">Member</label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="mt-2 w-full max-w-md rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream"
              >
                {members
                  .filter((m) => m.role === "member")
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
              </select>
            </div>
            <button
              type="button"
              onClick={doRefresh}
              className="rounded-full border border-ns-gold px-5 py-2 text-xs uppercase tracking-widest text-ns-gold"
            >
              Refresh / swap profiles
            </button>
          </div>
          <ul className="mt-8 space-y-3">
            {societyProfiles.map((profile) => {
              const checked = selected.includes(profile.id);
              return (
                <li
                  key={profile.id}
                  className={`flex cursor-pointer items-start gap-4 rounded border p-4 transition ${
                    checked ? "border-ns-gold bg-ns-surface" : "border-ns-border bg-ns-bg"
                  }`}
                  onClick={() => toggle(profile.id)}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(profile.id)}
                    className="mt-1 accent-[#c9a96e]"
                  />
                  <div>
                    <p className="font-heading text-lg text-ns-cream">
                      {profile.firstName} · {profile.age}
                    </p>
                    <p className="text-xs text-ns-muted">
                      {profile.neighborhood} · {profile.conciergeNote}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={saveGallery}
            className="mt-8 rounded-full bg-ns-gold px-8 py-3 text-sm uppercase tracking-widest text-ns-bg hover:bg-ns-cream"
          >
            Save gallery
          </button>
        </section>
      )}

      {tab === "notes" && (
        <section className="mt-10">
          <label className="text-xs uppercase tracking-widest text-ns-muted">
            Private notes — {members.find((m) => m.id === memberId)?.name}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={6}
            className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream"
            placeholder="Concierge-only notes for this member…"
          />
          <button
            type="button"
            onClick={saveNote}
            className="mt-4 rounded-full bg-ns-gold px-8 py-3 text-sm uppercase tracking-widest text-ns-bg"
          >
            Save notes
          </button>
        </section>
      )}

      {saved && <p className="mt-4 text-sm text-ns-gold">Saved.</p>}
    </div>
  );
}
