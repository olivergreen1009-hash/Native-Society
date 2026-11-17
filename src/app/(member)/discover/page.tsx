import { redirect } from "next/navigation";

/** Weekly introductions live on the member gallery. */
export default function DiscoverPage() {
  redirect("/member/gallery");
}