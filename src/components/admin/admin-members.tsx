"use client";

import { useEffect, useState } from "react";
import type { Profile, User } from "@/types/domain";

export function AdminMembers() {
  const [rows, setRows] = useState<
    Array<{ member: User; profile: Profile | null }>
  >([]);
  const [diagnosticsFor, setDiagnosticsFor] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<Record<string, unknown> | null>(
    null,
  );

  const load = async () => {
    const res = await fetch("/api/admin/members");
    const json = (await res.json()) as { members: typeof rows };
    setRows(json.members);
  };

  useEffect(() => {
    void load();
  }, []);

  const patchMember = async (
    userId: string,
    body: Record<string, unknown>,
  ) => {
    await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...body }),
    });
    await load();
  };

  const loadDiagnostics = async (userId: string) => {
    setDiagnosticsFor(userId);
    const res = await fetch(`/api/admin/diagnostics/${userId}`);
    const json = await res.json();
    setDiagnostics(json as Record<string, unknown>);
  };

  return (
    <div>
      <h1 className="font-heading text-4xl">Member controls</h1>
      <ul className="mt-8 space-y-4">
        {rows.map(({ member, profile }) => (
          <li
            key={member.id}
            className="rounded border border-ns-border bg-ns-surface p-5 text-sm"
          >
            <p className="font-heading text-lg">
              {profile?.firstName ?? member.email}
            </p>
            <p className="text-ns-muted">
              {member.email} · {member.accountStatus}
              {member.pauseDiscovery ? " · discovery paused" : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  void patchMember(member.id, {
                    pauseDiscovery: !member.pauseDiscovery,
                  })
                }
                className="rounded-full border border-ns-border px-3 py-1 text-[10px] uppercase tracking-widest"
              >
                {member.pauseDiscovery ? "Unpause" : "Pause"} discovery
              </button>
              <button
                type="button"
                onClick={() =>
                  void patchMember(member.id, { accountStatus: "suspended" })
                }
                className="rounded-full border border-ns-border px-3 py-1 text-[10px] uppercase tracking-widest"
              >
                Suspend
              </button>
              <button
                type="button"
                onClick={() =>
                  void patchMember(member.id, { accountStatus: "active" })
                }
                className="rounded-full border border-ns-gold px-3 py-1 text-[10px] uppercase tracking-widest text-ns-gold"
              >
                Reinstate
              </button>
              <button
                type="button"
                onClick={() =>
                  void patchMember(member.id, { accountStatus: "removed" })
                }
                className="rounded-full border border-red-900/50 px-3 py-1 text-[10px] uppercase tracking-widest text-red-300"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => void loadDiagnostics(member.id)}
                className="rounded-full border border-ns-gold px-3 py-1 text-[10px] uppercase tracking-widest text-ns-gold"
              >
                Diagnostics
              </button>
            </div>
          </li>
        ))}
      </ul>
      {diagnosticsFor && diagnostics && (
        <div className="mt-8 rounded border border-ns-gold/30 bg-ns-bg p-5 text-xs text-ns-muted">
          <p className="text-ns-gold">Diagnostics for {diagnosticsFor}</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}