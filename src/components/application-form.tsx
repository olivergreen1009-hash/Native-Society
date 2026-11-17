"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, type ReactNode } from "react";
import {
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
} from "@/lib/application-options";
import {
  admissionCohort,
  ageFromDateOfBirth,
  buildPoolKey,
} from "@/lib/application-validation";
import { addInquiry } from "@/lib/client-store";
import type { HighSchoolRecord, OptionalSchoolRecord } from "@/lib/types";

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
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [seeking, setSeeking] = useState<string[]>([]);
  const [highSchool, setHighSchool] = useState<HighSchoolRecord>(emptyHighSchool);
  const [showElemMiddle, setShowElemMiddle] = useState(false);
  const [showCollege, setShowCollege] = useState(false);
  const [elemMiddle, setElemMiddle] = useState({ schoolName: "", graduationYear: "" });
  const [college, setCollege] = useState({ schoolName: "", graduationYear: "" });

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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const dateOfBirth = String(data.get("dateOfBirth") ?? "").trim();
    const ageAtSubmission = ageFromDateOfBirth(dateOfBirth);

    if (!name || !email || !dateOfBirth || ageAtSubmission === null) {
      setError("Please complete all required fields.");
      return;
    }
    if (ageAtSubmission < 18) {
      setError("You must be at least 18 to apply.");
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
      return;
    }

    const nycYears = String(data.get("nycYearsBefore18") ?? "");
    if (!nycYears) {
      setError("Select how long you lived in New York City before turning 18.");
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
      return;
    }

    const locationPreference = String(data.get("locationPreference") ?? "");
    const relationshipIntention = String(data.get("relationshipIntention") ?? "");
    if (!locationPreference || !relationshipIntention) {
      setError("Select location preference and relationship intention.");
      return;
    }

    if (!gender || seeking.length === 0) {
      setError("Select your gender and who you want to meet.");
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
      return;
    }

    const genderSelfDescribe =
      gender === "self_describe"
        ? String(data.get("genderSelfDescribe") ?? "").trim()
        : undefined;
    if (gender === "self_describe" && !genderSelfDescribe) {
      setError("Please describe how you identify.");
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

    const base = {
      name,
      email,
      emailVerified: false,
      dateOfBirth,
      ageAtSubmission,
      admissionCohort: admissionCohort(ageAtSubmission),
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
    };

    addInquiry({
      ...base,
      poolKey: buildPoolKey({
        gender: base.gender,
        seekingGenders: base.seekingGenders,
        ageAtSubmission: base.ageAtSubmission,
        seekingAgeMin: base.seekingAgeMin,
        seekingAgeMax: base.seekingAgeMax,
        locationPreference: base.locationPreference,
        currentArea: base.currentArea,
      }),
    });

    setSubmitted(true);
    form.reset();
    setHighSchool(emptyHighSchool());
    setShowElemMiddle(false);
    setShowCollege(false);
    setElemMiddle({ schoolName: "", graduationYear: "" });
    setCollege({ schoolName: "", graduationYear: "" });
    setDob("");
    setGender("");
    setSeeking([]);
  };

  if (submitted) {
    return (
      <div className="mt-10 space-y-4 border border-ns-gold/50 bg-ns-elevated px-5 py-8 sm:px-8">
        <p className="font-heading text-xl text-ns-cream">Application received.</p>
        <p className="text-base leading-relaxed text-ns-cream">
          We review every application and respond within two weeks. Approval does not start
          billing. We only activate paid membership once there&apos;s a usable pool for your
          preferences.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-8">
      {error && (
        <p className="text-base text-red-400" role="alert">
          {error}
        </p>
      )}

      <fieldset className="space-y-7 border-none p-0">
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
              Outside current admission window (ages 23–40). You may still apply; review is
              case by case.
            </p>
          )}
          {age !== null && cohort === "23-40" && (
            <p className="mt-2 text-sm text-ns-muted">Within current admission ages 23–40.</p>
          )}
        </div>
        <Select label="Current area" name="currentArea" required options={CURRENT_AREAS} />
        <Field
          label="Neighborhood (optional)"
          name="neighborhood"
          placeholder="e.g. West Village"
        />
      </fieldset>

      <fieldset className="space-y-7 border-t border-ns-border pt-8">
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

      <fieldset className="space-y-7 border-t border-ns-border pt-8">
        <legend className="font-heading text-lg text-ns-cream">New York roots</legend>
        <Select
          label="How long did you live in New York City before turning 18?"
          name="nycYearsBefore18"
          required
          options={NYC_YEARS_BEFORE_18}
        />
      </fieldset>

      <fieldset className="space-y-7 border-t border-ns-border pt-8">
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
            placeholder="23"
          />
          <Field
            label="Their age — maximum"
            name="seekingAgeMax"
            type="number"
            required
            placeholder="40"
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

      <fieldset className="space-y-7 border-t border-ns-border pt-8">
        <legend className="font-heading text-lg text-ns-cream">Referral</legend>
        <Select label="How you heard about us" name="heardAbout" required options={HEARD_ABOUT_OPTIONS} />
        <Field label="Referrer name (optional)" name="referrerName" />
      </fieldset>

      <fieldset className="space-y-4 border-t border-ns-border pt-8">
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
        disabled={under18}
        className="club-btn-apply w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        Apply
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
}: {
  label: string;
  name: string;
  rows?: number;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <textarea id={name} name={name} rows={rows} className={inputClass} />
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