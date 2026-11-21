import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";
import { societyIntroductions } from "@/repositories/society-introductions";

export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== "member") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await repositories.users.findById(session.userId);
  const proposals = await societyIntroductions.listForMember(session.userId);
  return NextResponse.json({
    proposals,
    lifecycle: user?.memberLifecycleState ?? "active",
    pauseDiscovery: user?.pauseDiscovery ?? false,
  });
}

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session || session.role !== "member") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    proposalId: string;
    response: "accepted" | "declined";
  };
  const updated = await societyIntroductions.respond(
    body.proposalId,
    session.userId,
    body.response,
  );
  if (!updated) {
    return NextResponse.json({ error: "Could not update proposal." }, { status: 400 });
  }
  return NextResponse.json({ proposal: updated });
}