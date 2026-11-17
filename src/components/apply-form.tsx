"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FormField, inputClassName } from "@/components/ui/form-field";
import type { RelationshipIntention } from "@/types/domain";

const intentions: { value: RelationshipIntention; label: string }[] = [
  { value: "long_term", label: "Long-term partnership" },
  { value: "marriage_minded", label: "Marriage-minded" },
  { value: "open_to_explore", label: "Open to explore" },
  { value: "not_sure", label: "Still clarifying" },
];

export function ApplyForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const payload = {
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      dateOfBirth: String(data.get("dateOfBirth") ?? ""),
      location: String(data.get("location") ?? ""),
      nycUpbringing: String(data.get("nycUpbringing") ?? ""),
      schoolHistory: String(data.get("schoolHistory") ?? ""),
      relationshipIntention: String(
        data.get("relationshipIntention") ?? "long_term",
      ) as RelationshipIntention,
      referralSource: String(data.get("referralSource") ?? ""),
    };

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Unable to submit application.");
      return;
    }
    const json = (await res.json()) as { applicationId: string };
    router.push(`/application/status?id=${encodeURIComponent(json.applicationId)}`);
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3.5 md:mt-10 md:space-y-5">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <FormField label="Full name" name="fullName" required />
      <FormField label="Email" name="email" type="email" required />
      <FormField
        label="Date of birth"
        name="dateOfBirth"
        type="date"
        required
      />
      <FormField label="Current location" name="location" required />
      <FormField
        label="NYC upbringing"
        name="nycUpbringing"
        placeholder="Neighborhoods, years in the city, family roots…"
        required
      />
      <FormField
        label="School history"
        name="schoolHistory"
        placeholder="e.g. Chapin → Andover"
        required
      />
      <FormField label="Relationship intention">
        <select
          name="relationshipIntention"
          className={inputClassName}
          defaultValue="long_term"
        >
          {intentions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-ns-surface">
              {opt.label}
            </option>
          ))}
        </select>
      </FormField>
      <FormField
        label="Referral source"
        name="referralSource"
        placeholder="Member name, event, or how you heard of us"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="min-h-11 w-full rounded-full bg-ns-gold py-3 text-sm font-medium uppercase tracking-widest text-ns-bg hover:bg-ns-cream disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}