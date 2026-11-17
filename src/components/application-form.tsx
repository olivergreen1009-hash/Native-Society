"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, type ReactNode } from "react";
import {
  ADMISSION_AGE_MAX,
  ADMISSION_AGE_MIN,
  CURRENT_AREAS,
  FAMILY_HOME_DURING_HIGH_SCHOOL,
  GENDER_OPTIONS,
  HEARD_ABOUT_OPTIONS,
  HIGH_SCHOOL_TYPES,
  LOCATION_PREFERENCES,
  NYC_YEARS_BEFORE_18,
  RELATIONSHIP_INTENTIONS,
  SCHOOL_SUGGESTIONS,
  SEEKING_GENDER_OPTIONS,
  SUMMER_DESTINATIONS,
} from "@/lib/application-options";
import { admissionCohort, ageFromDateOfBirth } from "@/lib/application-validation";
import type { ApplicationSubmitBody } from "@/lib/application-api";
import type {
  ApplicationProfilePhoto,
  HighSchoolRecord,
  OptionalSchoolRecord,
} from "@/lib/types";

const MAX_PROFILE_PHOTO_BYTES = 1.5 * 1024 * 1024;
const PROFILE_PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

async function fileToProfilePhoto(file: File): Promise<ApplicationProfilePhoto> {
  const dataBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not read file."));
        return;
      }
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
  return {
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    dataBase64,
  };
}

const inputClass =
  "mt-3 w-full border border-ns-border bg-ns-elevated px-4 py-3.5 text-base text-ns-cream outline-none transition focus:border-ns-gold";
const labelClass = "font-heading text-base text-ns-gold";

const emptyHighSchool = (): HighSchoolRecord => ({
  schoolName: "",
  schoolType: "",
  graduationYear: "",
  familyHomeDuringHighSchool: "",
});

export function ApplicationForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [seeking, setSeeking] = useState<string[]>([]);
  const [highSchool, setHighSchool] = useState<HighSchoolRecord>(emptyHighSchool);
  const [showElemMiddle, setShowElemMiddle] = useState(false);
  const [showCollege, setShowCollege] = useState(false);
  const [elemMiddle, setElemMiddle] = useState({ schoolName: "", graduationYear: "" });
  const [college, setCollege] = useState({ schoolName: "", graduationYear: "" });
  const [summerDestination, setSummerDestination] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<ApplicationProfilePhoto | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");

  const age = useMemo(() => (dob ? ageFromDateOfBirth(dob) : null), [dob]);
  const cohort = age !== null ? admissionCohort(age) : null;
  const under18 = age !== null && age < 18;
  const outsideCohort = cohort === "outside_cohort";

  const toggleSeeking = (value: string) => {
    setSeeking((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const patchHighSchool = (patch: Partial<HighSchoolRecord>) => {
    setHighSchool((prev) => ({ ...prev, ...patch }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(e.currentTarget);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const dateOfBirth = String(data.get("dateOfBirth") ?? "").trim();
    const ageAtSubmission = ageFromDateOfBirth(dateOfBirth);

    if (!name || !email || !dateOfBirth || ageAtSubmission === null) {
      setError("Please complete all required fields.");
      setLoading(false);
      return;
    }
    if (ageAtSubmission < 18) {
      setError("You must be at least 18 to apply.");
      setLoading(false);
      return;
    }

    const hs: HighSchoolRecord = {
      schoolName: highSchool.schoolName.trim(),
      schoolType: highSchool.schoolType,
      graduationYear: highSchool.graduationYear.trim(),
      familyHomeDuringHighSchool: highSchool.familyHomeDuringHighSchool,
    };
    if (
      !hs.schoolName ||
      !hs.schoolType ||
      !hs.graduationYear ||
      !hs.familyHomeDuringHighSchool
    ) {
      setError("Complete the required high school section.");
      setLoading(false);
      return;
    }

    const nycYears = String(data.get("nycYearsBefore18") ?? "");
    if (!nycYears) {
      setError("Select how long you lived in New York City before turning 18.");
      setLoading(false);
      return;
    }

    const seekingAgeMin = Number(data.get("seekingAgeMin"));
    const seekingAgeMax = Number(data.get("seekingAgeMax"));
    if (
      Number.isNaN(seekingAgeMin) ||
      Number.isNaN(seekingAgeMax) ||
      seekingAgeMin < 18 ||
      seekingAgeMax < seekingAgeMin
    ) {
      setError("Enter a valid age range for who you want to meet.");
      setLoading(false);
      return;
    }

    const locationPreference = String(data.get("locationPreference") ?? "");
    const relationshipIntention = String(data.get("relationshipIntention") ?? "");
    if (!locationPreference || !relationshipIntention) {
      setError("Select location preference and relationship intention.");
      setLoading(false);
      return;
    }

    if (!gender || seeking.length === 0) {
      setError("Select your gender and who you want to meet.");
      setLoading(false);
      return;
    }

    const consents = {
      age18: data.get("consent18") === "on",
      termsPrivacy: data.get("consentTerms") === "on",
      billingAfterPool: data.get("consentBilling") === "on",
      applicationReview: data.get("consentReview") === "on",
    };
    if (!Object.values(consents).every(Boolean)) {
      setError("Please accept all required confirmations.");
      setLoading(false);
      return;
    }

    const genderSelfDescribe =
      gender === "self_describe"
        ? String(data.get("genderSelfDescribe") ?? "").trim()
        : undefined;
    if (gender === "self_describe" && !genderSelfDescribe) {
      setError("Please describe how you identify.");
      setLoading(false);
      return;
    }

    let elementaryMiddle: OptionalSchoolRecord | undefined;
    if (showElemMiddle && elemMiddle.schoolName.trim()) {
      elementaryMiddle = {
        level: "elementary_middle",
        schoolName: elemMiddle.schoolName.trim(),
        graduationYear: elemMiddle.graduationYear.trim() || undefined,
      };
    }

    let collegeRecord: OptionalSchoolRecord | undefined;
    if (showCollege && college.schoolName.trim()) {
      collegeRecord = {
        level: "college",
        schoolName: college.schoolName.trim(),
        graduationYear: college.graduationYear.trim() || undefined,
      };
    }

    const occupation = String(data.get("occupation") ?? "").trim();
    const summerOther = String(data.get("summerOther") ?? "").trim();
    const charityBoardInvolvement =
      String(data.get("charityBoardInvolvement") ?? "").trim() || undefined;
    const shortBio = String(data.get("shortBio") ?? "").trim();

    if (!occupation) {
      setError("Enter your occupation or industry.");
      setLoading(false);
      return;
    }
    if (!summerDestination) {
      setError("Select where you usually summer.");
      setLoading(false);
      return;
    }
    if (summerDestination === "Other" && !summerOther) {
      setError("Describe where you summer when selecting Other.");
      setLoading(false);
      return;
    }
    if (!shortBio || shortBio.length < 40) {
      setError("Add a short bio or what you are looking for (at least 40 characters).");
      setLoading(false);
      return;
    }
    if (photoError) {
      setError(photoError);
      setLoading(false);
      return;
    }

    const payload: ApplicationSubmitBody = {
      name,
      email,
      emailVerified: false,
      dateOfBirth,
      currentArea: String(data.get("currentArea") ?? ""),
      neighborhood: String(data.get("neighborhood") ?? "").trim() || undefined,
      gender,
      genderSelfDescribe,
      seekingGenders: [...seeking],
      seekingAgeMin,
      seekingAgeMax,
      locationPreference,
      relationshipIntention,
      optionalNote: String(data.get("optionalNote") ?? "").trim() || undefined,
      highSchool: hs,
      elementaryMiddle,
      college: collegeRecord,
      nycYearsBefore18: nycYears,
      heardAbout: String(data.get("heardAbout") ?? ""),
      referrerName: String(data.get("referrerName") ?? "").trim() || undefined,
      consents,
      occupation,
      summerDestination,
      summerOther: summerDestination === "Other" ? summerOther : undefined,
      charityBoardInvolvement,
      shortBio,
      profilePhoto: profilePhoto ?? undefined,
    };

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        error?: string;
        details?: string;
        ok?: boolean;
        applicationId?: string;
      };
      if (!res.ok) {
        const detail = json.details ? ` (${json.details})` : "";
        setError(
          json.error
            ? `${json.error}${detail}`
            : "Unable to submit application.",
        );
        console.error("[applications] Submit failed:", res.status, json);
        setLoading(false);
        return;
      }
      setLoading(false);
      if (json.applicationId) {
        router.push(
          `/application/status?id=${encodeURIComponent(json.applicationId)}`,
        );
      } else {
        router.push("/application/status?demo=pending");
      }
    } catch {
      setError("Unable to submit application. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-6 md:mt-10 md:space-y-8">
      {error && (
        <p className="text-base text-red-400" role="alert">
          {error}
        </p>
      )}

      <fieldset className="space-y-5 border-none p-0 md:space-y-7">
        <legend className="font-heading text-lg text-ns-cream">About you</legend>
        <Field label="Full name" name="name" required autoComplete="name" />
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <p className="mt-1 text-sm text-ns-muted">
            Verified before activation—we&apos;ll send a confirmation link if approved.
          </p>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="dateOfBirth">
            Date of birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={inputClass}
          />
          {under18 && (
            <p className="mt-2 text-sm text-red-400">Must be 18 or older to apply.</p>
          )}
          {age !== null && age >= 18 && outsideCohort && (
            <p className="mt-2 text-sm text-ns-gold">
              Outside current admission window (ages {ADMISSION_AGE_MIN}–{ADMISSION_AGE_MAX}).
              You may still apply; review is case by case.
            </p>
          )}
          {age !== null && cohort === "21-50" && (
            <p className="mt-2 text-sm text-ns-muted">
              Within current admission ages {ADMISSION_AGE_MIN}–{ADMISSION_AGE_MAX}.
            </p>
          )}
        </div>
        <Select label="Current area" name="currentArea" required options={CURRENT_AREAS} />
        <Field
          label="Neighborhood (optional)"
          name="neighborhood"
          placeholder="e.g. West Village"
        />
      </fieldset>

      <fieldset className="space-y-5 border-t border-ns-border pt-6 md:space-y-7 md:pt-8">
        <legend className="font-heading text-lg text-ns-cream">School history</legend>
        <SchoolNameInput
          label="High school name"
          value={highSchool.schoolName}
          onChange={(schoolName) => patchHighSchool({ schoolName })}
          required
        />
        <div>
          <label className={labelClass} htmlFor="hs-type">
            High school type
          </label>
          <select
            id="hs-type"
            value={highSchool.schoolType}
            onChange={(e) => patchHighSchool({ schoolType: e.target.value })}
            required
            className={inputClass}
          >
            <option value="" disabled>
              Select…
            </option>
            {HIGH_SCHOOL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {highSchool.schoolType === "Boarding" && (
            <p className="mt-2 text-sm text-ns-muted">
              If you boarded, tell us where your family home was.
            </p>
          )}
        </div>
        <Field
          label="High school graduation year"
          name="hsGradYear"
          type="number"
          required
          placeholder="e.g. 2010"
          value={highSchool.graduationYear}
          onChange={(graduationYear) => patchHighSchool({ graduationYear })}
        />
        <StatefulSelect
          label="Where did your family live while you were in high school?"
          value={highSchool.familyHomeDuringHighSchool}
          onChange={(familyHomeDuringHighSchool) =>
            patchHighSchool({ familyHomeDuringHighSchool })
          }
          options={FAMILY_HOME_DURING_HIGH_SCHOOL}
          required
        />

        {!showElemMiddle ? (
          <button
            type="button"
            onClick={() => setShowElemMiddle(true)}
            className="text-base text-ns-gold hover:text-ns-cream"
          >
            + Add elementary / middle school (optional)
          </button>
        ) : (
          <div className="space-y-4 border border-ns-border bg-ns-bg p-4">
            <p className="font-heading text-ns-cream">Elementary / middle (optional)</p>
            <SchoolNameInput
              label="School name"
              value={elemMiddle.schoolName}
              onChange={(schoolName) => setElemMiddle((s) => ({ ...s, schoolName }))}
            />
            <Field
              label="Graduation year (optional)"
              name="emGrad"
              placeholder="e.g. 2004"
              value={elemMiddle.graduationYear}
              onChange={(graduationYear) => setElemMiddle((s) => ({ ...s, graduationYear }))}
            />
          </div>
        )}

        {!showCollege ? (
          <button
            type="button"
            onClick={() => setShowCollege(true)}
            className="text-base text-ns-gold hover:text-ns-cream"
          >
            + Add college (optional)
          </button>
        ) : (
          <div className="space-y-4 border border-ns-border bg-ns-bg p-4">
            <p className="font-heading text-ns-cream">College (optional)</p>
            <SchoolNameInput
              label="College name"
              value={college.schoolName}
              onChange={(schoolName) => setCollege((s) => ({ ...s, schoolName }))}
            />
            <Field
              label="Graduation year (optional)"
              name="collegeGrad"
              placeholder="e.g. 2014"
              value={college.graduationYear}
              onChange={(graduationYear) => setCollege((s) => ({ ...s, graduationYear }))}
            />
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-5 border-t border-ns-border pt-6 md:space-y-7 md:pt-8">
        <legend className="font-heading text-lg text-ns-cream">Life & presentation</legend>
        <p className="text-sm leading-relaxed text-ns-muted">
          Selective detail for admissions review—kept private until membership.
        </p>
        <Field
          label="Occupation / industry"
          name="occupation"
          required
          autoComplete="organization-title"
          placeholder="e.g. Private equity · Art advisory"
        />
        <StatefulSelect
          label="Where do you summer?"
          value={summerDestination}
          onChange={setSummerDestination}
          options={SUMMER_DESTINATIONS}
          required
        />
        {summerDestination === "Other" && (
          <Field
            label="Where you summer"
            name="summerOther"
            required
            placeholder="e.g. Maine coast, Aspen"
          />
        )}
        <Field
          label="Charity or board involvement (optional)"
          name="charityBoardInvolvement"
          placeholder="e.g. Museum board, youth charity"
        />
        <TextArea
          label="Short bio · what you’re looking for"
          name="shortBio"
          required
          rows={4}
          placeholder="A few sentences on your life in New York and what kind of introduction you want here."
          hint="At least 40 characters. Reviewed by admissions only."
        />
        <ProfilePhotoUpload
          previewUrl={photoPreview}
          error={photoError}
          onClear={() => {
            if (photoPreview) URL.revokeObjectURL(photoPreview);
            setProfilePhoto(null);
            setPhotoPreview(null);
            setPhotoError("");
          }}
          onFile={async (file) => {
            setPhotoError("");
            if (!PROFILE_PHOTO_ACCEPT.split(",").includes(file.type)) {
              setPhotoError("Use a JPEG, PNG, or WebP image.");
              return;
            }
            if (file.size > MAX_PROFILE_PHOTO_BYTES) {
              setPhotoError("Photo must be 1.5 MB or smaller.");
              return;
            }
            try {
              const photo = await fileToProfilePhoto(file);
              setProfilePhoto(photo);
              setPhotoPreview(URL.createObjectURL(file));
            } catch {
              setPhotoError("Could not read that file. Try another image.");
            }
          }}
        />
      </fieldset>

      <fieldset className="space-y-5 border-t border-ns-border pt-6 md:space-y-7 md:pt-8">
        <legend className="font-heading text-lg text-ns-cream">New York roots</legend>
        <Select
          label="How long did you live in New York City before turning 18?"
          name="nycYearsBefore18"
          required
          options={NYC_YEARS_BEFORE_18}
        />
      </fieldset>

      <fieldset className="space-y-5 border-t border-ns-border pt-6 md:space-y-7 md:pt-8">
        <legend className="font-heading text-lg text-ns-cream">Identity & preferences</legend>
        <h3 className={labelClass} id="gender-label">
          Gender
        </h3>
        <div className="mt-3 space-y-2" role="radiogroup" aria-labelledby="gender-label">
          {GENDER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-3 text-base text-ns-cream"
            >
              <input
                type="radio"
                name="genderRadio"
                value={opt.value}
                checked={gender === opt.value}
                onChange={() => setGender(opt.value)}
                className="accent-ns-gold"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {gender === "self_describe" && (
          <Field label="How you identify" name="genderSelfDescribe" required />
        )}

        <div>
          <p className={labelClass} id="seeking-label">
            Who you want to meet
          </p>
          <div className="mt-3 flex flex-col gap-2" aria-labelledby="seeking-label">
            {SEEKING_GENDER_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 text-base text-ns-cream"
              >
                <input
                  type="checkbox"
                  checked={seeking.includes(opt.value)}
                  onChange={() => toggleSeeking(opt.value)}
                  className="accent-ns-gold"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Their age — minimum"
            name="seekingAgeMin"
            type="number"
            required
            placeholder={String(ADMISSION_AGE_MIN)}
          />
          <Field
            label="Their age — maximum"
            name="seekingAgeMax"
            type="number"
            required
            placeholder={String(ADMISSION_AGE_MAX)}
          />
        </div>
        <Select
          label="Location preference"
          name="locationPreference"
          required
          options={LOCATION_PREFERENCES}
        />
        <Select
          label="Relationship intention"
          name="relationshipIntention"
          required
          options={RELATIONSHIP_INTENTIONS}
        />
        <TextArea label="Note (optional)" name="optionalNote" rows={3} />
      </fieldset>

      <fieldset className="space-y-5 border-t border-ns-border pt-6 md:space-y-7 md:pt-8">
        <legend className="font-heading text-lg text-ns-cream">Referral</legend>
        <Select label="How you heard about us" name="heardAbout" required options={HEARD_ABOUT_OPTIONS} />
        <Field label="Referrer name (optional)" name="referrerName" />
      </fieldset>

      <fieldset className="space-y-4 border-t border-ns-border pt-6 md:pt-8">
        <legend className="font-heading text-lg text-ns-cream">Required confirmations</legend>
        <Consent name="consent18" label="I am 18 years of age or older." />
        <Consent
          name="consentTerms"
          label={
            <>
              I agree to the{" "}
              <Link href="/terms" className="text-ns-gold underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-ns-gold underline">
                Privacy Policy
              </Link>
              .
            </>
          }
        />
        <Consent
          name="consentBilling"
          label="I understand membership is paid and billing starts only after approval and confirmation of a usable reciprocal pool."
        />
        <Consent
          name="consentReview"
          label="I consent to human review of my application and the information I provide."
        />
      </fieldset>

      <button
        type="submit"
        disabled={under18 || loading}
        className="club-btn-apply w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {loading ? "Submitting…" : "Apply"}
      </button>
    </form>
  );
}

function StatefulSelect({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={inputClass}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const isControlled = value !== undefined && onChange !== undefined;
  return (
    <div>
      <label className={labelClass} htmlFor={isControlled ? undefined : name}>
        {label}
      </label>
      <input
        id={isControlled ? undefined : name}
        name={isControlled ? undefined : name}
        type={type}
        required={required && !isControlled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={inputClass}
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  rows = 4,
  required,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      {hint && <p className="mt-1 text-sm text-ns-muted">{hint}</p>}
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function ProfilePhotoUpload({
  previewUrl,
  error,
  onFile,
  onClear,
}: {
  previewUrl: string | null;
  error: string;
  onFile: (file: File) => void | Promise<void>;
  onClear: () => void;
}) {
  return (
    <div>
      <p className={labelClass}>Photo (optional)</p>
      <p className="mt-1 text-sm text-ns-muted">
        One recent image, max 1.5 MB. Stored securely with your application.
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
        <label className="flex min-h-[7.5rem] flex-1 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-ns-border bg-ns-elevated/40 px-4 py-6 text-center transition hover:border-ns-gold/60">
          <span className="text-sm text-ns-cream">
            {previewUrl ? "Replace photo" : "Choose an image"}
          </span>
          <span className="mt-1 text-xs text-ns-muted">JPEG · PNG · WebP</span>
          <input
            type="file"
            accept={PROFILE_PHOTO_ACCEPT}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFile(file);
              e.target.value = "";
            }}
          />
        </label>
        {previewUrl && (
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Your selected profile preview"
              className="h-28 w-28 rounded border border-ns-border object-cover sm:h-32 sm:w-32"
            />
            <button
              type="button"
              onClick={onClear}
              className="mt-2 w-full text-xs uppercase tracking-wider text-ns-gold hover:text-ns-cream"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({
  label,
  name,
  required,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: readonly string[];
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} required={required} className={inputClass} defaultValue="">
        <option value="" disabled>
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function SchoolNameInput({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const listId = "school-suggestions";
  return (
    <div>
      <label className={labelClass} htmlFor="school-input">
        {label}
      </label>
      <input
        id="school-input"
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder="Start typing or choose Other"
        className={inputClass}
      />
      <datalist id={listId}>
        {SCHOOL_SUGGESTIONS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
}

function Consent({ name, label }: { name: string; label: ReactNode }) {
  return (
    <label className="flex cursor-pointer gap-3 text-base leading-relaxed text-ns-cream">
      <input
        type="checkbox"
        name={name}
        required
        className="mt-1 shrink-0 accent-ns-gold"
      />
      <span>{label}</span>
    </label>
  );
}