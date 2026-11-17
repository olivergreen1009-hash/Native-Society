export type MembershipTier = "founding" | "private" | "legacy";

export type SchoolVisibility =
  | "visible"
  | "hidden"
  | "after_mutual_interest";

export interface SocietyProfile {
  id: string;
  firstName: string;
  displayInitial: string;
  age: number;
  neighborhood: string;
  /** Childhood borough or “Raised in the city” — optional NYC roots */
  raisedInBorough?: string;
  favoriteNycDetail?: string;
  /** Full lineage for gallery cards, e.g. Chapin → Dartmouth */
  schoolLine?: string;
  school: string;
  schoolVisibility: SchoolVisibility;
  summerDestination?: string;
  summerOther?: string;
  /** Landing-style sample when true */
  isSample?: boolean;
  profession: string;
  memberBio: string;
  interests: string[];
  imageUrl: string;
  conciergeNote: string;
  /** @deprecated use memberBio */
  bio?: string;
  compatibilityNotes?: string;
}

export interface MemberAccount {
  id: string;
  email: string;
  name: string;
  tier: MembershipTier;
  neighborhood: string;
  school: string;
  bio: string;
  role: "member" | "admin";
}

export type IntroductionStatus =
  | "pending"
  | "mutual_confirmed"
  | "coordinated"
  | "introduced";

export interface IntroductionRequest {
  id: string;
  memberId: string;
  profileId: string;
  message: string;
  status: IntroductionStatus;
  curatorNote: string;
  createdAt: string;
  coordinatedAt: string | null;
}

export interface FoundingQuestionnaire {
  memberId: string;
  currentSection: number;
  submittedAt: string | null;
  sections: {
    relationshipIntent: Record<string, string>;
    valuesLife: Record<string, string>;
    lifestyle: Record<string, string>;
    partnerPrefs: Record<string, string>;
    profileVisibility: Record<string, string>;
  };
}

export interface HighSchoolRecord {
  schoolName: string;
  schoolType: string;
  graduationYear: string;
  familyHomeDuringHighSchool: string;
}

export interface OptionalSchoolRecord {
  level: "elementary_middle" | "college";
  schoolName: string;
  graduationYear?: string;
}

/** Optional headshot stored inline in application raw_data for now. */
export interface ApplicationProfilePhoto {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  dataBase64: string;
}

export interface InquiryPoolKey {
  gender: string;
  seekingGenders: string[];
  age: number;
  seekingAgeMin: number;
  seekingAgeMax: number;
  locationPreference: string;
  currentArea: string;
}

export interface InquirySubmission {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  emailVerified: boolean;
  dateOfBirth: string;
  ageAtSubmission: number;
  admissionCohort: "21-50" | "outside_cohort";
  currentArea: string;
  neighborhood?: string;
  gender: string;
  genderSelfDescribe?: string;
  seekingGenders: string[];
  seekingAgeMin: number;
  seekingAgeMax: number;
  locationPreference: string;
  relationshipIntention: string;
  optionalNote?: string;
  occupation: string;
  summerDestination: string;
  summerOther?: string;
  charityBoardInvolvement?: string;
  shortBio: string;
  profilePhoto?: ApplicationProfilePhoto;
  highSchool: HighSchoolRecord;
  elementaryMiddle?: OptionalSchoolRecord;
  college?: OptionalSchoolRecord;
  nycYearsBefore18: string;
  heardAbout: string;
  referrerName?: string;
  consents: {
    age18: boolean;
    termsPrivacy: boolean;
    billingAfterPool: boolean;
    applicationReview: boolean;
  };
  poolKey: InquiryPoolKey;
}

export type CurationMap = Record<string, string[]>;
export type MemberNotesMap = Record<string, string>;
