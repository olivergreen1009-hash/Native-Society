import { ensureSeeded } from "@/data/seed";
import { getMemoryDb } from "@/lib/data/memory-store";
import type {
  AdminAction,
  Application,
  Block,
  InterestRecord,
  Match,
  Message,
  Preferences,
  Profile,
  RecommendationBatch,
  Report,
  User,
  NotificationPreferences,
  ApplicationStatus,
  ProfileModerationStatus,
  ReportStatus,
} from "@/types/domain";
import type {
  AdminActionRepository,
  ApplicationRepository,
  BlockRepository,
  InterestRepository,
  MatchRepository,
  MessageRepository,
  NotificationPreferencesRepository,
  PreferencesRepository,
  ProfileRepository,
  RecommendationRepository,
  ReportRepository,
  UserRepository,
} from "@/repositories/interfaces";
import { isIntroductionCandidate } from "@/lib/membership/visibility";

const id = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const now = () => new Date().toISOString();

function db() {
  ensureSeeded();
  return getMemoryDb();
}

export const memoryUsers: UserRepository = {
  async findById(userId) {
    return db().users.get(userId) ?? null;
  },
  async findByEmail(email) {
    const uid = db().usersByEmail.get(email.trim().toLowerCase());
    return uid ? (db().users.get(uid) ?? null) : null;
  },
  async create(user) {
    const created: User = {
      ...user,
      id: id("user"),
      createdAt: now(),
    };
    db().users.set(created.id, created);
    db().usersByEmail.set(created.email.toLowerCase(), created.id);
    return created;
  },
  async update(userId, patch) {
    const existing = db().users.get(userId);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    db().users.set(userId, updated);
    if (patch.email) {
      db().usersByEmail.set(patch.email.toLowerCase(), userId);
    }
    return updated;
  },
  async listActiveMembers() {
    return [...db().users.values()].filter(
      (u) => u.active && u.role === "member",
    );
  },
  async listMembers() {
    return [...db().users.values()].filter((u) => u.role === "member");
  },
};

export const memoryApplications: ApplicationRepository = {
  async findById(appId) {
    return db().applications.get(appId) ?? null;
  },
  async findByEmail(email) {
    return (
      [...db().applications.values()].find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
      ) ?? null
    );
  },
  async create(app) {
    const created: Application = {
      ...app,
      id: id("app"),
      status: "applied",
      adminNotes: "",
      submittedAt: now(),
      updatedAt: now(),
    };
    db().applications.set(created.id, created);
    return created;
  },
  async update(appId, patch) {
    const existing = db().applications.get(appId);
    if (!existing) return null;
    const updated = { ...existing, ...patch, updatedAt: now() };
    db().applications.set(appId, updated);
    return updated;
  },
  async listAll() {
    return [...db().applications.values()].sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  },
  async listByStatus(status?: ApplicationStatus) {
    const all = await this.listAll();
    return status ? all.filter((a) => a.status === status) : all;
  },
};

export const memoryProfiles: ProfileRepository = {
  async findByUserId(userId) {
    return (
      [...db().profiles.values()].find((p) => p.userId === userId) ?? null
    );
  },
  async findById(profileId) {
    return db().profiles.get(profileId) ?? null;
  },
  async listDiscoverable() {
    const store = db();
    return [...store.profiles.values()].filter((p) => {
      const user = store.users.get(p.userId);
      if (!user) return false;
      return isIntroductionCandidate(user, p);
    });
  },
  async listAll() {
    return [...db().profiles.values()];
  },
  async listByModeration(status?: ProfileModerationStatus) {
    const all = await this.listAll();
    if (!status) {
      return all.filter(
        (p) =>
          p.moderationStatus === "flagged" ||
          p.moderationStatus === "pending_review",
      );
    }
    return all.filter((p) => p.moderationStatus === status);
  },
  async upsert(profile) {
    db().profiles.set(profile.id, { ...profile, updatedAt: now() });
    return profile;
  },
};

export const memoryPreferences: PreferencesRepository = {
  async getByUserId(userId) {
    return db().preferences.get(userId) ?? null;
  },
  async upsert(prefs) {
    db().preferences.set(prefs.userId, prefs);
    return prefs;
  },
};

export const memoryRecommendations: RecommendationRepository = {
  async getCurrentBatch(userId) {
    const batches = [...db().batches.values()].filter(
      (b) => b.userId === userId,
    );
    batches.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return batches[0] ?? null;
  },
  async saveBatch(batch) {
    db().batches.set(batch.id, batch);
    return batch;
  },
};

export const memoryInterests: InterestRepository = {
  async record(interest) {
    const created: InterestRecord = {
      ...interest,
      id: id("int"),
      createdAt: now(),
    };
    db().interests = db().interests.filter(
      (i) =>
        !(
          i.fromUserId === interest.fromUserId &&
          i.toUserId === interest.toUserId &&
          i.batchId === interest.batchId
        ),
    );
    db().interests.push(created);
    return created;
  },
  async listForUser(userId) {
    return db().interests.filter(
      (i) => i.fromUserId === userId || i.toUserId === userId,
    );
  },
  async getDecision(fromUserId, toUserId) {
    return (
      [...db().interests]
        .reverse()
        .find(
          (i) => i.fromUserId === fromUserId && i.toUserId === toUserId,
        ) ?? null
    );
  },
};

export const memoryMatches: MatchRepository = {
  async create(match) {
    const created: Match = { ...match, id: id("match"), createdAt: now() };
    db().matches.push(created);
    return created;
  },
  async listForUser(userId) {
    return db().matches.filter(
      (m) => m.userAId === userId || m.userBId === userId,
    );
  },
  async findBetween(userAId, userBId) {
    return (
      db().matches.find(
        (m) =>
          (m.userAId === userAId && m.userBId === userBId) ||
          (m.userAId === userBId && m.userBId === userAId),
      ) ?? null
    );
  },
};

export const memoryMessages: MessageRepository = {
  async listForMatch(matchId) {
    return db()
      .messages.filter((m) => m.matchId === matchId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  },
  async send(message) {
    const created: Message = {
      ...message,
      id: id("msg"),
      createdAt: now(),
    };
    db().messages.push(created);
    return created;
  },
};

export const memoryBlocks: BlockRepository = {
  async isBlocked(userA, userB) {
    return db().blocks.some(
      (b) =>
        (b.blockerId === userA && b.blockedId === userB) ||
        (b.blockerId === userB && b.blockedId === userA),
    );
  },
  async listForUser(userId) {
    return db().blocks.filter(
      (b) => b.blockerId === userId || b.blockedId === userId,
    );
  },
  async create(block) {
    const created: Block = { ...block, id: id("block"), createdAt: now() };
    db().blocks.push(created);
    return created;
  },
  async remove(blockId) {
    const store = db();
    const before = store.blocks.length;
    store.blocks = store.blocks.filter((b) => b.id !== blockId);
    return store.blocks.length < before;
  },
  async listBlockedBy(userId) {
    return db().blocks.filter((b) => b.blockerId === userId);
  },
};

export const memoryNotifications: NotificationPreferencesRepository = {
  async getByUserId(userId) {
    const existing = db().notificationPreferences.get(userId);
    if (existing) return existing;
    const defaults: NotificationPreferences = {
      userId,
      emailNewIntroductions: true,
      emailMutualMatches: true,
      emailMessages: true,
      inAppNewIntroductions: true,
      inAppMutualMatches: true,
      inAppMessages: true,
    };
    db().notificationPreferences.set(userId, defaults);
    return defaults;
  },
  async upsert(prefs) {
    db().notificationPreferences.set(prefs.userId, prefs);
    return prefs;
  },
};

export const memoryReports: ReportRepository = {
  async create(report) {
    const created: Report = {
      ...report,
      id: id("report"),
      status: "open",
      adminNote: "",
      createdAt: now(),
      resolvedAt: null,
    };
    db().reports.push(created);
    return created;
  },
  async listAll() {
    return [...db().reports].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
  async listByStatus(status?: ReportStatus) {
    const all = await this.listAll();
    return status ? all.filter((r) => r.status === status) : all;
  },
  async update(reportId, patch) {
    const store = db();
    const idx = store.reports.findIndex((r) => r.id === reportId);
    if (idx < 0) return null;
    const updated = { ...store.reports[idx], ...patch };
    store.reports[idx] = updated;
    return updated;
  },
};

export const memoryAdminActions: AdminActionRepository = {
  async log(action) {
    const created: AdminAction = {
      ...action,
      id: id("admin"),
      createdAt: now(),
    };
    db().adminActions.push(created);
    return created;
  },
};

export const repositories = {
  users: memoryUsers,
  applications: memoryApplications,
  profiles: memoryProfiles,
  preferences: memoryPreferences,
  recommendations: memoryRecommendations,
  interests: memoryInterests,
  matches: memoryMatches,
  messages: memoryMessages,
  blocks: memoryBlocks,
  reports: memoryReports,
  notifications: memoryNotifications,
  adminActions: memoryAdminActions,
};