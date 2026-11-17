import { MatchChat } from "@/components/match-chat";
import Link from "next/link";

type Params = { params: Promise<{ matchId: string }> };

export default async function MatchThreadPage({ params }: Params) {
  const { matchId } = await params;
  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col px-5 md:px-8">
      <Link href="/matches" className="text-sm text-ns-gold hover:underline">
        ← Matches
      </Link>
      <MatchChat matchId={matchId} />
    </div>
  );
}