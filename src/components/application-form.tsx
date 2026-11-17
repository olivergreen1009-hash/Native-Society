"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ADMISSION_AGE_MAX,
  ADMISSION_AGE_MIN,
  CURRENT_AREAS,
  DOB_MONTHS,
  FAMILY_HOME_DURING_HIGH_SCHOOL,
  GENDER_OPTIONS,
  HEARD_ABOUT_OPTIONS,
  HIGH_SCHOOL_TYPES,
  highSchoolGraduationYears,
  LOCATION_PREFERENCES,
  NYC_YEARS_BEFORE_18,
  RELATIONSHIP_INTENTIONS,
  SCHOOL_SUGGESTIONS,
  SEEKING_GENDER_OPTIONS,
} from "@/lib/application-options";
import { admissionCohort, ageFromDateOfBirth } from "@/lib/application-validation";
import type { ApplicationSubmitBody } from "@/lib/application-api";
import type { HighSchoolRecord } from "@/lib/types";

const STEPS = ["About you", "NYC roots & school", "Preferences & submit"] as const;

const inputClass =
  "mt-3 w-full max-w-full border border-ns-border bg-ns-elevated px-4 py-3.5 text-base text-ns-cream outline-none transition focus:border-ns-gold";
const labelClass = "font-heading text-base text-ns-gold";

const emptyHighSchool = (): HighSchoolRecord => ({
  schoolName: "",
  schoolType: "",
  graduationYear: "",
  familyHomeDuringHighSchool: "",
});

function composeDob(month: string, day: string, year: string): string {
  if (!month || !day || !year) return "";
  const mm = month.padStart(2, "0");
  const dd = day.padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function daysInMonth(month: string, year: string): number {
  const m = Number(month);
  const y = Number(year);
  if (!m || !y) return 31;
  return new Date(y, m, 0).getDate();
}

function scrollApplyToTop() {
  if (typeof window === "undefined") return;
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  } catch {
    window.scrollTo(0, 0);
  }
}

export function ApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const skipStepScrollRef = useRef(true);

  useEffect(() => {
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = "auto";
    };
  }, []);

  useEffect(() => {
    if (skipStepScrollRef.current) {
      skipStepScrollRef.current = false;
      return;
    }
    scrollApplyToTop();
  }, [step]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentArea, setCurrentArea] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [occupation, setOccupation] = useState("");
  const [nycYearsBefore18, setNycYearsBefore18] = useState("");
  const [gender, setGender] = useState("");
  const [seeking, setSeeking] = useState<string[]>([]);
  const [seekingAgeMin, setSeekingAgeMin] = useState(String(ADMISSION_AGE_MIN));
  const [seekingAgeMax, setSeekingAgeMax] = useState(String(ADMISSION_AGE_MAX));
  const [consent18, setConsent18] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentBilling, setConsentBilling] = useState(false);
  const [consentReview, setConsentReview] = useState(false);
  const [highSchool, setHighSchool] = useState<HighSchoolRecord>(emptyHighSchool);

  const dateOfBirth = composeDob(dobMonth, dobDay, dobYear);
  const age = useMemo(
    () => (dateOfBirth ? ageFromDateOfBirth(dateOfBirth) : null),
    [dateOfBirth],
  );
  const under18 = age !== null && age < 18;
  const outsideCohort = age !== null && admissionCohort(age) === "outside_cohort";
  const maxDay = daysInMonth(dobMonth, dobYear);
  const dayOptions = Array.from({ length: maxDay }, (_, i) => String(i + 1));
  const yearOptions = Array.from({ length: 80 }, (_, i) =>
    String(new Date().getFullYear() - 18 - i),
  );

  const openToAllGenders = seeking.includes("open");

  const toggleSeeking = (value: string) => {
    if (value === "open") {
      setSeeking((prev) => (prev.includes("open") ? [] : ["open"]));
      return;
    }
    setSeeking((prev) => {
      const withoutOpen = prev.filter((v) => v !== "open");
      return withoutOpen.includes(value)
        ? withoutOpen.filter((v) => v !== value)
        : [...withoutOpen, value];
    });
  };

  const parseSeekingAges = (): { min: number; max: number } | null => {
    const min = Number(seekingAgeMin);
    const max = Number(seekingAgeMax);
    if (Number.isNaN(min) || Number.isNaN(max)) return null;
    return { min, max };
  };

  const validateSeekingAgeRange = (): boolean => {
    const ages = parseSeekingAges();
    if (!ages || ages.min < 18) {
      setError("Enter a valid minimum age (18 or older).");
      return false;
    }
    if (ages.max < ages.min) {
      setError("Minimum age cannot be greater than maximum age.");
      return false;
    }
    return true;
  };

  const patchHighSchool = (patch: Partial<HighSchoolRecord>) => {
    setHighSchool((prev) => ({ ...prev, ...patch }));
  };

  const validateAboutYou = (): boolean => {
    if (!name.trim() || !email.trim() || !dateOfBirth || age === null) {
      setError("Complete name, email, and date of birth.");
      return false;
    }
    if (age < 18) {
      setError("You must be at least 18 to apply.");
      return false;
    }
    if (!currentArea) {
      setError("Select your current area.");
      return false;
    }
    return true;
  };

  const validateNycSchool = (): boolean => {
    const hs = highSchool;
    if (
      !hs.schoolName.trim() ||
      !hs.schoolType ||
      !hs.graduationYear ||
      !hs.familyHomeDuringHighSchool
    ) {
      setError("Complete the required high school section.");
      return false;
    }
    if (!nycYearsBefore18) {
      setError("Select how long you lived in NYC before turning 18.");
      return false;
    }
    return true;
  };

  const validateCurrentStep = (activeStep: number): boolean => {
    let ok = false;
    if (activeStep === 0) ok = validateAboutYou();
    else if (activeStep === 1) ok = validateNycSchool();
    else ok = true;
    if (ok) setError("");
    return ok;
  };

  const validateAllSteps = (): boolean => {
    if (!validateAboutYou()) return false;
    if (!validateNycSchool()) return false;
    setError("");
    return true;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (step < STEPS.length - 1) {
      if (validateCurrentStep(step)) setStep((s) => s + 1);
      return;
    }

    if (!validateAllSteps()) return;

    setError("");
    setLoading(true);

    const ageAtSubmission = ageFromDateOfBirth(dateOfBirth)!;
    const ages = parseSeekingAges();
    if (!validateSeekingAgeRange()) {
      setLoading(false);
      return;
    }
    const seekingAgeMinNum = ages!.min;
    const seekingAgeMaxNum = ages!.max;
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
      age18: consent18,
      termsPrivacy: consentTerms,
      billingAfterPool: consentBilling,
      applicationReview: consentReview,
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

    if (!String(data.get("heardAbout") ?? "")) {
      setError("Tell us how you heard about Native Society.");
      setLoading(false);
      return;
    }

    const occupationTrimmed = occupation.trim();

    const payload: ApplicationSubmitBody = {
      name: name.trim(),
      email: email.trim(),
      emailVerified: false,
      dateOfBirth,
      currentArea,
      neighborhood: neighborhood.trim() || undefined,
      gender,
      genderSelfDescribe,
      seekingGenders: [...seeking],
      seekingAgeMin: seekingAgeMinNum,
      seekingAgeMax: seekingAgeMaxNum,
      locationPreference,
      relationshipIntention,
      occupation: occupationTrimmed || undefined,
      highSchool: {
        schoolName: highSchool.schoolName.trim(),
        schoolType: highSchool.schoolType,
        graduationYear: highSchool.graduationYear,
        familyHomeDuringHighSchool: highSchool.familyHomeDuringHighSchool,
      },
      nycYearsBefore18,
      heardAbout: String(data.get("heardAbout") ?? ""),
      referrerName: String(data.get("referrerName") ?? "").trim() || undefined,
      consents,
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
        applicationId?: string;
      };
      if (!res.ok) {
        const detail = json.details ? ` (${json.details})` : "";
        setError(json.error ? `${json.error}${detail}` : "Unable to submit application.");
        setLoading(false);
        return;
      }
      setLoading(false);
      scrollApplyToTop();
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
    <form onSubmit={onSubmit} className="mt-6 space-y-6 md:mt-8">
      <div aria-label="Application progress">
        <div className="flex gap-2">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-ns-gold" : "bg-ns-border"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-ns-muted">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
      </div>

      {error && (
        <p className="text-base text-red-400" role="alert">
          {error}
        </p>
      )}

      <input type="hidden" name="dateOfBirth" value={dateOfBirth} />

      {step === 0 && (
        <fieldset className="space-y-5 border-none p-0 md:space-y-6">
          <legend className="font-heading text-lg text-ns-cream">About you</legend>
          <Field
            label="Full name"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={setName}
          />
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <DobFields
            labelClass={labelClass}
            inputClass={inputClass}
            dobMonth={dobMonth}
            dobDay={dobDay}
            dobYear={dobYear}
            setDobMonth={setDobMonth}
            setDobDay={setDobDay}
            setDobYear={setDobYear}
            dayOptions={dayOptions}
            yearOptions={yearOptions}
            under18={under18}
            outsideCohort={outsideCohort}
            age={age}
          />
          <StatefulSelect
            label="Current area"
            value={currentArea}
            onChange={setCurrentArea}
            options={CURRENT_AREAS}
            required
          />
          <Field
            label="Neighborhood (optional)"
            name="neighborhood"
            placeholder="e.g. West Village"
            value={neighborhood}
            onChange={setNeighborhood}
          />
          <Field
            label="Occupation / industry (optional)"
            name="occupation"
            placeholder="e.g. Finance · Design"
            value={occupation}
            onChange={setOccupation}
          />
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="space-y-5 border-none p-0 md:space-y-6">
          <legend className="font-heading text-lg text-ns-cream">NYC roots & school</legend>
          <StatefulSelect
            label="How long did you live in New York City before turning 18?"
            value={nycYearsBefore18}
            onChange={setNycYearsBefore18}
            options={NYC_YEARS_BEFORE_18}
            required
          />
          <SchoolNameInput
            label="High school name"
            value={highSchool.schoolName}
            onChange={(schoolName) => patchHighSchool({ schoolName })}
            required
          />
          <HsTypeSelect highSchool={highSchool} patchHighSchool={patchHighSchool} />
          <GradYearSelect
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
        </fieldset>
      )}

      {step === 2 && (
        <>
          <fieldset className="space-y-5 border-none p-0 md:space-y-6">
            <legend className="font-heading text-lg text-ns-cream">Preferences</legend>
            <p className={labelClass} id="gender-label">
              Gender
            </p>
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
                    className="ns-radio"
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
                {SEEKING_GENDER_OPTIONS.map((opt) => {
                  const disabled = openToAllGenders && opt.value !== "open";
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 text-base ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer text-ns-cream"}`}
                    >
                      <input
                        type="checkbox"
                        checked={seeking.includes(opt.value)}
                        disabled={disabled}
                        onChange={() => toggleSeeking(opt.value)}
                        className="accent-ns-gold disabled:cursor-not-allowed"
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
              {openToAllGenders ? (
                <p className="mt-2 text-sm text-ns-muted">
                  Open to all genders — individual options are not needed.
                </p>
              ) : null}
            </div>

            <div className="grid max-w-md gap-4 sm:grid-cols-2">
              <Field
                label="Their age — minimum"
                name="seekingAgeMin"
                type="number"
                required
                min={18}
                max={ADMISSION_AGE_MAX}
                value={seekingAgeMin}
                onChange={setSeekingAgeMin}
              />
              <Field
                label="Their age — maximum"
                name="seekingAgeMax"
                type="number"
                required
                min={18}
                max={99}
                value={seekingAgeMax}
                onChange={setSeekingAgeMax}
              />
            </div>
            <p className="text-sm text-ns-muted">
              Default range {ADMISSION_AGE_MIN}–{ADMISSION_AGE_MAX}; adjust as you like.
            </p>
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
          </fieldset>

          <fieldset className="space-y-5 border-t border-ns-border pt-6 md:space-y-6">
            <legend className="font-heading text-lg text-ns-cream">Referral</legend>
            <Select
              label="How you heard about us"
              name="heardAbout"
              required
              options={HEARD_ABOUT_OPTIONS}
            />
            <Field label="Referrer name (optional)" name="referrerName" />
          </fieldset>

          <fieldset className="space-y-4 border-t border-ns-border pt-6">
            <legend className="font-heading text-lg text-ns-cream">Required confirmations</legend>
            <Consent
              checked={consent18}
              onChange={setConsent18}
              label="I am 18 years of age or older."
            />
            <Consent
              checked={consentTerms}
              onChange={setConsentTerms}
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
              checked={consentBilling}
              onChange={setConsentBilling}
              label="I understand membership is paid and billing starts only after approval and confirmation of a usable reciprocal pool."
            />
            <Consent
              checked={consentReview}
              onChange={setConsentReview}
              label="I consent to human review of my application, including school and background information I provide."
            />
          </fieldset>
        </>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-full border border-ns-border px-6 py-3 text-xs uppercase tracking-widest text-ns-muted hover:text-ns-cream"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={under18 || loading}
          className="club-btn-apply min-h-11 flex-1 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-10"
        >
          {loading
            ? "Submitting…"
            : step < STEPS.length - 1
              ? "Continue"
              : "Submit application"}
        </button>
      </div>
    </form>
  );
}

function DobFields({
  labelClass,
  inputClass,
  dobMonth,
  dobDay,
  dobYear,
  setDobMonth,
  setDobDay,
  setDobYear,
  dayOptions,
  yearOptions,
  under18,
  outsideCohort,
  age,
}: {
  labelClass: string;
  inputClass: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  setDobMonth: (v: string) => void;
  setDobDay: (v: string) => void;
  setDobYear: (v: string) => void;
  dayOptions: string[];
  yearOptions: string[];
  under18: boolean;
  outsideCohort: boolean;
  age: number | null;
}) {
  return (
    <div>
      <label className={labelClass}>Date of birth</label>
      <div className="mt-3 grid max-w-md grid-cols-3 gap-2">
        <select
          aria-label="Birth month"
          value={dobMonth}
          onChange={(e) => {
            setDobMonth(e.target.value);
            setDobDay("");
          }}
          required
          className={inputClass}
        >
          <option value="">Month</option>
          {DOB_MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Birth day"
          value={dobDay}
          onChange={(e) => setDobDay(e.target.value)}
          required
          disabled={!dobMonth}
          className={inputClass}
        >
          <option value="">Day</option>
          {dayOptions.map((d) => (
            <option key={d} value={d.padStart(2, "0")}>
              {d}
            </option>
          ))}
        </select>
        <select
          aria-label="Birth year"
          value={dobYear}
          onChange={(e) => setDobYear(e.target.value)}
          required
          className={inputClass}
        >
          <option value="">Year</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {under18 && (
        <p className="mt-2 text-sm text-red-400">Must be 18 or older to apply.</p>
      )}
      {age !== null && age >= 18 && outsideCohort && (
        <p className="mt-2 text-sm text-ns-gold">
          Outside current admission window (ages {ADMISSION_AGE_MIN}–{ADMISSION_AGE_MAX}).
          You may still apply; review is case by case.
        </p>
      )}
      {age !== null && age >= 18 && admissionCohort(age) === "21-50" && (
        <p className="mt-2 text-sm text-ns-muted">
          Within current admission ages {ADMISSION_AGE_MIN}–{ADMISSION_AGE_MAX}.
        </p>
      )}
    </div>
  );
}

function HsTypeSelect({
  highSchool,
  patchHighSchool,
}: {
  highSchool: HighSchoolRecord;
  patchHighSchool: (p: Partial<HighSchoolRecord>) => void;
}) {
  return (
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
    </div>
  );
}

function GradYearSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor="hs-grad-year">
        High school graduation year
      </label>
      <select
        id="hs-grad-year"
        name="hsGradYear"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={inputClass}
      >
        <option value="" disabled>
          Select…
        </option>
        {highSchoolGraduationYears().map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
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
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  min?: number;
  max?: number;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const isControlled = value !== undefined && onChange !== undefined;
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={isControlled ? undefined : name}
        type={type}
        required={required && !isControlled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        max={max}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={inputClass}
      />
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

function Consent({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer gap-3 text-base leading-relaxed text-ns-cream">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 shrink-0 accent-ns-gold"
      />
      <span>{label}</span>
    </label>
  );
}