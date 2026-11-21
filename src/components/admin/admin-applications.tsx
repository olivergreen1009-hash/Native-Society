"use client";

import { useEffect, useState } from "react";
import type { Application, ApplicationStatus } from "@/types/domain";
import type { MemberLifecycleState } from "@/types/society";

const statusFilters: (ApplicationStatus | "all")[] = [
  "all",
  "applied",
  "under_review",
  "more_info_needed",
  "qualified_waiting",
  "invited_to_activate",
  "declined",
];

const setMemberStateOptions: MemberLifecycleState[] = [
  "reviewed",
  "qualified_waiting",
  "invited_to_activate",
  "active",
  "paused",
  "closed",
];

export function AdminApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("applied");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    const url =
      filter === "all"
        ? "/api/admin/applications"
        : `/api/admin/applications?status=${filter}`;
    const res = await fetch(url);
    const json = (await res.json()) as { applications: Application[] };
    setApps(json.applications);
  };

  useEffect(() => {
    void load();
  }, [filter]);

  const act = async (appId: string, status: ApplicationStatus) => {
    await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: appId,
        status,
        adminNotes: notes[appId] ?? "",
      }),
    });
    await load();
  };

  const setMemberState = async (userId: string, memberLifecycleState: MemberLifecycleState) => {
    await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, memberLifecycleState }),
    });
  };

  return (
    <div>
      <h1 className="font-heading text-4xl">Applications</h1>
      <p className="mt-2 text-sm text-ns-muted">
        Review intake, qualify when introductions are plausible, invite to activate when
        ready. No payment is collected here.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest ${
              filter === f ? "bg-ns-gold text-ns-bg" : "border border-ns-border text-ns-muted"
            }`}
          >
            {f.replace(/_/g, " ")}
          </button>
        ))}
      </div>
      <ul className="mt-8 space-y-4">
        {apps.map((app) => (
          <li
            key={app.id}
            className="rounded border border-ns-border bg-ns-surface p-5 text-sm"
          >
            <p className="font-heading text-lg text-ns-cream">
              {app.fullName} · {app.email}
            </p>
            <p className="mt-1 text-ns-muted">Status: {app.status.replace(/_/g, " ")}</p>
            {app.rawData?.shareable && (
              <dl className="mt-4 grid gap-2 text-xs text-ns-muted md:grid-cols-2">
                <DetailRow
                  label="Industry connection"
                  value={app.rawData.shareable.industryConnection}
                />
                <DetailRow
                  label="Useful now"
                  value={app.rawData.shareable.introductionUsefulness}
                />
                <DetailRow
                  label="Founder-only context"
                  value={app.rawData.founderOnly.roleOwnershipDetail}
                  span
                />
              </dl>
            )}
            <textarea
              className="mt-3 w-full rounded border border-ns-border bg-ns-bg px-3 py-2 text-xs text-ns-cream"
              placeholder="Internal note"
              value={notes[app.id] ?? app.adminNotes}
              onChange={(e) =>
                setNotes((n) => ({ ...n, [app.id]: e.target.value }))
              }
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {(["under_review", "more_info_needed", "qualified_waiting", "invited_to_activate", "declined"] as ApplicationStatus[])
                .filter((s) => s !== app.status)
                .map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void act(app.id, status)}
                    className="rounded-full border border-ns-gold px-3 py-1 text-[10px] uppercase tracking-widest text-ns-gold"
                  >
                    Mark {status.replace(/_/g, " ")}
                  </button>
                ))}
            </div>
            {app.userId && (
              <MemberStateActions userId={app.userId} setMemberState={setMemberState} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailRow({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "md:col-span-2" : undefined}>
      <dt className="text-ns-gold">{label}</dt>
      <dd className="mt-1 text-ns-cream">{value}</dd>
    </div>
  );
}

function MemberStateActions({
  userId,
  setMemberState,
}: {
  userId: string;
  setMemberState: (id: string, s: MemberLifecycleState) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 border-t border-ns-border pt-3">
      <span className="w-full text-[10px] uppercase tracking-widest text-ns-muted">
        Linked member lifecycle
      </span>
      {setMemberStateOptions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => void setMemberState(userId, s)}
          className="rounded border border-ns-border px-2 py-1 text-[10px] text-ns-muted hover:text-ns-cream"
        >
          {s.replace(/_/g, " ")}
        </button>
      ))}
    </div>
  );
}