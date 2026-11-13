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
  school: string;
  schoolVisibility: SchoolVisibility;
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

export interface InquirySubmission {
  id: string;
  name: string;
  email: string;
  school: string;
  message: string;
  createdAt: string;
}

export type CurationMap = Record<string, string[]>;
export type MemberNotesMap = Record<string, string>;
