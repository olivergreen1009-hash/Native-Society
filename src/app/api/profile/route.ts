import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";
import {
  normalizeIcebreaker,
  validateIcebreaker,
} from "@/lib/profile-field-validation";
import type { Preferences, Profile } from "@/types/domain";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = await repositories.profiles.findByUserId(session.userId);
  const preferences = await repositories.preferences.getByUserId(session.userId);
  const user = await repositories.users.findById(session.userId);
  return NextResponse.json({ profile, preferences, user });
}

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    profile: Profile;
    preferences: Preferences;
  };

  if (body.profile.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const favoriteNycDetail = normalizeIcebreaker(body.profile.favoriteNycDetail);
  const icebreakerErr = validateIcebreaker(favoriteNycDetail);
  if (icebreakerErr) {
    return NextResponse.json({ error: icebreakerErr }, { status: 400 });
  }

  const savedProfile = await repositories.profiles.upsert({
    ...body.profile,
    favoriteNycDetail: favoriteNycDetail || null,
    completedOnboarding: true,
    discoverable: true,
  });
  const savedPrefs = await repositories.preferences.upsert({
    ...body.preferences,
    userId: session.userId,
  });

  return NextResponse.json({ profile: savedProfile, preferences: savedPrefs });
}