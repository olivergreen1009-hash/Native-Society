import { repositories } from "@/repositories/memory";
import {
  buildWeeklyBatch,
  nextWeeklyRefresh,
} from "@/lib/matching/matcher";
import type { RecommendationBatch } from "@/types/domain";

function startOfWeek(d: Date): string {
  const copy = new Date(d);
  const day = copy.getUTCDay();
  const diff = (day + 6) % 7;
  copy.setUTCDate(copy.getUTCDate() - diff);
  copy.setUTCHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

export async function getOrCreateWeeklyBatch(
  userId: string,
): Promise<{ batch: RecommendationBatch; refreshAt: string }> {
  const weekOf = startOfWeek(new Date());
  const existing = await repositories.recommendations.getCurrentBatch(userId);
  if (existing && existing.weekOf === weekOf) {
    return { batch: existing, refreshAt: nextWeeklyRefresh().toISOString() };
  }

  const viewer = await repositories.users.findById(userId);
  const viewerProfile = await repositories.profiles.findByUserId(userId);
  const viewerPrefs = await repositories.preferences.getByUserId(userId);
  if (!viewer || !viewerProfile || !viewerPrefs) {
    throw new Error("PROFILE_INCOMPLETE");
  }

  const candidates = await repositories.profiles.listDiscoverable();
  const memberUsers = await repositories.users.listActiveMembers();
  const userMap = new Map(memberUsers.map((u) => [u.id, u]));
  const prefsMap = new Map<string, Awaited<ReturnType<typeof repositories.preferences.getByUserId>>>();
  for (const u of memberUsers) {
    const p = await repositories.preferences.getByUserId(u.id);
    if (p) prefsMap.set(u.id, p);
  }

  const priorInterests = await repositories.interests.listForUser(userId);

  const profileIds = await buildWeeklyBatch(
    {
      viewer,
      viewerProfile,
      viewerPrefs,
      candidates,
      candidateUsers: userMap,
      candidatePrefs: prefsMap as Map<string, NonNullable<typeof viewerPrefs>>,
      priorInterests,
      blocks: repositories.blocks,
    },
    weekOf,
    5,
  );

  const batch = await repositories.recommendations.saveBatch({
    id: `batch-${userId}-${weekOf}`,
    userId,
    profileIds,
    weekOf,
    expiresAt: nextWeeklyRefresh().toISOString(),
    createdAt: new Date().toISOString(),
  });

  return { batch, refreshAt: batch.expiresAt };
}

export async function recordInterestAction(input: {
  fromUserId: string;
  toUserId: string;
  batchId: string;
  decision: "interested" | "pass";
  report?: { reason: string; detail: string };
}): Promise<{ mutual: boolean; matchId?: string }> {
  await repositories.interests.record({
    fromUserId: input.fromUserId,
    toUserId: input.toUserId,
    batchId: input.batchId,
    decision: input.decision,
  });

  if (input.decision === "pass") {
    return { mutual: false };
  }

  const reciprocal = await repositories.interests.getDecision(
    input.toUserId,
    input.fromUserId,
  );
  if (reciprocal?.decision !== "interested") {
    return { mutual: false };
  }

  const existing = await repositories.matches.findBetween(
    input.fromUserId,
    input.toUserId,
  );
  if (existing) return { mutual: true, matchId: existing.id };

  const match = await repositories.matches.create({
    userAId: input.fromUserId,
    userBId: input.toUserId,
  });
  return { mutual: true, matchId: match.id };
}