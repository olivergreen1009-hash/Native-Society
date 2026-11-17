import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { listIntroductionsForUser } from "@/lib/gallery/weekly-gallery-service";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const introductions = await listIntroductionsForUser(session.userId);
  return NextResponse.json({ introductions });
}