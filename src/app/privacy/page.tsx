import { LegalDocument } from "@/components/legal-document";

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy">
      <p>
        Native Society collects the information you submit in your application and uses it
        to review eligibility, operate weekly recommendations, and facilitate messaging
        between mutual matches.
      </p>
      <p>
        Profiles are never publicly searchable. Member data is used only to run the
        service and is not sold to third parties.
      </p>
      <p>Full policy text will be published before public launch.</p>
    </LegalDocument>
  );
}