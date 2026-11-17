/** Core domain types — structured for future Postgres + auth provider swap-in. */

import type { InquirySubmission } from "@/lib/types";

export type UserRole = "member" | "admin";

export type ApplicationStatus =
  | "pending"
  | "more_info_needed"
  | "approved"
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
  /** Member-controlled: hidden from new batches (viewer + candidate). */
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

/** Full structured application payload (see commit 28d1000 application-form). */
export type ApplicationIntake = Omit<InquirySubmission, "id" | "createdAt">;

export interface Application {
  id: string;
  userId: string | null;
  fullName: string;
  email: string;
  dateOfBirth: string;
  location: string;
  nycUpbringing: string;
  schoolHistory: string;
  relationshipIntention: RelationshipIntention;
  referralSource: string;
  /** Present on applications submitted via the structured apply form. */
  intake?: ApplicationIntake;
  status: ApplicationStatus;
  adminNotes: string;
  submittedAt: string;
  updatedAt: string;
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
  summerDestination?: string | null;
  summerOther?: string | null;
  raisedInBorough?: string | null;
  favoriteNycDetail?: string | null;
  neighborhood: string;
  discoverable: boolean;
  completedOnboarding: boolean;
  moderationStatus: ProfileModerationStatus;
  updatedAt: string;
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