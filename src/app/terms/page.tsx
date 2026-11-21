import { LegalDocument } from "@/components/legal-document";

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of use">
      <p>
        Membership is paid, by invitation, and subject to founder review. Native Society
        is a professional and social introduction service—not a dating or romantic
        matchmaking service.
      </p>
      <p className="mt-4">
        {/* TODO(counsel): Replace with counsel-approved membership fees, activation terms, refund policy, and liability limitations before collecting fees. */}
        Placeholder terms: fee schedule, service scope, pause/close rules, and limitations
        of liability will be provided before activation.
      </p>
    </LegalDocument>
  );
}