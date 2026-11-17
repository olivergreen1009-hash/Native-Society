import type { MemberAccount } from "@/lib/types";
import { DEMO_MEMBER } from "@/lib/sample-data";
import {
  LOCATION_PREFERENCES,
  RELATIONSHIP_INTENTIONS,
} from "@/lib/application-options";

export const MEMBER_PROFILE_KEY = "ns-member-profile-v2";

export type StoredMemberProfile = MemberAccount & {
  photoDataUrl?: string;
  schoolLine?: string;
  raisedInBorough?: string;
  summerDestination?: string;
  summerOther?: string;
  favoriteNycDetail?: string;
  seekingAgeMin: number;
  seekingAgeMax: number;
  locationPreference: string;
  relationshipIntention: string;
};

export const defaultMemberProfile = (): StoredMemberProfile => ({
  ...DEMO_MEMBER,
  schoolLine: "Brearley → Wesleyan",
  summerDestination: "Hamptons",
  seekingAgeMin: 28,
  seekingAgeMax: 42,
  locationPreference: LOCATION_PREFERENCES[0] ?? "Manhattan only",
  relationshipIntention:
    RELATIONSHIP_INTENTIONS[0] ?? "Long-term partnership",
});

export function loadMemberProfile(): StoredMemberProfile {
  if (typeof window === "undefined") return defaultMemberProfile();
  try {
    const raw = localStorage.getItem(MEMBER_PROFILE_KEY);
    if (!raw) return defaultMemberProfile();
    return { ...defaultMemberProfile(), ...(JSON.parse(raw) as StoredMemberProfile) };
  } catch {
    return defaultMemberProfile();
  }
}

export function saveMemberProfile(profile: StoredMemberProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(profile));
}