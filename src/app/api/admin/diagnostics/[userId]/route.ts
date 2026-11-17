import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";
import { explainCandidatePool } from "@/lib/matching/diagnostics";
import { canReceiveIntroductions } from "@/lib/membership/visibility";

type Params = { params: Promise<{ userId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;
  const viewer = await repositories.users.findById(userId);
  const viewerProfile = await repositories.profiles.findByUserId(userId);
  const viewerPrefs = await repositories.preferences.getByUserId(userId);

  if (!viewer || !viewerProfile || !viewerPrefs) {
    return NextResponse.json({ error: "Member incomplete" }, { status: 404 });
  }

  const candidates = await repositories.profiles.listAll();
  const members = await repositories.users.listMembers();
  const userMap = new Map(members.map((m) => [m.id, m]));
  const prefsMap = new Map(
    (
      await Promise.all(
        members.map(async (m) => {
          const p = await repositories.preferences.getByUserId(m.id);
          return p ? ([m.id, p] as const) : null;
        }),
      )
    ).filter(Boolean) as [string, NonNullable<Awaited<ReturnType<typeof repositories.preferences.getByUserId>>>][],
  );

  const priorInterests = await repositories.interests.listForUser(userId);
  const matches = await repositories.matches.listForUser(userId);
  const matchUserIds = new Set(
    matches.flatMap((m) =>
      m.userAId === userId ? [m.userBId] : [m.userAId],
    ),
  );

  const viewerBlocks = await repositories.blocks.listBlockedBy(userId);

  const { eligibleCount, exclusions } = await explainCandidatePool({
    viewer,
    viewerProfile,
    viewerPrefs,
    candidates,
    candidateUsers: userMap,
    candidatePrefs: prefsMap,
    priorInterests,
    matchUserIds,
    blocks: repositories.blocks,
  });

  return NextResponse.json({
    member: viewer,
    canReceiveIntroductions: canReceiveIntroductions(viewer),
    blockedCount: viewerBlocks.length,
    eligibleCount,
    exclusions: exclusions.slice(0, 25),
    viewerNotes: [
      viewer.pauseDiscovery ? "Discovery is paused" : null,
      viewer.accountStatus !== "active"
        ? `Account status: ${viewer.accountStatus}`
        : null,
      !viewerProfile.completedOnboarding ? "Onboarding incomplete" : null,
    ].filter(Boolean),
  });
}