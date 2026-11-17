"use client";

import { useEffect, useState } from "react";
import type { Application, ApplicationStatus } from "@/types/domain";

const actions: ApplicationStatus[] = [
  "approved",
  "declined",
  "more_info_needed",
  "pending",
];

export function AdminApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("pending");
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

  return (
    <div>
      <h1 className="font-heading text-4xl">Application queue</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "pending", "more_info_needed", "approved", "declined"] as const).map(
          (f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest ${
                filter === f ? "bg-ns-gold text-ns-bg" : "border border-ns-border text-ns-muted"
              }`}
            >
              {f}
            </button>
          ),
        )}
      </div>
      <ul className="mt-8 space-y-4">
        {apps.map((app) => (
          <li
            key={app.id}
            className="rounded border border-ns-border bg-ns-surface p-5 text-sm"
          >
            <p className="font-heading text-lg">
              {app.fullName} · {app.email}
            </p>
            <p className="mt-1 text-ns-muted">
              {app.schoolHistory} — {app.status}
            </p>
            {app.intake && (
              <p className="mt-2 text-xs text-ns-muted">
                {app.intake.gender}
                {app.intake.genderSelfDescribe
                  ? ` (${app.intake.genderSelfDescribe})`
                  : ""}{" "}
                · seeks {app.intake.seekingGenders.join(", ")} · ages{" "}
                {app.intake.seekingAgeMin}–{app.intake.seekingAgeMax} ·{" "}
                {app.intake.locationPreference}
              </p>
            )}
            <textarea
              className="mt-3 w-full rounded border border-ns-border bg-ns-bg px-3 py-2 text-xs"
              placeholder="Note to applicant (optional)"
              value={notes[app.id] ?? app.adminNotes}
              onChange={(e) =>
                setNotes((n) => ({ ...n, [app.id]: e.target.value }))
              }
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {actions
                .filter((a) => a !== app.status)
                .map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void act(app.id, status)}
                    className="rounded-full border border-ns-gold px-3 py-1 text-[10px] uppercase tracking-widest text-ns-gold"
                  >
                    {status.replace(/_/g, " ")}
                  </button>
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}