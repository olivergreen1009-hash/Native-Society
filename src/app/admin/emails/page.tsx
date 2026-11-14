"use client";

import Link from "next/link";
import { useState } from "react";
import { onboardingEmailTemplates } from "@/lib/email-templates";

export default function AdminEmailsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8">
      <Link href="/admin" className="text-sm text-ns-gold hover:underline">
        ← Admin console
      </Link>
      <p className="mt-6 text-xs uppercase tracking-[0.3em] text-ns-gold">Founder tools</p>
      <h1 className="font-heading mt-3 text-4xl text-ns-cream">
        Onboarding email sequence
      </h1>
      <p className="mt-4 text-sm text-ns-muted">
        Five templates for the founding cohort. Placeholders such as [First Name],
        [email], and [login URL] are ready for your mail client.
      </p>

      <ul className="mt-10 space-y-8">
        {onboardingEmailTemplates.map((template, index) => {
          const full = `Subject: ${template.subject}\n\n${template.body}`;
          return (
            <li
              key={template.id}
              className="rounded border border-ns-border bg-ns-surface p-6"
            >
              <p className="text-xs text-ns-gold">Email {index + 1}</p>
              <h2 className="font-heading mt-2 text-xl text-ns-cream">{template.title}</h2>
              <p className="mt-2 text-sm text-ns-muted">Subject: {template.subject}</p>
              <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-ns-cream">
                {template.body}
              </pre>
              <button
                type="button"
                onClick={() => copy(template.id, full)}
                className="mt-4 rounded-full border border-ns-gold px-5 py-2 text-xs uppercase tracking-widest text-ns-gold"
              >
                {copiedId === template.id ? "Copied" : "Copy to clipboard"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
