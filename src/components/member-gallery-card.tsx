import Image from "next/image";
import Link from "next/link";
import type { SocietyProfile } from "@/lib/types";
import { galleryLocationLine } from "@/lib/gallery-location-line";
import { displaySummerDestination } from "@/lib/summer-destination";

type MemberGalleryCardProps = {
  profile: SocietyProfile;
  href: string;
};

/** Weekly “This week” card — photo + compact lines only (detail view has bio). */
export function MemberGalleryCard({ profile, href }: MemberGalleryCardProps) {
  const schoolLine = profile.schoolLine?.trim() || profile.school?.trim() || "";
  const locationLine = galleryLocationLine(
    profile.neighborhood,
    profile.raisedInBorough,
  );
  const summer = displaySummerDestination(
    profile.summerDestination,
    profile.summerOther,
  );

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded border border-ns-border bg-ns-surface transition hover:border-ns-gold/50"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={profile.imageUrl}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 50vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ns-bg via-ns-bg/30 to-transparent" />
        {profile.isSample ? (
          <span className="absolute left-2 top-2 rounded border border-ns-gold/80 bg-ns-bg/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-ns-gold">
            Example
          </span>
        ) : null}
        <div className="absolute bottom-0 w-full space-y-0.5 p-4 md:p-5">
          <p className="font-heading text-lg leading-tight text-ns-cream md:text-xl">
            {profile.firstName} · {profile.age}
          </p>
          {locationLine ? (
            <p className="text-xs text-ns-muted">{locationLine}</p>
          ) : null}
          {schoolLine ? (
            <p className="text-xs text-ns-gold">{schoolLine}</p>
          ) : null}
          {summer ? (
            <p className="text-[11px] text-ns-cream/90">{summer}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}