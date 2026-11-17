import { repositories } from "@/repositories/memory";
import { canReceiveIntroductions } from "@/lib/membership/visibility";
import type { ApplicationStatus } from "@/types/domain";

export async function getAdminAnalytics() {
  const applications = await repositories.applications.listAll();
  const byStatus = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<ApplicationStatus, number>,
  );

  const members = await repositories.users.listMembers();
  const activeMembers = members.filter(
    (m) => m.accountStatus === "active" && m.approvedAt,
  );
  const discoverableMembers = (
    await Promise.all(
      members.map(async (m) => {
        const profile = await repositories.profiles.findByUserId(m.id);
        if (!profile) return false;
        return canReceiveIntroductions(m);
      }),
    )
  ).filter(Boolean).length;

  const { getMemoryDb } = await import("@/lib/data/memory-store");
  const store = getMemoryDb();
  const matchCount = store.matches.length;
  const messageCount = store.messages.length;
  const openReports = (await repositories.reports.listByStatus("open")).length;

  return {
    applicationsByStatus: byStatus,
    applicationTotal: applications.length,
    memberTotal: members.length,
    activeApprovedMembers: activeMembers.length,
    receivingIntroductions: discoverableMembers,
    matchCount,
    messageCount,
    openReports,
  };
}