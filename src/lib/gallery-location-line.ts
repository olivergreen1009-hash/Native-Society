import { NYC_CHILDHOOD_BOROUGHS } from "@/lib/application-options";

/** One subtle location line for weekly cards (neighborhood + raised-in). */
export function galleryLocationLine(
  neighborhood?: string | null,
  raisedInBorough?: string | null,
): string | null {
  const hood = neighborhood?.trim() ?? "";
  const raised = raisedInBorough?.trim() ?? "";

  if (raised && raised !== "Raised in the city") {
    const borough = NYC_CHILDHOOD_BOROUGHS.includes(
      raised as (typeof NYC_CHILDHOOD_BOROUGHS)[number],
    )
      ? raised
      : raised;
    if (hood && !hood.toLowerCase().includes(borough.toLowerCase())) {
      return `${hood} · raised in ${borough}`;
    }
    return `Raised in ${borough}`;
  }

  if (raised === "Raised in the city") {
    if (hood) return `${hood} · raised in the city`;
    return "Raised in the city";
  }

  return hood || null;
}