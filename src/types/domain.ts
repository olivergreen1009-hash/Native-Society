/** Core domain types — structured for future Postgres + auth provider swap-in. */

import type {
  MemberLifecycleState,
  SocietyApplicationRawData,
} from "@/types/society";

export type UserRole = "member" | "admin";

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "more_info_needed"
  | "qualified_waiting"
  | "invited_to_activate"
  | "declined";

export type RelationshipIntention =
  | "long_term"
  | "marriage_minded"
  | "open_to_explore"
  | "not_sure";

export type GenderIdentity = "woman" | "man" | "non_binary" | "other";

export type InterestDecision = "interested" | "pass";

export type ReportReason =
  | "inappropriate"
  | "harassment"
  | "misrepresentation"
  | "other";

/** Optional billing fields for future Stripe integration — unused in phase 1 UI. */
export interface UserBillingFields {
  stripeCustomerId?: string | null;
  subscriptionStatus?: "none" | "active" | "past_due" | "canceled";
  planId?: string | null;
}

export type AccountStatus = "active" | "suspended" | "removed" | "pending_deletion";

export interface User extends UserBillingFields {
  id: string;
  email: string;
  passwordHash?: string | null;
  role: UserRole;
  createdAt: string;
  approvedAt: string | null;
  active: boolean;
  applicationId: string | null;
  /** Society introduction lifecycle (see product brief). */
  memberLifecycleState?: MemberLifecycleState;
  /** Member-controlled: pause new introduction proposals. */
  pauseDiscovery: boolean;
  accountStatus: AccountStatus;
  pendingDeletionRequestedAt: string | null;
  suspendedAt: string | null;
}

export interface NotificationPreferences {
  userId: string;
  emailNewIntroductions: boolean;
  emailMutualMatches: boolean;
  emailMessages: boolean;
  inAppNewIntroductions: boolean;
  inAppMutualMatches: boolean;
  inAppMessages: boolean;
}

export type ProfileModerationStatus =
  | "approved"
  | "pending_review"
  | "hidden"
  | "flagged";

export type ReportStatus = "open" | "dismissed" | "escalated";

export interface Application {
  id: string;
  userId: string | null;
  fullName: string;
  email: string;
  status: ApplicationStatus;
  adminNotes: string;
  submittedAt: string;
  updatedAt: string;
  rawData: SocietyApplicationRawData;
  /** @deprecated legacy dating-era intake — optional for seeded demos */
  dateOfBirth?: string;
  location?: string;
  nycUpbringing?: string;
  schoolHistory?: string;
  relationshipIntention?: RelationshipIntention;
  referralSource?: string;
}

export interface ProfilePhoto {
  id: string;
  profileId: string;
  url: string;
  sortOrder: number;
}

export interface ProfilePrompt {
  id: string;
  question: string;
  answer: string;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  age: number;
  bio: string;
  photos: ProfilePhoto[];
  prompts: ProfilePrompt[];
  interests: string[];
  schoolLine: string | null;
  neighborhood: string;
  discoverable: boolean;
  completedOnboarding: boolean;
  moderationStatus: ProfileModerationStatus;
  updatedAt: string;
  /** @deprecated gallery-era fields — optional for legacy rows */
  raisedInBorough?: string | null;
  summerDestination?: string | null;
  summerOther?: string | null;
  favoriteNycDetail?: string | null;
}

export interface Preferences {
  userId: string;
  genders: GenderIdentity[];
  ageMin: number;
  ageMax: number;
  locationRadius: "nyc" | "tri_state" | "anywhere";
  relationshipIntention: RelationshipIntention[];
}

export interface RecommendationBatch {
  id: string;
  userId: string;
  profileIds: string[];
  weekOf: string;
  expiresAt: string;
  createdAt: string;
}

export interface InterestRecord {
  id: string;
  fromUserId: string;
  toUserId: string;
  decision: InterestDecision;
  batchId: string;
  createdAt: string;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: ReportReason;
  detail: string;
  status: ReportStatus;
  adminNote: string;
  createdAt: string;
  resolvedAt: string | null;
}

export interface CandidateExclusionReason {
  userId: string;
  firstName: string;
  reasons: string[];
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  detail: string;
  createdAt: string;
}

export interface MagicLinkToken {
  token: string;
  email: string;
  expiresAt: string;
}