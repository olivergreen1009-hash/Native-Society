import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";
import type { ProfileModerationStatus } from "@/types/domain";

export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const flagged = await repositories.profiles.listByModeration();
  const all = await repositories.profiles.listAll();
  return NextResponse.json({ flagged, all });
}

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await request.json()) as {
    profileId: string;
    moderationStatus: ProfileModerationStatus;
    discoverable?: boolean;
  };
  const profile = await repositories.profiles.findById(body.profileId);
  if (!profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const updated = await repositories.profiles.upsert({
    ...profile,
    moderationStatus: body.moderationStatus,
    discoverable:
      body.discoverable ??
      (body.moderationStatus === "approved" ? profile.discoverable : false),
  });

  await repositories.adminActions.log({
    adminId: session.userId,
    action: `profile.${body.moderationStatus}`,
    targetType: "profile",
    targetId: profile.id,
    detail: "",
  });

  return NextResponse.json({ profile: updated });
}