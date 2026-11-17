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

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, "id" | "createdAt">): Promise<User>;
  update(id: string, patch: Partial<User>): Promise<User | null>;
  listActiveMembers(): Promise<User[]>;
  listMembers(): Promise<User[]>;
}

export interface ApplicationRepository {
  findById(id: string): Promise<Application | null>;
  findByEmail(email: string): Promise<Application | null>;
  create(
    app: Omit<Application, "id" | "submittedAt" | "updatedAt" | "status" | "adminNotes">,
  ): Promise<Application>;
  update(id: string, patch: Partial<Application>): Promise<Application | null>;
  listByStatus(status?: ApplicationStatus): Promise<Application[]>;
  listAll(): Promise<Application[]>;
}

export interface ProfileRepository {
  findByUserId(userId: string): Promise<Profile | null>;
  findById(id: string): Promise<Profile | null>;
  listDiscoverable(): Promise<Profile[]>;
  listAll(): Promise<Profile[]>;
  listByModeration(status?: ProfileModerationStatus): Promise<Profile[]>;
  upsert(profile: Profile): Promise<Profile>;
}

export interface PreferencesRepository {
  getByUserId(userId: string): Promise<Preferences | null>;
  upsert(prefs: Preferences): Promise<Preferences>;
}

export interface RecommendationRepository {
  getCurrentBatch(userId: string): Promise<RecommendationBatch | null>;
  saveBatch(batch: RecommendationBatch): Promise<RecommendationBatch>;
}

export interface InterestRepository {
  record(interest: Omit<InterestRecord, "id" | "createdAt">): Promise<InterestRecord>;
  listForUser(userId: string): Promise<InterestRecord[]>;
  getDecision(
    fromUserId: string,
    toUserId: string,
  ): Promise<InterestRecord | null>;
}

export interface MatchRepository {
  create(match: Omit<Match, "id" | "createdAt">): Promise<Match>;
  listForUser(userId: string): Promise<Match[]>;
  findBetween(userAId: string, userBId: string): Promise<Match | null>;
}

export interface MessageRepository {
  listForMatch(matchId: string): Promise<Message[]>;
  send(message: Omit<Message, "id" | "createdAt">): Promise<Message>;
}

export interface BlockRepository {
  isBlocked(userA: string, userB: string): Promise<boolean>;
  listForUser(userId: string): Promise<Block[]>;
  create(block: Omit<Block, "id" | "createdAt">): Promise<Block>;
  remove(id: string): Promise<boolean>;
  listBlockedBy(userId: string): Promise<Block[]>;
}

export interface NotificationPreferencesRepository {
  getByUserId(userId: string): Promise<NotificationPreferences>;
  upsert(prefs: NotificationPreferences): Promise<NotificationPreferences>;
}

export interface ReportRepository {
  create(
    report: Omit<Report, "id" | "createdAt" | "status" | "adminNote" | "resolvedAt">,
  ): Promise<Report>;
  listAll(): Promise<Report[]>;
  listByStatus(status?: ReportStatus): Promise<Report[]>;
  update(id: string, patch: Partial<Report>): Promise<Report | null>;
}

export interface AdminActionRepository {
  log(action: Omit<AdminAction, "id" | "createdAt">): Promise<AdminAction>;
}