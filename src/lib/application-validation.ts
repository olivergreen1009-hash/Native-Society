import { ADMISSION_AGE_MAX, ADMISSION_AGE_MIN } from "./application-options";
import type { InquiryPoolKey, InquirySubmission } from "./types";

export function ageFromDateOfBirth(dob: string): number | null {
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const md = today.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function admissionCohort(
  age: number,
): InquirySubmission["admissionCohort"] {
  if (age >= ADMISSION_AGE_MIN && age <= ADMISSION_AGE_MAX) return "21-50";
  return "outside_cohort";
}

export function buildPoolKey(
  data: Pick<
    InquirySubmission,
    | "gender"
    | "seekingGenders"
    | "ageAtSubmission"
    | "seekingAgeMin"
    | "seekingAgeMax"
    | "locationPreference"
    | "currentArea"
  >,
): InquiryPoolKey {
  return {
    gender: data.gender,
    seekingGenders: [...data.seekingGenders].sort(),
    age: data.ageAtSubmission,
    seekingAgeMin: data.seekingAgeMin,
    seekingAgeMax: data.seekingAgeMax,
    locationPreference: data.locationPreference,
    currentArea: data.currentArea,
  };
}

/** Whether applicant A's preferences could overlap applicant B (symmetric check helper). */
export function poolsCouldReciprocate(a: InquiryPoolKey, b: InquiryPoolKey): boolean {
  const genderMatch =
    a.seekingGenders.some(
      (s) =>
        s === "open" ||
        (s === "women" && b.gender === "woman") ||
        (s === "men" && b.gender === "man") ||
        (s === "non_binary" && b.gender === "non_binary"),
    ) &&
    b.seekingGenders.some(
      (s) =>
        s === "open" ||
        (s === "women" && a.gender === "woman") ||
        (s === "men" && a.gender === "man") ||
        (s === "non_binary" && a.gender === "non_binary"),
    );
  const ageOverlap =
    a.age >= b.seekingAgeMin &&
    a.age <= b.seekingAgeMax &&
    b.age >= a.seekingAgeMin &&
    b.age <= a.seekingAgeMax;
  return genderMatch && ageOverlap;
}