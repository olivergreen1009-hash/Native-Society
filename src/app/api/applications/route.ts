import { NextResponse } from "next/server";
import { repositories } from "@/repositories/memory";
import type { RelationshipIntention } from "@/types/domain";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fullName: string;
    email: string;
    dateOfBirth: string;
    location: string;
    nycUpbringing: string;
    schoolHistory: string;
    relationshipIntention: RelationshipIntention;
    referralSource: string;
  };

  const dob = new Date(body.dateOfBirth);
  const ageMs = Date.now() - dob.getTime();
  const age = ageMs / (1000 * 60 * 60 * 24 * 365.25);
  if (Number.isNaN(dob.getTime()) || age < 18) {
    return NextResponse.json({ error: "Must be 18 or older" }, { status: 400 });
  }

  const existing = await repositories.applications.findByEmail(body.email);
  if (existing) {
    return NextResponse.json({ applicationId: existing.id, status: existing.status });
  }

  const app = await repositories.applications.create({
    userId: null,
    fullName: body.fullName.trim(),
    email: body.email.trim().toLowerCase(),
    dateOfBirth: body.dateOfBirth,
    location: body.location.trim(),
    nycUpbringing: body.nycUpbringing.trim(),
    schoolHistory: body.schoolHistory.trim(),
    relationshipIntention: body.relationshipIntention,
    referralSource: body.referralSource.trim(),
  });

  return NextResponse.json({ applicationId: app.id, status: app.status });
}