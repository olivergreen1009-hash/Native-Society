"use client";

import { FormEvent, useState } from "react";
import {
  QUESTIONNAIRE_SECTION_COUNT,
  questionnaireSections,
} from "@/lib/questionnaire-schema";
import {
  getFoundingQuestionnaire,
  saveFoundingQuestionnaire,
  submitFoundingQuestionnaire,
} from "@/lib/client-store";
import type { FoundingQuestionnaire } from "@/lib/types";

export function FoundingQuestionnaireForm({ memberId }: { memberId: string }) {
  const [data, setData] = useState<FoundingQuestionnaire>(() =>
    getFoundingQuestionnaire(memberId),
  );
  const [submitted, setSubmitted] = useState(Boolean(data.submittedAt));
  const [savedFlash, setSavedFlash] = useState(false);

  const sectionIndex = Math.min(
    Math.max(data.currentSection, 1),
    QUESTIONNAIRE_SECTION_COUNT,
  );
  const section = questionnaireSections[sectionIndex - 1];

  const sectionValues = data.sections[section.id];

  const setField = (key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section.id]: { ...prev.sections[section.id], [key]: value },
      },
    }));
  };

  const persist = (next: FoundingQuestionnaire) => {
    saveFoundingQuestionnaire(next);
    setData(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const onSaveContinue = (e: FormEvent) => {
    e.preventDefault();
    const nextSection = Math.min(sectionIndex + 1, QUESTIONNAIRE_SECTION_COUNT);
    persist({ ...data, currentSection: nextSection });
  };

  const onSubmitFinal = (e: FormEvent) => {
    e.preventDefault();
    saveFoundingQuestionnaire(data);
    submitFoundingQuestionnaire(memberId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <article className="rounded border border-ns-gold/40 bg-ns-surface p-8 text-center">
        <p className="font-heading text-2xl text-ns-cream">Thank you.</p>
        <p className="mt-4 text-sm leading-relaxed text-ns-muted">
          Your profile is under review. Gallery access will be granted once
          approved.
        </p>
      </article>
    );
  }

  return (
    <article>
      <p className="text-xs uppercase tracking-widest text-ns-gold">
        Section {sectionIndex} of {QUESTIONNAIRE_SECTION_COUNT}
      </p>
      <h2 className="font-heading mt-2 text-2xl text-ns-cream">{section.title}</h2>
      {"intro" in section && section.intro && (
        <p className="mt-3 text-sm text-ns-muted">{section.intro}</p>
      )}

      <form
        onSubmit={
          sectionIndex === QUESTIONNAIRE_SECTION_COUNT
            ? onSubmitFinal
            : onSaveContinue
        }
        className="mt-8 space-y-6"
      >
        {section.fields.map((field) => (
          <fieldset key={field.key} className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-ns-muted">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                value={sectionValues[field.key] ?? ""}
                onChange={(e) => setField(field.key, e.target.value)}
                required={sectionIndex < QUESTIONNAIRE_SECTION_COUNT}
                className="w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
              >
                <option value="">Select one</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                value={sectionValues[field.key] ?? ""}
                onChange={(e) => setField(field.key, e.target.value)}
                rows={4}
                placeholder={"placeholder" in field ? field.placeholder : undefined}
                className="w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
              />
            ) : (
              <input
                value={sectionValues[field.key] ?? ""}
                onChange={(e) => setField(field.key, e.target.value)}
                className="w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
              />
            )}
          </fieldset>
        ))}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {sectionIndex > 1 && (
            <button
              type="button"
              onClick={() =>
                persist({ ...data, currentSection: sectionIndex - 1 })
              }
              className="rounded-full border border-ns-border px-6 py-3 text-xs uppercase tracking-widest text-ns-cream"
            >
              Previous section
            </button>
          )}
          <button
            type="submit"
            className="rounded-full bg-ns-gold px-8 py-3 text-sm uppercase tracking-widest text-ns-bg hover:bg-ns-cream"
          >
            {sectionIndex === QUESTIONNAIRE_SECTION_COUNT
              ? "Submit questionnaire"
              : "Save and continue"}
          </button>
          {savedFlash && (
            <span className="text-sm text-ns-gold">Progress saved.</span>
          )}
        </div>
      </form>
    </article>
  );
}
