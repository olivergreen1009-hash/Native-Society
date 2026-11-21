import { NextResponse } from "next/server";
import { repositories } from "@/repositories/memory";
import type { SocietyApplicationRawData } from "@/types/society";

function validateRawData(
  raw: SocietyApplicationRawData,
): { ok: true } | { ok: false; error: string } {
  const s = raw.shareable;
  const f = raw.founderOnly;
  if (
    !s.fullName?.trim() ||
    !s.email?.trim() ||
    !s.industryConnection?.trim() ||
    !s.introductionUsefulness?.trim() ||
    !s.experiencePerspective?.trim() ||
    !s.specificInterests?.trim()
  ) {
    return { ok: false, error: "Please complete all shareable fields." };
  }
  if (!f.roleOwnershipDetail?.trim()) {
    return { ok: false, error: "Please complete founder-only review fields." };
  }
  const c = raw.consents;
  if (!c.notDatingService || !c.termsPrivacy || !c.noPaymentWithApplication) {
    return { ok: false, error: "Please accept all required confirmations." };
  }
  return { ok: true };
}

export async function POST(request: Request) {
  const body = (await request.json()) as { rawData: SocietyApplicationRawData };
  const validation = validateRawData(body.rawData);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const rawData = body.rawData;
  const email = rawData.shareable.email.trim().toLowerCase();

  const existing = await repositories.applications.findByEmail(email);
  if (existing) {
    return NextResponse.json({ applicationId: existing.id, status: existing.status });
  }

  const app = await repositories.applications.create({
    userId: null,
    fullName: rawData.shareable.fullName.trim(),
    email,
    rawData,
    referralSource: rawData.referralSource,
  });

  return NextResponse.json({ applicationId: app.id, status: app.status });
}