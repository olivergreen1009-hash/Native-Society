import type {
  AdminAction,
  Application,
  Block,
  InterestRecord,
  MagicLinkToken,
  Match,
  Message,
  NotificationPreferences,
  Preferences,
  Profile,
  RecommendationBatch,
  Report,
  User,
} from "@/types/domain";
import type { IntroductionProposal } from "@/types/society";

export interface MemoryDatabase {
  users: Map<string, User>;
  applications: Map<string, Application>;
  profiles: Map<string, Profile>;
  preferences: Map<string, Preferences>;
  notificationPreferences: Map<string, NotificationPreferences>;
  batches: Map<string, RecommendationBatch>;
  interests: InterestRecord[];
  matches: Match[];
  messages: Message[];
  blocks: Block[];
  reports: Report[];
  adminActions: AdminAction[];
  magicLinks: MagicLinkToken[];
  usersByEmail: Map<string, string>;
  introductionProposals: IntroductionProposal[];
}

declare global {
  // eslint-disable-next-line no-var
  var __nsMemoryDb: MemoryDatabase | undefined;
}

function createEmptyDb(): MemoryDatabase {
  return {
    users: new Map(),
    applications: new Map(),
    profiles: new Map(),
    preferences: new Map(),
    notificationPreferences: new Map(),
    batches: new Map(),
    interests: [],
    matches: [],
    messages: [],
    blocks: [],
    reports: [],
    adminActions: [],
    magicLinks: [],
    usersByEmail: new Map(),
    introductionProposals: [],
  };
}

export function getMemoryDb(): MemoryDatabase {
  if (!globalThis.__nsMemoryDb) {
    globalThis.__nsMemoryDb = createEmptyDb();
  }
  return globalThis.__nsMemoryDb;
}

export function resetMemoryDb(): void {
  globalThis.__nsMemoryDb = createEmptyDb();
}