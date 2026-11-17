import type { Profile, User } from "@/types/domain";

export function canSignIn(user: User): boolean {
  if (!user.active) return false;
  if (user.accountStatus === "suspended") return false;
  if (user.accountStatus === "removed") return false;
  return true;
}

/** Eligible to appear in others' introduction batches. */
export function isIntroductionCandidate(user: User, profile: Profile): boolean {
  if (!user.active || !user.approvedAt) return false;
  if (user.accountStatus !== "active") return false;
  if (user.pauseDiscovery) return false;
  if (!profile.discoverable) return false;
  if (profile.moderationStatus !== "approved") return false;
  return true;
}

/** Eligible to receive a new weekly batch. */
export function canReceiveIntroductions(user: User): boolean {
  if (!user.active || !user.approvedAt) return false;
  if (user.accountStatus !== "active") return false;
  if (user.pauseDiscovery) return false;
  return true;
}