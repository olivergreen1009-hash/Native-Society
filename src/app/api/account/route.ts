import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";
import type { NotificationPreferences } from "@/types/domain";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await repositories.users.findById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const notifications = await repositories.notifications.getByUserId(user.id);
  return NextResponse.json({ user, notifications });
}

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    pauseDiscovery?: boolean;
    notifications?: NotificationPreferences;
    requestDeletion?: boolean;
    cancelDeletion?: boolean;
  };

  const user = await repositories.users.findById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let patch = { ...user };

  if (typeof body.pauseDiscovery === "boolean") {
    patch = { ...patch, pauseDiscovery: body.pauseDiscovery };
  }

  if (body.requestDeletion) {
    patch = {
      ...patch,
      accountStatus: "pending_deletion",
      pendingDeletionRequestedAt: new Date().toISOString(),
      pauseDiscovery: true,
    };
  }

  if (body.cancelDeletion && user.accountStatus === "pending_deletion") {
    patch = {
      ...patch,
      accountStatus: "active",
      pendingDeletionRequestedAt: null,
    };
  }

  const updated = await repositories.users.update(session.userId, patch);

  if (body.notifications) {
    await repositories.notifications.upsert({
      ...body.notifications,
      userId: session.userId,
    });
  }

  const notifications = await repositories.notifications.getByUserId(
    session.userId,
  );

  return NextResponse.json({ user: updated, notifications });
}