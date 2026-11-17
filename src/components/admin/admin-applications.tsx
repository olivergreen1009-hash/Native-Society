"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  formatSubmittedAt,
  highSchoolFromRow,
  occupationFromRow,
  summerFromRow,
  type SupabaseApplicationRow,
} from "@/lib/supabase-applications";

export function AdminApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState<SupabaseApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/applications/submissions");
      const json = (await res.json()) as {
        applications?: SupabaseApplicationRow[];
        error?: string;
        details?: string;
      };
      if (!res.ok) {
        const detail = json.details ? ` (${json.details})` : "";
        setError(json.error ? `${json.error}${detail}` : "Could not load applications.");
        setApplications([]);
        return;
      }
      setApplications(json.applications ?? []);
    } catch {
      setError("Could not load applications.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <h1 className="font-heading text-4xl text-ns-cream">Applications</h1>
      <p className="mt-2 text-sm text-ns-muted">
        Live submissions from Supabase{" "}
        <code className="text-ns-gold">public.applications</code>.
      </p>

      {loading && (
        <p className="mt-10 text-sm text-ns-muted" aria-live="polite">
          Loading applications…
        </p>
      )}

      {!loading && error && (
        <p className="mt-10 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="mt-10 rounded border border-ns-border bg-ns-surface p-10 text-center">
          <p className="font-heading text-xl text-ns-cream">No submissions yet</p>
          <p className="mt-3 text-sm text-ns-muted">
            New applications will appear here after the public form saves to Supabase.
          </p>
          <Link
            href="/apply"
            className="mt-6 inline-block text-sm text-ns-gold underline hover:text-ns-cream"
          >
            View public application form
          </Link>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded border border-ns-border bg-ns-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-ns-border text-xs uppercase tracking-widest text-ns-gold">
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="hidden px-4 py-3 font-normal md:table-cell">DOB</th>
                <th className="hidden px-4 py-3 font-normal lg:table-cell">Occupation</th>
                <th className="hidden px-4 py-3 font-normal lg:table-cell">Summer</th>
                <th className="hidden px-4 py-3 font-normal xl:table-cell">High school</th>
                <th className="px-4 py-3 font-normal">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((row) => (
                <tr
                  key={row.id}
                  tabIndex={0}
                  role="link"
                  onClick={() => router.push(`/admin/applications/${row.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/admin/applications/${row.id}`);
                    }
                  }}
                  className="cursor-pointer border-b border-ns-border/80 text-ns-cream transition hover:bg-ns-elevated/60 focus-visible:bg-ns-elevated/60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-ns-gold"
                >
                  <td className="px-4 py-3 font-heading">{row.full_name}</td>
                  <td className="max-w-[12rem] truncate px-4 py-3 text-ns-muted">
                    {row.email}
                  </td>
                  <td className="hidden px-4 py-3 text-ns-muted md:table-cell">
                    {row.date_of_birth}
                  </td>
                  <td className="hidden max-w-[10rem] truncate px-4 py-3 text-ns-muted lg:table-cell">
                    {occupationFromRow(row)}
                  </td>
                  <td className="hidden max-w-[8rem] truncate px-4 py-3 text-ns-muted lg:table-cell">
                    {summerFromRow(row)}
                  </td>
                  <td className="hidden max-w-[10rem] truncate px-4 py-3 text-ns-muted xl:table-cell">
                    {highSchoolFromRow(row)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ns-muted">
                    {formatSubmittedAt(row.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}