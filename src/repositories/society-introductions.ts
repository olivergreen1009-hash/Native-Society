import { ensureSeeded } from "@/data/seed";
import { getMemoryDb } from "@/lib/data/memory-store";
import type {
  IntroductionProposal,
  IntroductionProposalState,
  ProposalMemberResponse,
} from "@/types/society";

const id = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const now = () => new Date().toISOString();

function db() {
  ensureSeeded();
  return getMemoryDb();
}

export const societyIntroductions = {
  async listForMember(memberId: string): Promise<IntroductionProposal[]> {
    const rows = db().introductionProposals.filter(
      (p) =>
        p.recipientMemberId === memberId || p.counterpartMemberId === memberId,
    );
    return rows.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  async listAll(): Promise<IntroductionProposal[]> {
    return [...db().introductionProposals].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  async findById(proposalId: string): Promise<IntroductionProposal | null> {
    return db().introductionProposals.find((p) => p.id === proposalId) ?? null;
  },

  async create(
    input: Omit<
      IntroductionProposal,
      "id" | "createdAt" | "updatedAt" | "recipientResponse" | "counterpartResponse" | "state"
    > & { state?: IntroductionProposalState },
  ): Promise<IntroductionProposal> {
    const created: IntroductionProposal = {
      ...input,
      id: id("intro"),
      state: input.state ?? "draft",
      recipientResponse: "pending",
      counterpartResponse: "pending",
      createdAt: now(),
      updatedAt: now(),
    };
    db().introductionProposals.push(created);
    return created;
  },

  async update(
    proposalId: string,
    patch: Partial<IntroductionProposal>,
  ): Promise<IntroductionProposal | null> {
    const idx = db().introductionProposals.findIndex((p) => p.id === proposalId);
    if (idx < 0) return null;
    const updated = {
      ...db().introductionProposals[idx],
      ...patch,
      updatedAt: now(),
    };
    db().introductionProposals[idx] = updated;
    return updated;
  },

  async respond(
    proposalId: string,
    memberId: string,
    response: Exclude<ProposalMemberResponse, "pending">,
  ): Promise<IntroductionProposal | null> {
    const row = await this.findById(proposalId);
    if (!row || row.state !== "awaiting_responses") return null;

    let next = { ...row };
    if (memberId === row.recipientMemberId) {
      next.recipientResponse = response;
    } else if (memberId === row.counterpartMemberId) {
      next.counterpartResponse = response;
    } else {
      return null;
    }

    if (response === "declined") {
      next.state = "declined";
    } else if (
      next.recipientResponse === "accepted" &&
      next.counterpartResponse === "accepted"
    ) {
      next.state = "mutually_accepted";
    }

    return this.update(proposalId, next);
  },
};