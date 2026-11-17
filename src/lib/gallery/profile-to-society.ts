import type { SocietyProfile } from "@/lib/types";
import type { Profile } from "@/types/domain";

export function societyProfileFromDomain(
  profile: Profile,
  overrides?: Partial<SocietyProfile>,
): SocietyProfile {
  const photo = profile.photos[0]?.url ?? "";
  return {
    id: profile.userId,
    firstName: profile.firstName,
    displayInitial: profile.firstName.charAt(0) || "?",
    age: profile.age,
    neighborhood: profile.neighborhood,
    schoolLine: profile.schoolLine ?? undefined,
    school: profile.schoolLine ?? "",
    schoolVisibility: "visible",
    raisedInBorough: profile.raisedInBorough ?? undefined,
    summerDestination: profile.summerDestination ?? undefined,
    summerOther: profile.summerOther ?? undefined,
    favoriteNycDetail: profile.favoriteNycDetail ?? undefined,
    isSample: false,
    profession: "",
    memberBio: profile.bio,
    interests: profile.interests,
    imageUrl:
      photo ||
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
    conciergeNote: "",
    compatibilityNotes: undefined,
    ...overrides,
  };
}