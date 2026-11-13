"use client";

import { foundingGalleryProfileIds, societyProfiles, DEMO_MEMBER } from "./sample-data";
import type {
  CurationMap,
  FoundingQuestionnaire,
  IntroductionRequest,
  InquirySubmission,
  MemberNotesMap,
} from "./types";

const KEYS = {
  curation: "ns-curation",
  introductions: "ns-introductions",
  questionnaire: "ns-founding-questionnaire",
  inquiries: "ns-inquiries",
  memberNotes: "ns-member-notes",
} as const;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function defaultCurationMap(): CurationMap {
  return {
    [DEMO_MEMBER.id]: [...foundingGalleryProfileIds],
  };
}

export function getCurationMap(): CurationMap {
  return readJson(KEYS.curation, defaultCurationMap());
}

export function setMemberGallery(
  memberId: string,
  profileIds: string[],
): CurationMap {
  const map = getCurationMap();
  map[memberId] = profileIds;
  writeJson(KEYS.curation, map);
  return map;
}

/** Swap up to two profiles from the pool into the member gallery (demo refresh). */
export function refreshMemberGallery(memberId: string): string[] {
  const map = getCurationMap();
  const current = map[memberId] ?? foundingGalleryProfileIds;
  const pool = societyProfiles.map((p) => p.id);
  const outside = pool.filter((id) => !current.includes(id));
  if (outside.length === 0) return current;
  const next = [...current];
  const removeIndex = next.length > 3 ? 0 : -1;
  if (removeIndex >= 0) next.splice(removeIndex, 1);
  next.push(outside[0]);
  if (outside[1] && next.length < 8) next.push(outside[1]);
  map[memberId] = next.slice(0, 8);
  writeJson(KEYS.curation, map);
  return map[memberId];
}

export function getIntroductions(): IntroductionRequest[] {
  return readJson<IntroductionRequest[]>(KEYS.introductions, []);
}

export function addIntroduction(
  request: Omit<
    IntroductionRequest,
    "id" | "createdAt" | "status" | "curatorNote" | "coordinatedAt"
  >,
): IntroductionRequest[] {
  const list = getIntroductions();
  const entry: IntroductionRequest = {
    ...request,
    id: `intro-${Date.now()}`,
    status: "pending",
    curatorNote: "",
    createdAt: new Date().toISOString(),
    coordinatedAt: null,
  };
  const next = [entry, ...list];
  writeJson(KEYS.introductions, next);
  return next;
}

export function updateIntroduction(
  id: string,
  patch: Partial<IntroductionRequest>,
): IntroductionRequest[] {
  const list = getIntroductions();
  const next = list.map((item) =>
    item.id === id ? { ...item, ...patch } : item,
  );
  writeJson(KEYS.introductions, next);
  return next;
}

function emptyQuestionnaire(memberId: string): FoundingQuestionnaire {
  return {
    memberId,
    currentSection: 1,
    submittedAt: null,
    sections: {
      relationshipIntent: {},
      valuesLife: {},
      lifestyle: {},
      partnerPrefs: {},
      profileVisibility: {},
    },
  };
}

export function getFoundingQuestionnaire(
  memberId: string,
): FoundingQuestionnaire {
  const all = readJson<Record<string, FoundingQuestionnaire>>(
    KEYS.questionnaire,
    {},
  );
  return all[memberId] ?? emptyQuestionnaire(memberId);
}

export function saveFoundingQuestionnaire(
  data: FoundingQuestionnaire,
): FoundingQuestionnaire {
  const all = readJson<Record<string, FoundingQuestionnaire>>(
    KEYS.questionnaire,
    {},
  );
  all[data.memberId] = data;
  writeJson(KEYS.questionnaire, all);
  return data;
}

export function submitFoundingQuestionnaire(
  memberId: string,
): FoundingQuestionnaire {
  const current = getFoundingQuestionnaire(memberId);
  const submitted = {
    ...current,
    submittedAt: new Date().toISOString(),
  };
  return saveFoundingQuestionnaire(submitted);
}

export function getInquiries(): InquirySubmission[] {
  return readJson<InquirySubmission[]>(KEYS.inquiries, []);
}

export function addInquiry(
  data: Omit<InquirySubmission, "id" | "createdAt">,
): void {
  const list = getInquiries();
  writeJson(KEYS.inquiries, [
    {
      ...data,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
    },
    ...list,
  ]);
}

export function getMemberNotes(): MemberNotesMap {
  return readJson<MemberNotesMap>(KEYS.memberNotes, {});
}

export function setMemberNote(memberId: string, note: string): MemberNotesMap {
  const map = getMemberNotes();
  map[memberId] = note;
  writeJson(KEYS.memberNotes, map);
  return map;
}
