import { NextResponse } from "next/server";
import {
  applicationFromIntake,
  validateApplicationBody,
  type ApplicationSubmitBody,
} from "@/lib/application-api";
import { repositories } from "@/repositories/memory";

export async function POST(request: Request) {
  const body = (await request.json()) as ApplicationSubmitBody;
  const validated = validateApplicationBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const existing = await repositories.applications.findByEmail(validated.intake.email);
  if (existing) {
    return NextResponse.json({ applicationId: existing.id, status: existing.status });
  }

  const app = await repositories.applications.create(
    applicationFromIntake(validated.intake),
  );

  return NextResponse.json({ applicationId: app.id, status: app.status });
}