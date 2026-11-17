import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";
import type { ReportStatus } from "@/types/domain";

export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const reports = await repositories.reports.listAll();
  return NextResponse.json({ reports });
}

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await request.json()) as {
    reportId: string;
    status: ReportStatus;
    adminNote?: string;
  };
  const updated = await repositories.reports.update(body.reportId, {
    status: body.status,
    adminNote: body.adminNote ?? "",
    resolvedAt: new Date().toISOString(),
  });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await repositories.adminActions.log({
    adminId: session.userId,
    action: `report.${body.status}`,
    targetType: "report",
    targetId: body.reportId,
    detail: body.adminNote ?? "",
  });

  return NextResponse.json({ report: updated });
}