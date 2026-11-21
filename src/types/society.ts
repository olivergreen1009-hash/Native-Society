/** Native Society — professional introduction service (not dating). */

export type MemberLifecycleState =
  | "applied"
  | "reviewed"
  | "qualified_waiting"
  | "invited_to_activate"
  | "active"
  | "paused"
  | "closed";

export type IntroductionProposalState =
  | "draft"
  | "awaiting_responses"
  | "mutually_accepted"
  | "introduced"
  | "follow_up_complete"
  | "declined"
  | "expired"
  | "withdrawn";

export type ProposalMemberResponse = "pending" | "accepted" | "declined";

export interface SocietyApplicationShareable {
  fullName: string;
  email: string;
  /** Substantive connection to NYC real estate or hospitality */
  industryConnection: string;
  /** What would make an introduction useful right now */
  introductionUsefulness: string;
  experiencePerspective: string;
  specificInterests: string;
}

export interface SocietyApplicationFounderOnly {
  roleOwnershipDetail: string;
  familyIndustryTies: string;
  additionalContext: string;
}

export interface SocietyApplicationConsents {
  notDatingService: boolean;
  termsPrivacy: boolean;
  /** No payment collected with the application */
  noPaymentWithApplication: boolean;
}

export interface SocietyApplicationRawData {
  shareable: SocietyApplicationShareable;
  founderOnly: SocietyApplicationFounderOnly;
  consents: SocietyApplicationConsents;
  referralSource?: string;
}

export interface IntroductionProposal {
  id: string;
  /** Member who receives this proposal in their inbox */
  recipientMemberId: string;
  /** Counterparty member id (limited profile shown in UI) */
  counterpartMemberId: string;
  state: IntroductionProposalState;
  proposalText: string;
  reason: string;
  limitedProfileSnapshot: {
    displayName: string;
    headline: string;
    industryContext: string;
  };
  recipientResponse: ProposalMemberResponse;
  counterpartResponse: ProposalMemberResponse;
  createdAt: string;
  updatedAt: string;
}

export const MEMBER_LIFECYCLE_LABELS: Record<MemberLifecycleState, string> = {
  applied: "Applied",
  reviewed: "Reviewed",
  qualified_waiting: "Qualified / waiting",
  invited_to_activate: "Invited to activate",
  active: "Active",
  paused: "Paused",
  closed: "Closed",
};

export const INTRODUCTION_STATE_LABELS: Record<IntroductionProposalState, string> = {
  draft: "Draft",
  awaiting_responses: "Awaiting responses",
  mutually_accepted: "Mutually accepted",
  introduced: "Introduced",
  follow_up_complete: "Follow-up complete",
  declined: "Declined",
  expired: "Expired",
  withdrawn: "Withdrawn",
};