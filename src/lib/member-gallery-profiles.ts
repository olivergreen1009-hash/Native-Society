import {
  activeExampleProfiles,
  type LandingExampleProfile,
} from "@/lib/landing-example-profiles";
import type { SocietyProfile } from "@/lib/types";

function toSocietyProfile(example: LandingExampleProfile): SocietyProfile {
  const school = example.schoolLine.split("→")[0]?.trim() ?? example.schoolLine;
  return {
    id: example.id,
    firstName: example.firstName,
    displayInitial: example.firstName.charAt(0),
    age: example.age,
    neighborhood: example.neighborhood,
    school,
    schoolVisibility: "visible",
    profession: example.lookingFor,
    memberBio: example.prompt,
    interests: example.interests,
    imageUrl: example.imageUrl,
    conciergeNote: "",
    compatibilityNotes: example.lookingFor,
  };
}

/** Placeholder weekly introductions — sample profiles, rotated hourly. */
export function weeklyRecommendationBatch(): SocietyProfile[] {
  return activeExampleProfiles().map(toSocietyProfile);
}

export function weeklyGalleryProfileIds(): string[] {
  return weeklyRecommendationBatch().map((p) => p.id);
}

export function getMemberGalleryProfile(
  id: string,
): SocietyProfile | undefined {
  return weeklyRecommendationBatch().find((p) => p.id === id);
}

export function currentWeekLabel(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}