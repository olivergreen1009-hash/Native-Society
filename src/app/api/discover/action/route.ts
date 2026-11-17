import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { recordInterestAction } from "@/lib/services/recommendations";
import { repositories } from "@/repositories/memory";
import type { ReportReason } from "@/types/domain";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    toUserId: string;
    batchId: string;
    decision: "interested" | "pass" | "report";
    reportReason?: ReportReason;
    reportDetail?: string;
  };

  if (body.decision === "report") {
    await repositories.reports.create({
      reporterId: session.userId,
      reportedUserId: body.toUserId,
      reason: body.reportReason ?? "other",
      detail: body.reportDetail ?? "",
    });
    await recordInterestAction({
      fromUserId: session.userId,
      toUserId: body.toUserId,
      batchId: body.batchId,
      decision: "pass",
    });
    return NextResponse.json({ ok: true });
  }

  const result = await recordInterestAction({
    fromUserId: session.userId,
    toUserId: body.toUserId,
    batchId: body.batchId,
    decision: body.decision,
  });

  return NextResponse.json(result);
}