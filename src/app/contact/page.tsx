import { LegalDocument } from "@/components/legal-document";

export default function ContactPage() {
  return (
    <LegalDocument title="Contact">
      <p>
        For application status, billing after approval, safety reports, or press:{" "}
        <a href="mailto:hello@nativesociety.nyc" className="text-ns-gold hover:text-ns-cream">
          hello@nativesociety.nyc
        </a>
      </p>
      <p>
        We respond to members and applicants by email. There is no public phone line or
        walk-in desk.
      </p>
    </LegalDocument>
  );
}