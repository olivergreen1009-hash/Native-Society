import { NextResponse } from "next/server";
import {
  forbiddenResponse,
  requireAdminSession,
} from "@/lib/admin/require-admin";
import type { SupabaseApplicationRow } from "@/lib/supabase-applications";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return forbiddenResponse();
  }

  const { id } = await context.params;
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("applications")
    .select("id, full_name, email, date_of_birth, raw_data, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin/applications] Supabase get failed:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 502 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  return NextResponse.json({
    application: data as SupabaseApplicationRow,
  });
}