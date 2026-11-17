/**
 * Matching rules (phase 1 — mock implementation):
 *
 * 1. Viewer must be approved + active with a completed profile.
 * 2. Candidates must be approved, active, discoverable members.
 * 3. Preference overlap: gender + age range + intention (soft).
 * 4. Exclude blocked users (either direction).
 * 5. Exclude prior mutual matches and prior pass decisions by viewer.
 * 6. Soft sort: shared interests count (desc), then rotate exposure by week seed.
 *
 * Pass decisions are never revealed to the passed member.
 */

import type {
  InterestRecord,
  Preferences,
  Profile,
  User,
} from "@/types/domain";
import type { BlockRepository } from "@/repositories/interfaces";
import {
  canReceiveIntroductions,
  isIntroductionCandidate,
} from "@/lib/membership/visibility";

export interface MatcherContext {
  viewer: User;
  viewerProfile: Profile;
  viewerPrefs: Preferences;
  candidates: Profile[];
  candidateUsers: Map<string, User>;
  candidatePrefs: Map<string, Preferences>;
  priorInterests: InterestRecord[];
  blocks: BlockRepository;
}

function preferenceOverlap(
  viewerPrefs: Preferences,
  candidatePrefs: Preferences | undefined,
  candidateProfile: Profile,
): boolean {
  if (!candidatePrefs) return true;
  const genderOk = candidatePrefs.genders.length === 0;
  void genderOk;
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

function sharedInterests(a: string[], b: string[]): number {
  const set = new Set(a.map((s) => s.toLowerCase()));
  return b.filter((i) => set.has(i.toLowerCase())).length;
}

function weekRotationSeed(userId: string, weekOf: string): number {
  let hash = 0;
  const key = `${userId}:${weekOf}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function buildWeeklyBatch(
  ctx: MatcherContext,
  weekOf: string,
  batchSize = 5,
): Promise<string[]> {
  if (!canReceiveIntroductions(ctx.viewer)) return [];
  const passed = new Set(
    ctx.priorInterests
      .filter((i) => i.fromUserId === ctx.viewer.id && i.decision === "pass")
      .map((i) => i.toUserId),
  );
  const alreadyInterested = new Set(
    ctx.priorInterests
      .filter((i) => i.fromUserId === ctx.viewer.id)
      .map((i) => i.toUserId),
  );

  const eligible: Array<{ userId: string; score: number; rotate: number }> = [];

  for (const profile of ctx.candidates) {
    if (profile.userId === ctx.viewer.id) continue;
    const user = ctx.candidateUsers.get(profile.userId);
    if (!user || !isIntroductionCandidate(user, profile)) continue;
    if (passed.has(profile.userId) || alreadyInterested.has(profile.userId))
      continue;
    if (await ctx.blocks.isBlocked(ctx.viewer.id, profile.userId)) continue;

    const prefs = ctx.candidatePrefs.get(profile.userId);
    if (!preferenceOverlap(ctx.viewerPrefs, prefs, profile)) continue;

    const score = sharedInterests(
      ctx.viewerProfile.interests,
      profile.interests,
    );
    const rotate =
      weekRotationSeed(profile.userId, weekOf) ^
      weekRotationSeed(ctx.viewer.id, weekOf);
    eligible.push({ userId: profile.userId, score, rotate });
  }

  eligible.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.rotate - b.rotate;
  });

  return eligible.slice(0, batchSize).map((e) => e.userId);
}

export function nextWeeklyRefresh(from: Date = new Date()): Date {
  const d = new Date(from);
  const day = d.getUTCDay();
  const daysUntilMonday = (8 - day) % 7 || 7;
  d.setUTCDate(d.getUTCDate() + daysUntilMonday);
  d.setUTCHours(9, 0, 0, 0);
  return d;
}