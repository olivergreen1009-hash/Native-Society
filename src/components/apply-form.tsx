"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, type ReactNode } from "react";
import { FormField, inputClassName } from "@/components/ui/form-field";
import type { SocietyApplicationRawData } from "@/types/society";

export function ApplyForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(e.currentTarget);

    const consents = {
      notDatingService: data.get("consentNotDating") === "on",
      termsPrivacy: data.get("consentTerms") === "on",
      noPaymentWithApplication: data.get("consentNoPayment") === "on",
    };

    if (!consents.notDatingService || !consents.termsPrivacy || !consents.noPaymentWithApplication) {
      setError("Please accept all required confirmations.");
      setLoading(false);
      return;
    }

    const rawData: SocietyApplicationRawData = {
      shareable: {
        fullName: String(data.get("fullName") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        industryConnection: String(data.get("industryConnection") ?? "").trim(),
        introductionUsefulness: String(data.get("introductionUsefulness") ?? "").trim(),
        experiencePerspective: String(data.get("experiencePerspective") ?? "").trim(),
        specificInterests: String(data.get("specificInterests") ?? "").trim(),
      },
      founderOnly: {
        roleOwnershipDetail: String(data.get("roleOwnershipDetail") ?? "").trim(),
        familyIndustryTies: String(data.get("familyIndustryTies") ?? "").trim(),
        additionalContext: String(data.get("additionalContext") ?? "").trim(),
      },
      consents,
      referralSource: String(data.get("referralSource") ?? "").trim() || undefined,
    };

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawData }),
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
    <form onSubmit={onSubmit} className="mt-10 space-y-8">
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <fieldset className="space-y-5 border-none p-0">
        <legend className="font-heading text-lg text-ns-cream">
          Shareable with introductions (when you approve)
        </legend>
        <p className="text-sm text-ns-muted">
          These answers may appear in a limited profile shared only after you approve
          participation in a specific introduction.
        </p>
        <FormField label="Full name" name="fullName" required />
        <FormField label="Email" name="email" type="email" required />
        <FormField
          label="Your connection to New York real estate or hospitality"
          name="industryConnection"
          as="textarea"
          rows={4}
          required
          placeholder="Role, ownership, operating focus, or how your work ties to the industry…"
        />
        <FormField
          label="What would make an introduction genuinely useful to you right now?"
          name="introductionUsefulness"
          as="textarea"
          rows={3}
          required
        />
        <FormField
          label="Experience and perspective you bring"
          name="experiencePerspective"
          as="textarea"
          rows={3}
          required
        />
        <FormField
          label="Specific interests (collaborations, peers, operating partners, etc.)"
          name="specificInterests"
          as="textarea"
          rows={3}
          required
        />
      </fieldset>

      <fieldset className="space-y-5 border-t border-ns-border pt-8">
        <legend className="font-heading text-lg text-ns-gold">Founder review only</legend>
        <p className="text-sm text-ns-muted">
          Not shown to other members. Used to assess fit and whether we can meaningfully
          serve your goals.
        </p>
        <FormField
          label="Role, ownership, or operating detail"
          name="roleOwnershipDetail"
          as="textarea"
          rows={3}
          required
        />
        <FormField
          label="Family or household ties to the industry (if applicable)"
          name="familyIndustryTies"
          as="textarea"
          rows={2}
          placeholder="Optional — immediate family and your own activities"
        />
        <FormField
          label="Additional context for review"
          name="additionalContext"
          as="textarea"
          rows={2}
        />
        <FormField
          label="How you heard about Native Society"
          name="referralSource"
          placeholder="Optional"
        />
      </fieldset>

      <fieldset className="space-y-4 border-t border-ns-border pt-8">
        <legend className="font-heading text-lg text-ns-cream">Required confirmations</legend>
        <ConsentCheckbox
          name="consentNotDating"
          label="I understand Native Society is for professional and social connections only—not a dating or romantic matchmaking service."
        />
        <ConsentCheckbox
          name="consentTerms"
          label={
            <>
              I agree to the{" "}
              <Link href="/terms" className="text-ns-gold underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-ns-gold underline">
                Privacy Policy
              </Link>
              .
            </>
          }
        />
        <ConsentCheckbox
          name="consentNoPayment"
          label="I understand no payment is collected with this application. Fees and service terms are provided before I decide whether to activate membership."
        />
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-ns-gold py-3 text-sm uppercase tracking-widest text-ns-bg disabled:opacity-50 sm:w-auto sm:px-12"
      >
        {loading ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}

function ConsentCheckbox({
  name,
  label,
}: {
  name: string;
  label: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-ns-cream">
      <input
        type="checkbox"
        name={name}
        required
        className="mt-1 shrink-0 accent-ns-gold"
      />
      <span>{label}</span>
    </label>
  );
}