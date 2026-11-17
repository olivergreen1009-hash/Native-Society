"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ADMISSION_AGE_MAX,
  ADMISSION_AGE_MIN,
  LOCATION_PREFERENCES,
  NYC_CHILDHOOD_BOROUGHS,
  RELATIONSHIP_INTENTIONS,
  SUMMER_DESTINATIONS,
} from "@/lib/application-options";
import {
  ICEBREAKER_MAX_LENGTH,
  normalizeIcebreaker,
  validateIcebreaker,
} from "@/lib/profile-field-validation";
import {
  loadMemberProfile,
  saveMemberProfile,
  type StoredMemberProfile,
} from "@/lib/member-profile-storage";

const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024;
const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

export default function MemberProfilePage() {
  const [profile, setProfile] = useState<StoredMemberProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    setProfile(loadMemberProfile());
  }, []);

  if (!profile) {
    return <p className="text-sm text-ns-muted">Loading profile…</p>;
  }

  const onPhoto = (file: File) => {
    setPhotoError("");
    if (!PHOTO_ACCEPT.split(",").includes(file.type)) {
      setPhotoError("Use JPEG, PNG, or WebP.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Photo must be 1.5 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfile((p) => (p ? { ...p, photoDataUrl: reader.result as string } : p));
      }
    };
    reader.readAsDataURL(file);
  };

  const onSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const favoriteNycDetail = normalizeIcebreaker(
      String(data.get("favoriteNycDetail") ?? ""),
    );
    const icebreakerErr = validateIcebreaker(favoriteNycDetail);
    if (icebreakerErr) {
      setFieldError(icebreakerErr);
      return;
    }
    setFieldError("");
    const summerDestination = String(data.get("summerDestination") ?? "").trim();
    const summerOther =
      summerDestination === "Other"
        ? String(data.get("summerOther") ?? "").trim()
        : undefined;
    const next: StoredMemberProfile = {
      ...profile,
      name: String(data.get("name") ?? profile.name),
      neighborhood: String(data.get("neighborhood") ?? profile.neighborhood),
      school: String(data.get("school") ?? profile.school),
      schoolLine: String(data.get("schoolLine") ?? profile.schoolLine ?? profile.school),
      raisedInBorough: String(data.get("raisedInBorough") ?? "").trim() || undefined,
      summerDestination: summerDestination || undefined,
      summerOther,
      favoriteNycDetail: favoriteNycDetail || undefined,
      bio: String(data.get("bio") ?? profile.bio),
      seekingAgeMin: Number(data.get("seekingAgeMin")),
      seekingAgeMax: Number(data.get("seekingAgeMax")),
      locationPreference: String(data.get("locationPreference") ?? ""),
      relationshipIntention: String(data.get("relationshipIntention") ?? ""),
    };
    saveMemberProfile(next);
    setProfile(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs uppercase tracking-[0.35em] text-ns-gold">Your presence</p>
      <h1 className="font-heading mt-3 text-4xl text-ns-cream">Profile</h1>
      <p className="mt-4 text-sm leading-relaxed text-ns-muted">
        Visible only within the club after mutual interest. Update how other members
        understand your New York rhythm.
      </p>

      <form onSubmit={onSave} className="mt-10 space-y-8">
        {fieldError && (
          <p className="text-sm text-red-400" role="alert">
            {fieldError}
          </p>
        )}
        <section className="space-y-4">
          <p className="font-heading text-lg text-ns-cream">Photo</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <label className="flex min-h-[7rem] flex-1 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-ns-border bg-ns-surface px-4 py-5 text-center hover:border-ns-gold/50">
              <span className="text-sm text-ns-cream">Upload or replace</span>
              <span className="mt-1 text-xs text-ns-muted">Max 1.5 MB</span>
              <input
                type="file"
                accept={PHOTO_ACCEPT}
                className="sr-only"
                onChange={(ev) => {
                  const f = ev.target.files?.[0];
                  if (f) onPhoto(f);
                  ev.target.value = "";
                }}
              />
            </label>
            {profile.photoDataUrl && (
              <ProfilePhotoPreview src={profile.photoDataUrl} />
            )}
          </div>
          {photoError && (
            <p className="text-sm text-red-400" role="alert">
              {photoError}
            </p>
          )}
        </section>

        <section className="space-y-4">
          <p className="font-heading text-lg text-ns-cream">About you</p>
          <Field label="Display name" name="name" defaultValue={profile.name} />
          <Field label="Neighborhood" name="neighborhood" defaultValue={profile.neighborhood} />
          <Select
            label="Raised in (optional)"
            name="raisedInBorough"
            options={[...NYC_CHILDHOOD_BOROUGHS]}
            defaultValue={profile.raisedInBorough ?? ""}
            optional
          />
          <Field
            label="School lineage"
            name="schoolLine"
            defaultValue={profile.schoolLine ?? profile.school}
          />
          <Select
            label="Where you summer (optional)"
            name="summerDestination"
            options={[...SUMMER_DESTINATIONS]}
            defaultValue={profile.summerDestination ?? ""}
            optional
          />
          {profile.summerDestination === "Other" ||
          String(profile.summerOther ?? "") ? (
            <Field
              label="Summer — Other"
              name="summerOther"
              defaultValue={profile.summerOther ?? ""}
            />
          ) : null}
          <ShortTextField
            label="Favorite NYC detail"
            name="favoriteNycDetail"
            defaultValue={profile.favoriteNycDetail ?? ""}
            maxLength={ICEBREAKER_MAX_LENGTH}
            helper="Optional. Shown only after mutual interest—never on gallery cards."
          />
          <div>
            <label className="text-xs uppercase tracking-widest text-ns-gold">Bio</label>
            <textarea
              name="bio"
              rows={5}
              defaultValue={profile.bio}
              className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-ns-border pt-8">
          <p className="font-heading text-lg text-ns-cream">Preferences</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Their age — min"
              name="seekingAgeMin"
              type="number"
              defaultValue={String(profile.seekingAgeMin)}
              min={ADMISSION_AGE_MIN}
              max={ADMISSION_AGE_MAX}
            />
            <Field
              label="Their age — max"
              name="seekingAgeMax"
              type="number"
              defaultValue={String(profile.seekingAgeMax)}
              min={ADMISSION_AGE_MIN}
              max={ADMISSION_AGE_MAX}
            />
          </div>
          <Select
            label="Location preference"
            name="locationPreference"
            options={LOCATION_PREFERENCES}
            defaultValue={profile.locationPreference}
          />
          <Select
            label="Relationship intention"
            name="relationshipIntention"
            options={RELATIONSHIP_INTENTIONS}
            defaultValue={profile.relationshipIntention}
          />
        </section>

        <button
          type="submit"
          className="rounded-full bg-ns-gold px-8 py-3 text-sm uppercase tracking-widest text-ns-bg hover:bg-ns-cream"
        >
          Save profile
        </button>
        {saved && <p className="text-sm text-ns-gold">Saved on this device.</p>}
      </form>
    </div>
  );
}

function ProfilePhotoPreview({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Your profile"
      className="h-28 w-28 shrink-0 rounded border border-ns-border object-cover sm:h-32 sm:w-32"
    />
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  min,
  max,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-ns-gold">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        min={min}
        max={max}
        className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
      />
    </div>
  );
}

function ShortTextField({
  label,
  name,
  defaultValue,
  maxLength,
  helper,
}: {
  label: string;
  name: string;
  defaultValue: string;
  maxLength: number;
  helper?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-ns-gold">{label}</label>
      {helper ? <p className="mt-1 text-xs text-ns-muted">{helper}</p> : null}
      <input
        name={name}
        type="text"
        defaultValue={defaultValue}
        maxLength={maxLength}
        className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue,
  optional,
}: {
  label: string;
  name: string;
  options: readonly string[];
  defaultValue: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-ns-gold">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
      >
        {optional ? (
          <option value="">Select…</option>
        ) : null}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}