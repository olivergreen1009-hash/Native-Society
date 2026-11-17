import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "@/lib/auth/server";
import { repositories } from "@/repositories/memory";
import { ensureSeeded } from "@/data/seed";

export default async function MatchesPage() {
  ensureSeeded();
  const session = await getServerSession();
  if (!session) return null;

  const matches = await repositories.matches.listForUser(session.userId);
  const rows = await Promise.all(
    matches.map(async (match) => {
      const otherId =
        match.userAId === session.userId ? match.userBId : match.userAId;
      const profile = await repositories.profiles.findByUserId(otherId);
      return { match, profile };
    }),
  );

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Mutual</p>
      <h1 className="font-heading mt-3 text-4xl">Matches</h1>
      <p className="mt-4 text-sm text-ns-muted">
        Messaging opens only after mutual interest. Conversations stay private.
      </p>
      <ul className="mt-10 space-y-4">
        {rows.length === 0 && (
          <li className="rounded border border-ns-border bg-ns-surface p-8 text-sm text-ns-muted">
            No matches yet. Explore this week&apos;s introductions when interest is
            mutual.
          </li>
        )}
        {rows.map(({ match, profile }) => (
          <li key={match.id}>
            <Link
              href={`/matches/${match.id}`}
              className="flex items-center gap-4 rounded border border-ns-border bg-ns-surface p-4 transition hover:border-ns-gold/40"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                {profile?.photos[0] && (
                  <Image
                    src={profile.photos[0].url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-heading text-lg">
                  {profile?.firstName ?? "Member"}
                </p>
                <p className="text-xs text-ns-muted">Open conversation</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}