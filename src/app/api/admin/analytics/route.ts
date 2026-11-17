import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import { getAdminAnalytics } from "@/lib/services/admin-analytics";

export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const analytics = await getAdminAnalytics();
  return NextResponse.json(analytics);
}