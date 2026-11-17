import "server-only";

import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";

export async function requireAdminSession() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export function forbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}