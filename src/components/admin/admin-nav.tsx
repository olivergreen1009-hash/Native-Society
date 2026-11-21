"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/introductions", label: "Introductions" },
  { href: "/admin/profiles", label: "Profiles" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/reports", label: "Reports" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-10 flex flex-wrap gap-2 border-b border-ns-border pb-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest ${
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(`${link.href}/`))
              ? "bg-ns-gold text-ns-bg"
              : "border border-ns-border text-ns-muted hover:text-ns-cream"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}