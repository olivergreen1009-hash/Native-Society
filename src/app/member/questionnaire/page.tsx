"use client";

import { useEffect, useState } from "react";
import { FoundingQuestionnaireForm } from "@/components/founding-questionnaire-form";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";
import { DEMO_MEMBER } from "@/lib/sample-data";

export default function QuestionnairePage() {
  const [memberId, setMemberId] = useState(DEMO_MEMBER.id);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
    const session = cookie
      ? decodeSession(decodeURIComponent(cookie.split("=")[1] ?? ""))
      : null;
    setMemberId(session?.userId ?? DEMO_MEMBER.id);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Founding cohort</p>
      <h1 className="font-heading mt-3 text-4xl text-ns-cream">
        Compatibility questionnaire
      </h1>
      <p className="mt-4 text-sm text-ns-muted">
        Please answer thoughtfully. Your responses are used solely to curate
        introductions and are never shared with other members. Incomplete
        questionnaires delay gallery access.
      </p>
      <div className="mt-10">
        <FoundingQuestionnaireForm memberId={memberId} />
      </div>
    </div>
  );
}
