"use client";

import { useEffect, useState } from "react";
import type { Report, ReportStatus } from "@/types/domain";

export function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);

  const load = async () => {
    const res = await fetch("/api/admin/reports");
    const json = (await res.json()) as { reports: Report[] };
    setReports(json.reports);
  };

  useEffect(() => {
    void load();
  }, []);

  const resolve = async (reportId: string, status: ReportStatus) => {
    await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, status }),
    });
    await load();
  };

  return (
    <div>
      <h1 className="font-heading text-4xl">Reports</h1>
      <ul className="mt-8 space-y-4">
        {reports.map((report) => (
          <li
            key={report.id}
            className="rounded border border-ns-border bg-ns-surface p-5 text-sm"
          >
            <p className="font-heading text-lg">
              {report.reason} · {report.status}
            </p>
            <p className="mt-2 text-ns-muted">{report.detail}</p>
            <p className="mt-1 text-xs text-ns-muted">
              Reporter {report.reporterId} → {report.reportedUserId}
            </p>
            {report.status === "open" && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => void resolve(report.id, "dismissed")}
                  className="rounded-full border border-ns-border px-3 py-1 text-[10px] uppercase tracking-widest"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => void resolve(report.id, "escalated")}
                  className="rounded-full border border-ns-gold px-3 py-1 text-[10px] uppercase tracking-widest text-ns-gold"
                >
                  Escalate
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}