import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocks = await repositories.blocks.listBlockedBy(session.userId);
  const enriched = await Promise.all(
    blocks.map(async (block) => {
      const profile = await repositories.profiles.findByUserId(block.blockedId);
      return { block, profile };
    }),
  );
  return NextResponse.json({ blocks: enriched });
}

export async function DELETE(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const blockId = searchParams.get("id");
  if (!blockId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const blocks = await repositories.blocks.listBlockedBy(session.userId);
  const owned = blocks.find((b) => b.id === blockId);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await repositories.blocks.remove(blockId);
  return NextResponse.json({ ok: true });
}