import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { upsertMemberProfileFromApproval } from "@/lib/supabase/member-profiles";
import type { ApplicationStatus } from "@/types/domain";

async function requireAdmin() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as ApplicationStatus | null;
  const apps = status
    ? await repositories.applications.listByStatus(status)
    : await repositories.applications.listAll();
  return NextResponse.json({ applications: apps });
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await request.json()) as {
    applicationId: string;
    status: ApplicationStatus;
    adminNotes?: string;
  };

  const updated = await repositories.applications.update(body.applicationId, {
    status: body.status,
    adminNotes: body.adminNotes ?? "",
  });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.status === "approved") {
    const existingUser = await repositories.users.findByEmail(updated.email);
    if (existingUser) {
      await repositories.users.update(existingUser.id, {
        approvedAt: new Date().toISOString(),
      });
      const profile = await repositories.profiles.findByUserId(existingUser.id);
      const supabase = getSupabaseServerClient();
      if (supabase) {
        await upsertMemberProfileFromApproval(supabase, {
          userId: existingUser.id,
          firstName: updated.fullName.split(" ")[0] ?? updated.fullName,
          neighborhood: updated.location,
          schoolLine: updated.schoolHistory,
          bio: profile?.bio ?? "",
          photoUrl: profile?.photos[0]?.url,
        });
        if (profile) {
          await repositories.profiles.upsert({
            ...profile,
            discoverable: true,
            moderationStatus: "approved",
          });
        }
      }
    }
  }

  await repositories.adminActions.log({
    adminId: session.userId,
    action: `application.${body.status}`,
    targetType: "application",
    targetId: updated.id,
    detail: body.adminNotes ?? "",
  });

  return NextResponse.json({ application: updated });
}