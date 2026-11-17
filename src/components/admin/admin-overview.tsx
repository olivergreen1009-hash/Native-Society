"use client";

import { useEffect, useState } from "react";

type Analytics = {
  applicationsByStatus: Record<string, number>;
  applicationTotal: number;
  memberTotal: number;
  activeApprovedMembers: number;
  receivingIntroductions: number;
  matchCount: number;
  messageCount: number;
  openReports: number;
};

export function AdminOverview() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    void fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((json) => setData(json as Analytics));
  }, []);

  if (!data) {
    return <p className="text-ns-muted">Loading dashboard…</p>;
  }

  return (
    <div>
      <h1 className="font-heading text-4xl">Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Applications" value={data.applicationTotal} />
        <Stat label="Active members" value={data.activeApprovedMembers} />
        <Stat label="Open reports" value={data.openReports} />
        <Stat label="Matches" value={data.matchCount} />
        <Stat label="Messages" value={data.messageCount} />
        <Stat label="Receiving intros" value={data.receivingIntroductions} />
      </div>
      <div className="mt-10 rounded border border-ns-border bg-ns-surface p-6">
        <h2 className="font-heading text-xl">Applications by status</h2>
        <ul className="mt-4 space-y-2 text-sm text-ns-muted">
          {Object.entries(data.applicationsByStatus).map(([status, count]) => (
            <li key={status} className="flex justify-between gap-4">
              <span className="uppercase tracking-widest text-ns-gold">
                {status.replace(/_/g, " ")}
              </span>
              <span>{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-ns-border bg-ns-surface p-5">
      <p className="text-xs uppercase tracking-widest text-ns-muted">{label}</p>
      <p className="font-heading mt-2 text-3xl text-ns-gold">{value}</p>
    </div>
  );
}