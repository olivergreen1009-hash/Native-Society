import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  validateApplicationBody,
  type ApplicationSubmitBody,
} from "@/lib/application-api";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error(
      "[applications] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
    return NextResponse.json(
      {
        error:
          "Application storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      },
      { status: 500 },
    );
  }

  let body: ApplicationSubmitBody;
  try {
    body = (await request.json()) as ApplicationSubmitBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validated = validateApplicationBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { intake } = validated;
  const supabase = createClient(url, anonKey);
  const { error } = await supabase.from("applications").insert({
    full_name: intake.name,
    email: intake.email,
    date_of_birth: intake.dateOfBirth,
    raw_data: body,
  });

  if (error) {
    console.error("[applications] Supabase insert failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    const details = [error.code, error.details, error.hint].filter(Boolean).join(" · ");
    return NextResponse.json(
      {
        error: error.message,
        details,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}