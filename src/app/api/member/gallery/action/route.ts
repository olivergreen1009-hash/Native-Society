import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { recordGalleryAction } from "@/lib/gallery/weekly-gallery-service";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    toUserId: string;
    batchId: string;
    decision: "interested" | "pass";
    message?: string;
  };

  if (!body.toUserId || !body.batchId || !body.decision) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await recordGalleryAction({
    fromUserId: session.userId,
    toUserId: body.toUserId,
    batchId: body.batchId,
    decision: body.decision,
    message: body.message,
  });

  return NextResponse.json(result);
}