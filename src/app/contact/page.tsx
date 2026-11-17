import { LegalDocument } from "@/components/legal-document";

export default function ContactPage() {
  return (
    <LegalDocument title="Contact">
      <p>
        For membership questions:{" "}
        <a href="mailto:membership@nativesociety.nyc" className="text-ns-gold">
          membership@nativesociety.nyc
        </a>
      </p>
      <p>
        For safety reports:{" "}
        <a href="mailto:safety@nativesociety.nyc" className="text-ns-gold">
          safety@nativesociety.nyc
        </a>
      </p>
    </LegalDocument>
  );
}