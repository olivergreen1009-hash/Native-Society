import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";

type Params = { params: Promise<{ matchId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { matchId } = await params;
  const match = (await repositories.matches.listForUser(session.userId)).find(
    (m) => m.id === matchId,
  );
  if (!match) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const messages = await repositories.messages.listForMatch(matchId);
  return NextResponse.json({ messages });
}

export async function POST(request: Request, { params }: Params) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { matchId } = await params;
  const match = (await repositories.matches.listForUser(session.userId)).find(
    (m) => m.id === matchId,
  );
  if (!match) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = (await request.json()) as { text?: string };
  const message = await repositories.messages.send({
    matchId,
    senderId: session.userId,
    body: (body.text ?? "").trim(),
  });
  return NextResponse.json({ message });
}