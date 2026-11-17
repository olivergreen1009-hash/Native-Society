import type {
  InterestRecord,
  Preferences,
  Profile,
  User,
} from "@/types/domain";
import type { CandidateExclusionReason } from "@/types/domain";
import type { BlockRepository } from "@/repositories/interfaces";
import { isIntroductionCandidate } from "@/lib/membership/visibility";

function preferenceOverlap(
  viewerPrefs: Preferences,
  candidatePrefs: Preferences | undefined,
  candidateProfile: Profile,
): boolean {
  if (!candidatePrefs) return true;
  const ageOk =
    candidateProfile.age >= viewerPrefs.ageMin &&
    candidateProfile.age <= viewerPrefs.ageMax;
  const intentionOk =
    viewerPrefs.relationshipIntention.length === 0 ||
    candidatePrefs.relationshipIntention.some((i) =>
      viewerPrefs.relationshipIntention.includes(i),
    );
  return ageOk && intentionOk;
}

export async function explainCandidatePool(input: {
  viewer: User;
  viewerProfile: Profile;
  viewerPrefs: Preferences;
  candidates: Profile[];
  candidateUsers: Map<string, User>;
  candidatePrefs: Map<string, Preferences>;
  priorInterests: InterestRecord[];
  matchUserIds: Set<string>;
  blocks: BlockRepository;
}): Promise<{
  eligibleCount: number;
  exclusions: CandidateExclusionReason[];
}> {
  const passed = new Set(
    input.priorInterests
      .filter((i) => i.fromUserId === input.viewer.id && i.decision === "pass")
      .map((i) => i.toUserId),
  );
  const alreadyInterested = new Set(
    input.priorInterests
      .filter((i) => i.fromUserId === input.viewer.id)
      .map((i) => i.toUserId),
  );

  const exclusions: CandidateExclusionReason[] = [];
  let eligibleCount = 0;

  for (const profile of input.candidates) {
    if (profile.userId === input.viewer.id) continue;
    const user = input.candidateUsers.get(profile.userId);
    const reasons: string[] = [];

    if (!user) reasons.push("No member account linked");
    else {
      if (!user.active) reasons.push("Member inactive");
      if (!user.approvedAt) reasons.push("Not approved");
      if (user.accountStatus === "suspended") reasons.push("Suspended");
      if (user.accountStatus === "removed") reasons.push("Removed");
      if (user.accountStatus === "pending_deletion") {
        reasons.push("Pending deletion");
      }
      if (user.pauseDiscovery) reasons.push("Discovery paused");
    }
    if (!profile.discoverable) reasons.push("Profile not discoverable");
    if (profile.moderationStatus === "hidden") reasons.push("Hidden by moderation");
    if (profile.moderationStatus === "flagged") reasons.push("Flagged for review");
    if (profile.moderationStatus === "pending_review") {
      reasons.push("Awaiting profile approval");
    }
    if (passed.has(profile.userId)) reasons.push("You already passed");
    if (alreadyInterested.has(profile.userId)) {
      reasons.push("You already recorded interest");
    }
    if (input.matchUserIds.has(profile.userId)) {
      reasons.push("Already matched");
    }
    if (await input.blocks.isBlocked(input.viewer.id, profile.userId)) {
      reasons.push("Blocked");
    }
    const prefs = input.candidatePrefs.get(profile.userId);
    if (user && !preferenceOverlap(input.viewerPrefs, prefs, profile)) {
      reasons.push("Outside your preference filters");
    }
    if (user && profile) {
      const wouldShow = isIntroductionCandidate(user, profile);
      if (wouldShow && reasons.length === 0) eligibleCount += 1;
    }

    if (reasons.length > 0) {
      exclusions.push({
        userId: profile.userId,
        firstName: profile.firstName,
        reasons,
      });
    }
  }

  return { eligibleCount, exclusions };
}