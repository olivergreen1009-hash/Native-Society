"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { ApplicationSubmitBody } from "@/lib/application-api";
import {
  formatSubmittedAt,
  parseApplicationRawData,
  profilePhotoDataUrl,
  type SupabaseApplicationRow,
} from "@/lib/supabase-applications";

export function AdminApplicationDetail({ id }: { id: string }) {
  const [row, setRow] = useState<SupabaseApplicationRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/applications/submissions/${id}`);
      const json = (await res.json()) as {
        application?: SupabaseApplicationRow;
        error?: string;
      };
      if (!res.ok) {
        setError(json.error ?? "Could not load application.");
        setRow(null);
        return;
      }
      setRow(json.application ?? null);
    } catch {
      setError("Could not load application.");
      setRow(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const raw = row ? parseApplicationRawData(row.raw_data) : null;
  const photoUrl = raw?.profilePhoto
    ? profilePhotoDataUrl(raw.profilePhoto)
  : null;

  if (loading) {
    return <p className="text-sm text-ns-muted">Loading application…</p>;
  }

  if (error || !row) {
    return (
      <div>
        <BackLink />
        <p className="mt-6 text-sm text-red-400" role="alert">
          {error || "Application not found."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <BackLink />
      <header className="mt-6 border-b border-ns-border pb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-ns-gold">Application</p>
        <h1 className="font-heading mt-2 text-3xl text-ns-cream md:text-4xl">
          {row.full_name}
        </h1>
        <p className="mt-2 text-sm text-ns-muted">
          {row.email} · DOB {row.date_of_birth} · Submitted{" "}
          {formatSubmittedAt(row.created_at)}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div className="space-y-8">
          <Section title="Bio">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ns-cream">
              {raw?.shortBio?.trim() || "—"}
            </p>
          </Section>

          <Section title="Charity & boards">
            <p className="text-sm text-ns-cream">
              {raw?.charityBoardInvolvement?.trim() || "—"}
            </p>
          </Section>

          <Section title="Preferences">
            {raw ? <PreferencesBlock raw={raw} /> : <p className="text-sm text-ns-muted">—</p>}
          </Section>

          <Section title="Structured fields">
            {raw ? <StructuredFields raw={raw} row={row} /> : (
              <p className="text-sm text-ns-muted">No raw_data on this row.</p>
            )}
          </Section>

          {raw && (
            <Section title="Full raw_data">
              <pre className="max-h-96 overflow-auto rounded border border-ns-border bg-ns-bg p-4 text-xs text-ns-muted">
                {JSON.stringify(stripPhotoPayload(raw), null, 2)}
              </pre>
            </Section>
          )}
        </div>

        {photoUrl && (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-heading text-sm text-ns-gold">Photo</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={`${row.full_name} application photo`}
              className="mt-3 w-full max-w-[16rem] rounded border border-ns-border object-cover"
            />
          </aside>
        )}
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin/applications"
      className="text-sm text-ns-gold hover:text-ns-cream hover:underline"
    >
      ← All applications
    </Link>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded border border-ns-border bg-ns-surface p-5 md:p-6">
      <h2 className="font-heading text-lg text-ns-gold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PreferencesBlock({ raw }: { raw: ApplicationSubmitBody }) {
  const genderLabel =
    raw.gender === "self_describe"
      ? raw.genderSelfDescribe || "Self-describe"
      : raw.gender;
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <Detail label="Gender" value={genderLabel} />
      <Detail
        label="Seeking"
        value={raw.seekingGenders?.length ? raw.seekingGenders.join(", ") : "—"}
      />
      <Detail
        label="Age range"
        value={
          raw.seekingAgeMin != null && raw.seekingAgeMax != null
            ? `${raw.seekingAgeMin}–${raw.seekingAgeMax}`
            : "—"
        }
      />
      <Detail label="Location preference" value={raw.locationPreference || "—"} />
      <Detail label="Relationship intention" value={raw.relationshipIntention || "—"} />
      <Detail label="Current area" value={raw.currentArea || "—"} />
      {raw.neighborhood && <Detail label="Neighborhood" value={raw.neighborhood} />}
      {raw.optionalNote && <Detail label="Note" value={raw.optionalNote} span />}
    </dl>
  );
}

function StructuredFields({
  raw,
  row,
}: {
  raw: ApplicationSubmitBody;
  row: SupabaseApplicationRow;
}) {
  const hs = raw.highSchool;
  const schoolLine = hs
    ? `${hs.schoolName} (${hs.schoolType}, ${hs.graduationYear})`
    : "—";

  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <Detail label="Full name (row)" value={row.full_name} />
      <Detail label="Email (row)" value={row.email} />
      <Detail label="Occupation" value={raw.occupation || "—"} />
      <Detail
        label="Summer"
        value={
          raw.summerDestination === "Other" && raw.summerOther
            ? `Other — ${raw.summerOther}`
            : raw.summerDestination || "—"
        }
      />
      <Detail label="High school" value={schoolLine} span />
      {raw.elementaryMiddle?.schoolName && (
        <Detail
          label="Elementary / middle"
          value={raw.elementaryMiddle.schoolName}
        />
      )}
      {raw.college?.schoolName && (
        <Detail label="College" value={raw.college.schoolName} />
      )}
      <Detail label="NYC before 18" value={raw.nycYearsBefore18 || "—"} />
      <Detail label="Family home (HS)" value={hs?.familyHomeDuringHighSchool || "—"} />
      <Detail label="Heard about us" value={raw.heardAbout || "—"} />
      {raw.referrerName && <Detail label="Referrer" value={raw.referrerName} />}
    </dl>
  );
}

function Detail({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <dt className="text-xs uppercase tracking-widest text-ns-muted">{label}</dt>
      <dd className="mt-1 text-ns-cream">{value}</dd>
    </div>
  );
}

function stripPhotoPayload(raw: ApplicationSubmitBody) {
  if (!raw.profilePhoto) return raw;
  const { dataBase64, ...photoMeta } = raw.profilePhoto;
  return {
    ...raw,
    profilePhoto: { ...photoMeta, dataBase64: "[base64 omitted]" },
  };
}