import { getMemoryDb, resetMemoryDb } from "@/lib/data/memory-store";
import type {
  Application,
  Preferences,
  Profile,
  User,
} from "@/types/domain";

const now = () => new Date().toISOString();

export const DEMO_PASSWORD_MEMBER = "member2024";
export const DEMO_PASSWORD_ADMIN = "admin2024";

export const DEMO_MEMBER_ID = "user-olivia";
export const DEMO_ADMIN_ID = "user-oliver";

const memberSeeds: Array<{
  user: User;
  profile: Profile;
  preferences: Preferences;
}> = [
  {
    user: {
      id: "user-alexandra",
      email: "alexandra@demo.nativesociety.nyc",
      passwordHash: null,
      role: "member",
      createdAt: now(),
      approvedAt: now(),
      active: true,
      applicationId: null,
    },
    profile: {
      id: "profile-alexandra",
      userId: "user-alexandra",
      firstName: "Alexandra",
      age: 32,
      bio: "Contemporary art advisor. Values intellectual conversation and a settled New York life.",
      photos: [
        {
          id: "ph-alex-1",
          profileId: "profile-alexandra",
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
          sortOrder: 0,
        },
      ],
      prompts: [
        {
          id: "pr-alex-1",
          question: "A perfect Sunday in the city",
          answer: "The Met, then a long lunch downtown.",
        },
        {
          id: "pr-alex-2",
          question: "What roots you in New York",
          answer: "Family on the Upper East Side and school friends who became family.",
        },
      ],
      interests: ["Contemporary art", "Travel", "Long dinners"],
      schoolLine: "Chapin → Yale",
      neighborhood: "Upper East Side",
      discoverable: true,
      completedOnboarding: true,
      updatedAt: now(),
    },
    preferences: {
      userId: "user-alexandra",
      genders: ["man"],
      ageMin: 30,
      ageMax: 40,
      locationRadius: "nyc",
      relationshipIntention: ["long_term", "marriage_minded"],
    },
  },
  {
    user: {
      id: "user-james",
      email: "james@demo.nativesociety.nyc",
      passwordHash: null,
      role: "member",
      createdAt: now(),
      approvedAt: now(),
      active: true,
      applicationId: null,
    },
    profile: {
      id: "profile-james",
      userId: "user-james",
      firstName: "James",
      age: 35,
      bio: "Architecture practice principal. Enjoys city culture and time outside the city.",
      photos: [
        {
          id: "ph-james-1",
          profileId: "profile-james",
          url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
          sortOrder: 0,
        },
      ],
      prompts: [
        {
          id: "pr-james-1",
          question: "Weekend rhythm",
          answer: "Ski season upstate, summers sailing when I can.",
        },
      ],
      interests: ["Architecture", "Skiing", "Cooking"],
      schoolLine: "St. Bernard's → Groton",
      neighborhood: "West Village",
      discoverable: true,
      completedOnboarding: true,
      updatedAt: now(),
    },
    preferences: {
      userId: "user-james",
      genders: ["woman"],
      ageMin: 28,
      ageMax: 38,
      locationRadius: "nyc",
      relationshipIntention: ["long_term"],
    },
  },
  {
    user: {
      id: "user-elena",
      email: "elena@demo.nativesociety.nyc",
      passwordHash: null,
      role: "member",
      createdAt: now(),
      approvedAt: now(),
      active: true,
      applicationId: null,
    },
    profile: {
      id: "profile-elena",
      userId: "user-elena",
      firstName: "Elena",
      age: 29,
      bio: "Editorial design director. Recently returned to New York after several years away.",
      photos: [
        {
          id: "ph-elena-1",
          profileId: "profile-elena",
          url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
          sortOrder: 0,
        },
      ],
      prompts: [
        {
          id: "pr-elena-1",
          question: "Why Native Society",
          answer: "I want introductions that feel considered—not a feed.",
        },
      ],
      interests: ["Literature", "Design", "Early mornings"],
      schoolLine: "Packer → Middlebury",
      neighborhood: "Brooklyn Heights",
      discoverable: true,
      completedOnboarding: true,
      updatedAt: now(),
    },
    preferences: {
      userId: "user-elena",
      genders: ["man", "non_binary"],
      ageMin: 27,
      ageMax: 36,
      locationRadius: "tri_state",
      relationshipIntention: ["open_to_explore", "long_term"],
    },
  },
  {
    user: {
      id: "user-michael",
      email: "michael@demo.nativesociety.nyc",
      passwordHash: null,
      role: "member",
      createdAt: now(),
      approvedAt: now(),
      active: true,
      applicationId: null,
    },
    profile: {
      id: "profile-michael",
      userId: "user-michael",
      firstName: "Michael",
      age: 38,
      bio: "Established professionally. Prefers low-drama, high-quality company.",
      photos: [
        {
          id: "ph-michael-1",
          profileId: "profile-michael",
          url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
          sortOrder: 0,
        },
      ],
      prompts: [
        {
          id: "pr-michael-1",
          question: "Non-negotiable",
          answer: "Kindness and intellectual curiosity.",
        },
      ],
      interests: ["History", "Sailing", "Live music"],
      schoolLine: "Dalton → St. Paul's",
      neighborhood: "Upper West Side",
      discoverable: true,
      completedOnboarding: true,
      updatedAt: now(),
    },
    preferences: {
      userId: "user-michael",
      genders: ["woman"],
      ageMin: 28,
      ageMax: 40,
      locationRadius: "nyc",
      relationshipIntention: ["marriage_minded"],
    },
  },
  {
    user: {
      id: "user-sophie",
      email: "sophie@demo.nativesociety.nyc",
      passwordHash: null,
      role: "member",
      createdAt: now(),
      approvedAt: now(),
      active: true,
      applicationId: null,
    },
    profile: {
      id: "profile-sophie",
      userId: "user-sophie",
      firstName: "Sophie",
      age: 31,
      bio: "Documentary producer. Social but selective.",
      photos: [
        {
          id: "ph-sophie-1",
          profileId: "profile-sophie",
          url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
          sortOrder: 0,
        },
      ],
      prompts: [
        {
          id: "pr-sophie-1",
          question: "Ideal introduction",
          answer: "Coffee somewhere quiet, no phones on the table.",
        },
      ],
      interests: ["Film", "Food", "Weekend walks"],
      schoolLine: "Spence → Deerfield",
      neighborhood: "Tribeca",
      discoverable: true,
      completedOnboarding: true,
      updatedAt: now(),
    },
    preferences: {
      userId: "user-sophie",
      genders: ["man"],
      ageMin: 29,
      ageMax: 38,
      locationRadius: "nyc",
      relationshipIntention: ["long_term"],
    },
  },
];

const demoMemberApplication: Application = {
  id: "app-olivia",
  userId: DEMO_MEMBER_ID,
  fullName: "Olivia Mercer",
  email: "member@nativesociety.nyc",
  dateOfBirth: "1993-04-12",
  location: "Manhattan",
  nycUpbringing: "Born and raised on the Upper East Side",
  schoolHistory: "Brearley → Wesleyan",
  relationshipIntention: "long_term",
  referralSource: "Member referral — Henry K.",
  status: "approved",
  adminNotes: "",
  submittedAt: now(),
  updatedAt: now(),
};

export function ensureSeeded(): void {
  const db = getMemoryDb();
  if (db.users.size > 0) return;

  resetMemoryDb();
  const fresh = getMemoryDb();

  const demoMember: User = {
    id: DEMO_MEMBER_ID,
    email: "member@nativesociety.nyc",
    passwordHash: DEMO_PASSWORD_MEMBER,
    role: "member",
    createdAt: now(),
    approvedAt: now(),
    active: true,
    applicationId: demoMemberApplication.id,
    stripeCustomerId: null,
    subscriptionStatus: "none",
    planId: null,
  };

  const demoAdmin: User = {
    id: DEMO_ADMIN_ID,
    email: "admin@nativesociety.nyc",
    passwordHash: DEMO_PASSWORD_ADMIN,
    role: "admin",
    createdAt: now(),
    approvedAt: now(),
    active: true,
    applicationId: null,
  };

  fresh.applications.set(demoMemberApplication.id, demoMemberApplication);
  fresh.users.set(demoMember.id, demoMember);
  fresh.users.set(demoAdmin.id, demoAdmin);
  fresh.usersByEmail.set(demoMember.email.toLowerCase(), demoMember.id);
  fresh.usersByEmail.set(demoAdmin.email.toLowerCase(), demoAdmin.id);

  fresh.profiles.set("profile-olivia", {
    id: "profile-olivia",
    userId: DEMO_MEMBER_ID,
    firstName: "Olivia",
    age: 31,
    bio: "Art advisor and weekend sailor. Prefers considered introductions over noise.",
    photos: [
      {
        id: "ph-olivia-1",
        profileId: "profile-olivia",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
        sortOrder: 0,
      },
    ],
    prompts: [
      {
        id: "pr-olivia-1",
        question: "What you value in a partner",
        answer: "Wit, stability, and someone who loves this city as much as I do.",
      },
    ],
    interests: ["Art", "Sailing", "Central Park"],
    schoolLine: "Brearley",
    neighborhood: "Upper East Side",
    discoverable: true,
    completedOnboarding: true,
    updatedAt: now(),
  });

  fresh.preferences.set(DEMO_MEMBER_ID, {
    userId: DEMO_MEMBER_ID,
    genders: ["man"],
    ageMin: 30,
    ageMax: 40,
    locationRadius: "nyc",
    relationshipIntention: ["long_term", "marriage_minded"],
  });

  for (const seed of memberSeeds) {
    fresh.users.set(seed.user.id, seed.user);
    fresh.usersByEmail.set(seed.user.email.toLowerCase(), seed.user.id);
    fresh.profiles.set(seed.profile.id, seed.profile);
    fresh.preferences.set(seed.user.id, seed.preferences);
  }

  const messagesSeed: import("@/types/domain").Message[] = [
    {
      id: "msg-1",
      matchId: "match-demo",
      senderId: "user-james",
      body: "Good to be introduced — would you like to meet for coffee near the park?",
      createdAt: now(),
    },
    {
      id: "msg-2",
      matchId: "match-demo",
      senderId: DEMO_MEMBER_ID,
      body: "That sounds lovely. Thursday late afternoon works on my end.",
      createdAt: now(),
    },
  ];
  fresh.matches.push({
    id: "match-demo",
    userAId: DEMO_MEMBER_ID,
    userBId: "user-james",
    createdAt: now(),
  });
  fresh.messages.push(...messagesSeed);
}