import "server-only";

import { weeklyRecommendationBatch } from "@/lib/member-gallery-profiles";
import { getOrCreateWeeklyBatch } from "@/lib/services/recommendations";
import { repositories } from "@/repositories/memory";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  listEligibleMemberProfiles,
  rowToSocietyProfile,
  type MemberProfileRow,
} from "@/lib/supabase/member-profiles";
import { societyProfileFromDomain } from "@/lib/gallery/profile-to-society";
import { canReceiveIntroductions } from "@/lib/membership/visibility";
import type { SocietyProfile } from "@/lib/types";

const MIN_REAL_MEMBERS = 3;
const BATCH_SIZE = 5;

function startOfWeek(d: Date): string {
  const copy = new Date(d);
  const day = copy.getUTCDay();
  const diff = (day + 6) % 7;
  copy.setUTCDate(copy.getUTCDate() - diff);
  copy.setUTCHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

function simplePickBatch(
  viewerId: string,
  rows: MemberProfileRow[],
  viewerPrefs: { ageMin: number; ageMax: number } | null,
): string[] {
  const eligible = rows.filter((r) => {
    if (!r.age) return true;
    if (!viewerPrefs) return true;
    return r.age >= viewerPrefs.ageMin && r.age <= viewerPrefs.ageMax;
  });
  return eligible.slice(0, BATCH_SIZE).map((r) => r.user_id);
}

export type WeeklyGalleryResponse = {
  profiles: SocietyProfile[];
  batchId: string;
  usingSamples: boolean;
  weekOf: string;
};

export async function getWeeklyGallery(
  viewerUserId: string,
): Promise<WeeklyGalleryResponse> {
  const weekOf = startOfWeek(new Date());
  const supabase = getSupabaseServerClient();

  if (supabase) {
    const eligible = await listEligibleMemberProfiles(supabase, viewerUserId);
    if (eligible.length < MIN_REAL_MEMBERS) {
      return {
        profiles: weeklyRecommendationBatch(),
        batchId: `sample-${viewerUserId}-${weekOf}`,
        usingSamples: true,
        weekOf,
      };
    }

    const viewerPrefs = await repositories.preferences.getByUserId(viewerUserId);
    const picked = simplePickBatch(viewerUserId, eligible, viewerPrefs);

    const batchId = `batch-${viewerUserId}-${weekOf}`;
    await supabase.from("weekly_batches").upsert(
      {
        id: batchId,
        viewer_user_id: viewerUserId,
        week_of: weekOf,
        member_user_ids: picked,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "id" },
    );

    const byId = new Map(eligible.map((r) => [r.user_id, r]));
    const profiles = picked
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((r) => rowToSocietyProfile(r!));

    return { profiles, batchId, usingSamples: false, weekOf };
  }

  const viewer = await repositories.users.findById(viewerUserId);
  const discoverable = await repositories.profiles.listDiscoverable();
  const realCount = discoverable.filter((p) => p.userId !== viewerUserId).length;

  if (!viewer || !canReceiveIntroductions(viewer) || realCount < MIN_REAL_MEMBERS) {
    return {
      profiles: weeklyRecommendationBatch(),
      batchId: `sample-${viewerUserId}-${weekOf}`,
      usingSamples: true,
      weekOf,
    };
  }

  try {
    const { batch } = await getOrCreateWeeklyBatch(viewerUserId);
    const profiles: SocietyProfile[] = [];
    for (const uid of batch.profileIds) {
      const profile = await repositories.profiles.findByUserId(uid);
      if (profile) profiles.push(societyProfileFromDomain(profile));
    }
    return {
      profiles,
      batchId: batch.id,
      usingSamples: false,
      weekOf: batch.weekOf,
    };
  } catch {
    return {
      profiles: weeklyRecommendationBatch(),
      batchId: `sample-${viewerUserId}-${weekOf}`,
      usingSamples: true,
      weekOf,
    };
  }
}

export async function recordGalleryAction(input: {
  fromUserId: string;
  toUserId: string;
  batchId: string;
  decision: "interested" | "pass";
  message?: string;
}): Promise<{ mutual: boolean; matchId?: string }> {
  const supabase = getSupabaseServerClient();

  if (
    supabase &&
    !input.batchId.startsWith("sample-") &&
    !input.toUserId.startsWith("example-")
  ) {
    const actionId = `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await supabase.from("batch_actions").upsert({
      id: actionId,
      batch_id: input.batchId,
      from_user_id: input.fromUserId,
      to_user_id: input.toUserId,
      decision: input.decision,
    });

    if (input.decision === "pass") return { mutual: false };

    const { data: reciprocal } = await supabase
      .from("batch_actions")
      .select("decision")
      .eq("from_user_id", input.toUserId)
      .eq("to_user_id", input.fromUserId)
      .eq("decision", "interested")
      .maybeSingle();

    if (!reciprocal) return { mutual: false };

    const matchId = `match-${input.fromUserId}-${input.toUserId}`;
    await supabase.from("member_matches").upsert({
      id: matchId,
      user_a_id: input.fromUserId,
      user_b_id: input.toUserId,
    });
    return { mutual: true, matchId };
  }

  const { recordInterestAction } = await import("@/lib/services/recommendations");
  return recordInterestAction({
    fromUserId: input.fromUserId,
    toUserId: input.toUserId,
    batchId: input.batchId,
    decision: input.decision,
  });
}

export async function listIntroductionsForUser(
  viewerUserId: string,
): Promise<
  Array<{
    id: string;
    profileId: string;
    message: string;
    status: "pending" | "mutual_confirmed";
    createdAt: string;
    profile?: SocietyProfile;
  }>
> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    const { data: actions } = await supabase
      .from("batch_actions")
      .select("*")
      .eq("from_user_id", viewerUserId)
      .eq("decision", "interested")
      .order("created_at", { ascending: false });

    const rows = (actions ?? []) as Array<{
      id: string;
      to_user_id: string;
      created_at: string;
      batch_id: string;
    }>;

    const out = [];
    for (const a of rows) {
      const { data: member } = await supabase
        .from("member_profiles")
        .select("*")
        .eq("user_id", a.to_user_id)
        .maybeSingle();
      const { data: reciprocal } = await supabase
        .from("batch_actions")
        .select("id")
        .eq("from_user_id", a.to_user_id)
        .eq("to_user_id", viewerUserId)
        .eq("decision", "interested")
        .maybeSingle();

      out.push({
        id: a.id,
        profileId: a.to_user_id,
        message: "",
        status: reciprocal ? ("mutual_confirmed" as const) : ("pending" as const),
        createdAt: a.created_at,
        profile: member ? rowToSocietyProfile(member as MemberProfileRow) : undefined,
      });
    }
    return out;
  }

  const interests = await repositories.interests.listForUser(viewerUserId);
  const interested = interests.filter(
    (i) => i.fromUserId === viewerUserId && i.decision === "interested",
  );
  const out = [];
  for (const a of interested) {
    const reciprocal = await repositories.interests.getDecision(
      a.toUserId,
      viewerUserId,
    );
    const profile = await repositories.profiles.findByUserId(a.toUserId);
    out.push({
      id: a.id,
      profileId: a.toUserId,
      message: "",
      status:
        reciprocal?.decision === "interested"
          ? ("mutual_confirmed" as const)
          : ("pending" as const),
      createdAt: a.createdAt,
      profile: profile ? societyProfileFromDomain(profile) : undefined,
    });
  }
  return out;
}