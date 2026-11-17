import type { SupabaseClient } from "@supabase/supabase-js";
import type { SocietyProfile } from "@/lib/types";

export type MemberProfileRow = {
  user_id: string;
  first_name: string;
  age: number | null;
  neighborhood: string;
  raised_in_borough: string | null;
  school_line: string | null;
  summer_destination: string | null;
  summer_other: string | null;
  favorite_nyc_detail: string | null;
  photo_url: string | null;
  bio: string;
  interests: string[] | null;
  approved: boolean;
  active: boolean;
  discoverable: boolean;
  pause_discovery: boolean;
};

export function rowToSocietyProfile(row: MemberProfileRow): SocietyProfile {
  return {
    id: row.user_id,
    firstName: row.first_name,
    displayInitial: row.first_name.charAt(0) || "?",
    age: row.age ?? 0,
    neighborhood: row.neighborhood,
    schoolLine: row.school_line ?? undefined,
    school: row.school_line ?? "",
    schoolVisibility: "visible",
    raisedInBorough: row.raised_in_borough ?? undefined,
    summerDestination: row.summer_destination ?? undefined,
    summerOther: row.summer_other ?? undefined,
    favoriteNycDetail: row.favorite_nyc_detail ?? undefined,
    isSample: false,
    profession: "",
    memberBio: row.bio,
    interests: row.interests ?? [],
    imageUrl:
      row.photo_url ??
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
    conciergeNote: "",
  };
}

export async function listEligibleMemberProfiles(
  supabase: SupabaseClient,
  excludeUserId: string,
): Promise<MemberProfileRow[]> {
  const { data, error } = await supabase
    .from("member_profiles")
    .select("*")
    .eq("approved", true)
    .eq("active", true)
    .eq("discoverable", true)
    .eq("pause_discovery", false)
    .neq("user_id", excludeUserId);

  if (error) {
    console.error("[member_profiles] list eligible failed:", error);
    return [];
  }
  return (data ?? []) as MemberProfileRow[];
}

export async function upsertMemberProfileFromApproval(
  supabase: SupabaseClient,
  input: {
    userId: string;
    firstName: string;
    email?: string;
    neighborhood?: string;
    schoolLine?: string;
    photoUrl?: string;
    bio?: string;
  },
): Promise<void> {
  const { error } = await supabase.from("member_profiles").upsert(
    {
      user_id: input.userId,
      first_name: input.firstName,
      neighborhood: input.neighborhood ?? "",
      school_line: input.schoolLine ?? "",
      photo_url: input.photoUrl ?? null,
      bio: input.bio ?? "",
      approved: true,
      active: true,
      discoverable: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) {
    console.error("[member_profiles] upsert on approval failed:", error);
  }
}