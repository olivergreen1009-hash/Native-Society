import type { MemberAccount, SocietyProfile } from "./types";

export const DEMO_MEMBER: MemberAccount = {
  id: "member-olivia",
  email: "member@nativesociety.nyc",
  name: "Olivia Mercer",
  tier: "founding",
  neighborhood: "Upper East Side",
  school: "Brearley",
  bio: "Art advisor and weekend sailor. Prefers introductions over algorithms.",
  role: "member",
};

export const DEMO_ADMIN: MemberAccount = {
  id: "admin-oliver",
  email: "admin@nativesociety.nyc",
  name: "Oliver Estreich",
  tier: "founding",
  neighborhood: "West Village",
  school: "Trinity",
  bio: "Founder. Curates the gallery and stewards every introduction personally.",
  role: "admin",
};

export const DEMO_PASSWORD_MEMBER = "member2024";
export const DEMO_PASSWORD_ADMIN = "admin2024";

/** Founding cohort gallery names (see docs/sample-gallery-profiles.md) */
export const foundingGalleryProfileIds = [
  "profile-alexandra",
  "profile-james",
  "profile-elena",
  "profile-michael",
  "profile-sophie",
];

export const societyProfiles: SocietyProfile[] = [
  {
    id: "profile-alexandra",
    firstName: "Alexandra",
    displayInitial: "A.",
    age: 32,
    neighborhood: "Upper East Side",
    school: "Chapin → Yale",
    schoolVisibility: "after_mutual_interest",
    profession: "Contemporary art advisor",
    memberBio:
      "Values intellectual conversation and a relatively settled New York life.",
    interests: ["Contemporary art", "Travel", "Long dinners"],
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    conciergeNote:
      "Values intellectual conversation and a relatively settled New York life.",
  },
  {
    id: "profile-james",
    firstName: "James",
    displayInitial: "J.",
    age: 35,
    neighborhood: "West Village",
    school: "St. Bernard's → Groton",
    schoolVisibility: "hidden",
    profession: "Architecture practice principal",
    memberBio:
      "Enjoys both city culture and regular time outside the city. Prefers substance over high social volume.",
    interests: ["Architecture", "Skiing", "Cooking"],
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    conciergeNote:
      "Enjoys both city culture and regular time outside the city. Prefers substance over high social volume.",
  },
  {
    id: "profile-elena",
    firstName: "Elena",
    displayInitial: "E.",
    age: 29,
    neighborhood: "Brooklyn Heights",
    school: "Packer → Middlebury",
    schoolVisibility: "visible",
    profession: "Editorial design director",
    memberBio:
      "Recently returned to New York after several years away. Looking for someone rooted here.",
    interests: ["Literature", "Design", "Early mornings"],
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    conciergeNote:
      "Recently returned to New York after several years away. Looking for someone rooted here.",
  },
  {
    id: "profile-michael",
    firstName: "Michael",
    displayInitial: "M.",
    age: 38,
    neighborhood: "Upper West Side",
    school: "Dalton → St. Paul's",
    schoolVisibility: "after_mutual_interest",
    profession: "Private equity partner",
    memberBio:
      "Established professionally. Prefers low-drama, high-quality company.",
    interests: ["History", "Sailing", "Live music"],
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    conciergeNote:
      "Established professionally. Prefers low-drama, high-quality company.",
  },
  {
    id: "profile-sophie",
    firstName: "Sophie",
    displayInitial: "S.",
    age: 31,
    neighborhood: "Tribeca",
    school: "Spence → Deerfield",
    schoolVisibility: "hidden",
    profession: "Documentary producer",
    memberBio:
      "Social but selective. Appreciates partners who are also independent.",
    interests: ["Film", "Food", "Weekend walks"],
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
    conciergeNote:
      "Social but selective. Appreciates partners who are also independent.",
  },
  {
    id: "profile-henry",
    firstName: "Henry",
    displayInitial: "H.",
    age: 36,
    neighborhood: "Carnegie Hill",
    school: "Dalton → Hotchkiss",
    schoolVisibility: "hidden",
    profession: "Family office investor",
    memberBio:
      "Runs marathons and stewards a small music-education foundation. Prefers unhurried courtship.",
    interests: ["Philanthropy", "Central Park doubles", "Contemporary art"],
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&q=80",
    conciergeNote: "Steady temperament, civic-minded, traditional courtship.",
  },
  {
    id: "profile-margaret",
    firstName: "Margaret",
    displayInitial: "M.",
    age: 33,
    neighborhood: "Brooklyn Heights",
    school: "Packer → Andover",
    schoolVisibility: "after_mutual_interest",
    profession: "Literary agent",
    memberBio:
      "Tells stories for a living and keeps her own private. Values wit and loyalty.",
    interests: ["Indie film", "Sailing lessons", "Charity galas"],
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
    conciergeNote: "Independent spirit, warm humor, long-view mindset.",
  },
  {
    id: "profile-william",
    firstName: "William",
    displayInitial: "W.",
    age: 35,
    neighborhood: "Upper West Side",
    school: "Trinity → St. Paul's",
    schoolVisibility: "visible",
    profession: "Composer & conservatory faculty",
    memberBio:
      "Lives behind Lincoln Center and keeps a list of quiet restaurants that still take reservations by phone.",
    interests: ["Chamber music", "Chess", "Late-night diners"],
    imageUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&q=80",
    conciergeNote: "Reflective, artistic, prefers slow courtship.",
  },
];

export const landingMockProfileIds = [
  "profile-alexandra",
  "profile-james",
];

export const members: MemberAccount[] = [DEMO_MEMBER, DEMO_ADMIN];

export const features = [
  {
    title: "Invitation only",
    description:
      "Every member is referred, vetted, and known to our curators before a seat is offered.",
  },
  {
    title: "No public profiles",
    description:
      "Your story stays inside the club. What appears in the gallery is deliberate—and never searchable.",
  },
  {
    title: "Curated introductions",
    description:
      "We do not surface endless faces. You see a handful of compatibilities, then request an introduction.",
  },
  {
    title: "Personally managed",
    description:
      "Curation considers school lineage, neighborhood rhythm, and the life you are building in New York.",
  },
  {
    title: "Discreet by design",
    description:
      "Mutual interest is required. No casual browsing and no unsolicited messages.",
  },
];

export const pricingTiers = [
  {
    name: "Founding",
    price: "$1,500 / year",
    description:
      "Reserved for early members who help shape culture, events, and the private calendar.",
    highlights: [
      "Priority introductions",
      "Quarterly salon access",
      "Direct curator line",
    ],
  },
  {
    name: "Private",
    price: "$3,500 / year",
    description:
      "The core membership: gallery access, compatibility review, and guided introductions.",
    highlights: [
      "Private gallery",
      "Compatibility questionnaire",
      "Up to four introductions per quarter",
    ],
    featured: true,
  },
  {
    name: "Dedicated Concierge",
    price: "$7,500 / year",
    description:
      "For members who want the highest level of proactive curation and response time.",
    highlights: [
      "Weekly gallery refresh",
      "Proactive profile suggestions",
      "Priority coordination",
    ],
  },
];

export function profilePublicBio(profile: SocietyProfile): string {
  return profile.memberBio;
}
