import { NextResponse } from "next/server";
import {
  forbiddenResponse,
  requireAdminSession,
} from "@/lib/admin/require-admin";
import type { SupabaseApplicationRow } from "@/lib/supabase-applications";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  if (!(await requireAdminSession())) {
    return forbiddenResponse();
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY for server reads).",
      },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("applications")
    .select("id, full_name, email, date_of_birth, raw_data, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/applications] Supabase list failed:", error);
    return NextResponse.json(
      {
        error: error.message,
        details: [error.code, error.details, error.hint].filter(Boolean).join(" · "),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    applications: (data ?? []) as SupabaseApplicationRow[],
  });
}