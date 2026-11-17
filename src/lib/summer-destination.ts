/** Member-facing label for summer destination on gallery cards. */
export function displaySummerDestination(
  destination?: string | null,
  other?: string | null,
): string | null {
  const d = destination?.trim();
  if (!d) return null;
  if (d === "Other") {
    const o = other?.trim();
    return o ? o : null;
  }
  return d;
}