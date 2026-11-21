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

  if (body.status === "invited_to_activate") {
    const existingUser = await repositories.users.findByEmail(updated.email);
    if (existingUser) {
      await repositories.users.update(existingUser.id, {
        approvedAt: new Date().toISOString(),
        memberLifecycleState: "invited_to_activate",
      });
      const profile = await repositories.profiles.findByUserId(existingUser.id);
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const shareable = updated.rawData?.shareable;
        await upsertMemberProfileFromApproval(supabase, {
          userId: existingUser.id,
          firstName: updated.fullName.split(" ")[0] ?? updated.fullName,
          neighborhood: shareable?.industryConnection?.slice(0, 80) ?? "",
          schoolLine: "",
          bio: shareable?.experiencePerspective ?? profile?.bio ?? "",
          photoUrl: profile?.photos[0]?.url,
        });
        if (profile) {
          await repositories.profiles.upsert({
            ...profile,
            discoverable: false,
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