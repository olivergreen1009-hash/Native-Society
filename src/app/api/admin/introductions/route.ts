import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { societyIntroductions } from "@/repositories/society-introductions";
import type { IntroductionProposalState } from "@/types/society";

async function requireAdmin() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const proposals = await societyIntroductions.listAll();
  return NextResponse.json({ proposals });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await request.json()) as {
    recipientMemberId: string;
    counterpartMemberId: string;
    proposalText: string;
    reason: string;
    limitedProfileSnapshot: {
      displayName: string;
      headline: string;
      industryContext: string;
    };
    state?: IntroductionProposalState;
  };
  const created = await societyIntroductions.create({
    recipientMemberId: body.recipientMemberId,
    counterpartMemberId: body.counterpartMemberId,
    proposalText: body.proposalText,
    reason: body.reason,
    limitedProfileSnapshot: body.limitedProfileSnapshot,
    state: body.state ?? "awaiting_responses",
  });
  return NextResponse.json({ proposal: created });
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await request.json()) as {
    proposalId: string;
    state: IntroductionProposalState;
  };
  const updated = await societyIntroductions.update(body.proposalId, {
    state: body.state,
  });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ proposal: updated });
}