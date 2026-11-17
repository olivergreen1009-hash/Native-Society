import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { getOrCreateWeeklyBatch } from "@/lib/services/recommendations";
import { repositories } from "@/repositories/memory";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await repositories.users.findById(session.userId);
  if (!user?.approvedAt) {
    return NextResponse.json({ error: "Not approved" }, { status: 403 });
  }

  const { batch, refreshAt } = await getOrCreateWeeklyBatch(session.userId);
  const profiles = (
    await Promise.all(
      batch.profileIds.map(async (uid) => {
        const profile = await repositories.profiles.findByUserId(uid);
        return profile;
      }),
    )
  ).filter(Boolean);

  return NextResponse.json({
    batchId: batch.id,
    refreshAt,
    profiles,
  });
}