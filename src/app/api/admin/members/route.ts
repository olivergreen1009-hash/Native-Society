import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";
import type { AccountStatus } from "@/types/domain";
import type { MemberLifecycleState } from "@/types/society";

export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const members = await repositories.users.listMembers();
  const rows = await Promise.all(
    members.map(async (member) => {
      const profile = await repositories.profiles.findByUserId(member.id);
      return { member, profile };
    }),
  );
  return NextResponse.json({ members: rows });
}

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await request.json()) as {
    userId: string;
    accountStatus?: AccountStatus;
    pauseDiscovery?: boolean;
    active?: boolean;
    memberLifecycleState?: MemberLifecycleState;
  };

  const user = await repositories.users.findById(body.userId);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const patch: Partial<typeof user> = {};
  if (body.accountStatus) {
    patch.accountStatus = body.accountStatus;
    if (body.accountStatus === "suspended") {
      patch.suspendedAt = new Date().toISOString();
      patch.pauseDiscovery = true;
    }
    if (body.accountStatus === "removed") {
      patch.active = false;
      patch.pauseDiscovery = true;
    }
    if (body.accountStatus === "active") {
      patch.suspendedAt = null;
      patch.active = true;
    }
  }
  if (typeof body.pauseDiscovery === "boolean") {
    patch.pauseDiscovery = body.pauseDiscovery;
  }
  if (typeof body.active === "boolean") patch.active = body.active;
  if (body.memberLifecycleState) {
    patch.memberLifecycleState = body.memberLifecycleState;
    if (body.memberLifecycleState === "active") {
      patch.active = true;
      patch.approvedAt = user.approvedAt ?? new Date().toISOString();
    }
  }

  const updated = await repositories.users.update(body.userId, patch);

  await repositories.adminActions.log({
    adminId: session.userId,
    action: "member.update",
    targetType: "user",
    targetId: body.userId,
    detail: JSON.stringify(patch),
  });

  return NextResponse.json({ member: updated });
}