import type {
  ApplicationProfilePhoto,
  HighSchoolRecord,
  InquiryPoolKey,
  InquirySubmission,
  OptionalSchoolRecord,
} from "@/lib/types";
import { SUMMER_DESTINATIONS } from "@/lib/application-options";

const MAX_PROFILE_PHOTO_BYTES = 1.5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function validateProfilePhoto(
  photo: ApplicationProfilePhoto | undefined,
): string | null {
  if (!photo) return null;
  if (!ALLOWED_PHOTO_TYPES.has(photo.mimeType)) {
    return "Profile photo must be a JPEG, PNG, or WebP image.";
  }
  if (photo.sizeBytes > MAX_PROFILE_PHOTO_BYTES) {
    return "Profile photo must be 1.5 MB or smaller.";
  }
  if (!photo.dataBase64?.trim()) {
    return "Profile photo upload failed. Try again or submit without a photo.";
  }
  return null;
}
import {
  admissionCohort,
  ageFromDateOfBirth,
  buildPoolKey,
} from "@/lib/application-validation";
import type { Application, ApplicationIntake, RelationshipIntention } from "@/types/domain";

const INTENTION_TO_DOMAIN: Record<string, RelationshipIntention> = {
  "Long-term partnership": "long_term",
  "Marriage-minded": "marriage_minded",
  "Dating to see what happens": "open_to_explore",
  "Seriously dating": "open_to_explore",
};

export type ApplicationSubmitBody = Omit<
  InquirySubmission,
  "id" | "createdAt" | "poolKey" | "admissionCohort" | "ageAtSubmission"
>;

export function formatSchoolHistory(
  hs: HighSchoolRecord,
  elementaryMiddle?: OptionalSchoolRecord,
  college?: OptionalSchoolRecord,
): string {
  const parts = [`${hs.schoolName} (${hs.schoolType}, ${hs.graduationYear})`];
  if (elementaryMiddle?.schoolName) {
    parts.unshift(elementaryMiddle.schoolName);
  }
  if (college?.schoolName) {
    parts.push(college.schoolName);
  }
  return parts.join(" → ");
}

export function formatLocation(currentArea: string, neighborhood?: string): string {
  return neighborhood ? `${neighborhood}, ${currentArea}` : currentArea;
}

export function formatNycUpbringing(nycYearsBefore18: string): string {
  return `Lived in NYC before 18: ${nycYearsBefore18}`;
}

export function formatReferral(heardAbout: string, referrerName?: string): string {
  return referrerName ? `${heardAbout} (${referrerName})` : heardAbout;
}

export function mapRelationshipIntention(label: string): RelationshipIntention {
  return INTENTION_TO_DOMAIN[label] ?? "not_sure";
}

export function validateApplicationBody(
  body: ApplicationSubmitBody,
): { ok: true; intake: ApplicationIntake } | { ok: false; error: string } {
  const name = body.name?.trim();
  const email = body.email?.trim();
  const dateOfBirth = body.dateOfBirth?.trim();

  if (!name || !email || !dateOfBirth) {
    return { ok: false, error: "Please complete all required fields." };
  }

  const ageAtSubmission = ageFromDateOfBirth(dateOfBirth);
  if (ageAtSubmission === null) {
    return { ok: false, error: "Enter a valid date of birth." };
  }
  if (ageAtSubmission < 18) {
    return { ok: false, error: "You must be at least 18 to apply." };
  }

  const hs = body.highSchool;
  if (
    !hs?.schoolName?.trim() ||
    !hs.schoolType ||
    !hs.graduationYear?.trim() ||
    !hs.familyHomeDuringHighSchool
  ) {
    return { ok: false, error: "Complete the required high school section." };
  }

  if (!body.nycYearsBefore18) {
    return {
      ok: false,
      error: "Select how long you lived in New York City before turning 18.",
    };
  }

  const { seekingAgeMin, seekingAgeMax } = body;
  if (
    seekingAgeMin === undefined ||
    seekingAgeMax === undefined ||
    Number.isNaN(seekingAgeMin) ||
    Number.isNaN(seekingAgeMax) ||
    seekingAgeMin < 18 ||
    seekingAgeMax < seekingAgeMin
  ) {
    return { ok: false, error: "Enter a valid age range for who you want to meet." };
  }

  if (!body.locationPreference || !body.relationshipIntention) {
    return { ok: false, error: "Select location preference and relationship intention." };
  }

  if (!body.gender || !body.seekingGenders?.length) {
    return { ok: false, error: "Select your gender and who you want to meet." };
  }

  if (body.gender === "self_describe" && !body.genderSelfDescribe?.trim()) {
    return { ok: false, error: "Please describe how you identify." };
  }

  const consents = body.consents;
  if (
    !consents?.age18 ||
    !consents.termsPrivacy ||
    !consents.billingAfterPool ||
    !consents.applicationReview
  ) {
    return { ok: false, error: "Please accept all required confirmations." };
  }

  if (!body.currentArea || !body.heardAbout) {
    return { ok: false, error: "Complete all required sections." };
  }

  const occupation = body.occupation?.trim();
  if (!occupation) {
    return { ok: false, error: "Enter your occupation or industry." };
  }

  const summerDestination = body.summerDestination?.trim();
  if (!summerDestination || !SUMMER_DESTINATIONS.includes(summerDestination as (typeof SUMMER_DESTINATIONS)[number])) {
    return { ok: false, error: "Select where you usually summer." };
  }

  let summerOther: string | undefined;
  if (summerDestination === "Other") {
    summerOther = body.summerOther?.trim();
    if (!summerOther) {
      return { ok: false, error: "Describe where you summer when selecting Other." };
    }
  }

  const shortBio = body.shortBio?.trim();
  if (!shortBio || shortBio.length < 40) {
    return {
      ok: false,
      error: "Add a short bio or what you are looking for (at least 40 characters).",
    };
  }

  const photoError = validateProfilePhoto(body.profilePhoto);
  if (photoError) {
    return { ok: false, error: photoError };
  }

  const poolKey: InquiryPoolKey = buildPoolKey({
    gender: body.gender,
    seekingGenders: body.seekingGenders,
    ageAtSubmission,
    seekingAgeMin,
    seekingAgeMax,
    locationPreference: body.locationPreference,
    currentArea: body.currentArea,
  });

  const intake: ApplicationIntake = {
    name,
    email: email.toLowerCase(),
    emailVerified: false,
    dateOfBirth,
    ageAtSubmission,
    admissionCohort: admissionCohort(ageAtSubmission),
    currentArea: body.currentArea,
    neighborhood: body.neighborhood?.trim() || undefined,
    gender: body.gender,
    genderSelfDescribe:
      body.gender === "self_describe"
        ? body.genderSelfDescribe?.trim()
        : undefined,
    seekingGenders: [...body.seekingGenders],
    seekingAgeMin,
    seekingAgeMax,
    locationPreference: body.locationPreference,
    relationshipIntention: body.relationshipIntention,
    optionalNote: body.optionalNote?.trim() || undefined,
    occupation,
    summerDestination,
    summerOther,
    charityBoardInvolvement: body.charityBoardInvolvement?.trim() || undefined,
    shortBio,
    profilePhoto: body.profilePhoto,
    highSchool: {
      schoolName: hs.schoolName.trim(),
      schoolType: hs.schoolType,
      graduationYear: hs.graduationYear.trim(),
      familyHomeDuringHighSchool: hs.familyHomeDuringHighSchool,
    },
    elementaryMiddle: body.elementaryMiddle,
    college: body.college,
    nycYearsBefore18: body.nycYearsBefore18,
    heardAbout: body.heardAbout,
    referrerName: body.referrerName?.trim() || undefined,
    consents,
    poolKey,
  };

  return { ok: true, intake };
}

export function applicationFromIntake(intake: ApplicationIntake): Omit<
  Application,
  "id" | "submittedAt" | "updatedAt" | "status" | "adminNotes"
> {
  return {
    userId: null,
    fullName: intake.name,
    email: intake.email,
    dateOfBirth: intake.dateOfBirth,
    location: formatLocation(intake.currentArea, intake.neighborhood),
    nycUpbringing: formatNycUpbringing(intake.nycYearsBefore18),
    schoolHistory: formatSchoolHistory(
      intake.highSchool,
      intake.elementaryMiddle,
      intake.college,
    ),
    relationshipIntention: mapRelationshipIntention(intake.relationshipIntention),
    referralSource: formatReferral(intake.heardAbout, intake.referrerName),
    intake,
  };
}