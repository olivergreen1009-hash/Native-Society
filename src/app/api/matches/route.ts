import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const matches = await repositories.matches.listForUser(session.userId);
  const enriched = await Promise.all(
    matches.map(async (match) => {
      const otherId =
        match.userAId === session.userId ? match.userBId : match.userAId;
      const profile = await repositories.profiles.findByUserId(otherId);
      return { match, profile };
    }),
  );

  return NextResponse.json({ matches: enriched });
}