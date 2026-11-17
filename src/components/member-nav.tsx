"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/member/dashboard", label: "Home" },
  { href: "/member/gallery", label: "This week" },
  { href: "/member/profile", label: "Profile" },
  { href: "/member/introductions", label: "Introductions" },
];

export function MemberNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Member"
      className="mb-10 flex flex-wrap gap-2 border-b border-ns-border pb-4"
    >
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/member/dashboard" &&
            pathname.startsWith(`${link.href}/`));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest ${
              active
                ? "bg-ns-gold text-ns-bg"
                : "border border-ns-border text-ns-muted hover:text-ns-cream"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}