/** @deprecated Legacy gallery prototype — prefer seeded repositories in /data/seed.ts */
import type { MemberAccount, SocietyProfile } from "./types";

export {
  DEMO_PASSWORD_ADMIN,
  DEMO_PASSWORD_MEMBER,
  DEMO_MEMBER_ID as DEMO_MEMBER_ID,
  DEMO_ADMIN_ID,
} from "@/data/seed";

import {
  DEMO_ADMIN_ID,
  DEMO_MEMBER_ID,
  DEMO_PASSWORD_ADMIN,
  DEMO_PASSWORD_MEMBER,
} from "@/data/seed";

export const DEMO_MEMBER: MemberAccount = {
  id: DEMO_MEMBER_ID,
  email: "member@nativesociety.nyc",
  name: "Olivia Mercer",
  tier: "founding",
  neighborhood: "Upper East Side",
  school: "Brearley",
  bio: "Art advisor and weekend sailor.",
  role: "member",
};

export const DEMO_ADMIN: MemberAccount = {
  id: DEMO_ADMIN_ID,
  email: "admin@nativesociety.nyc",
  name: "Oliver Estreich",
  tier: "founding",
  neighborhood: "West Village",
  school: "Trinity",
  bio: "Founder.",
  role: "admin",
};

export const societyProfiles: SocietyProfile[] = [];
export const foundingGalleryProfileIds: string[] = [];
export const landingMockProfileIds: string[] = [];
export const features: { title: string; description: string }[] = [];
export const pricingTiers: {
  name: string;
  price: string;
  description: string;
  highlights: string[];
  featured?: boolean;
}[] = [];

export function profilePublicBio(profile: SocietyProfile): string {
  return profile.memberBio;
}