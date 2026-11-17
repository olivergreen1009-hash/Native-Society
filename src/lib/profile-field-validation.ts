export const ICEBREAKER_MAX_LENGTH = 120;

export function normalizeIcebreaker(value: string | undefined | null): string {
  return (value ?? "").trim().slice(0, ICEBREAKER_MAX_LENGTH);
}

export function validateIcebreaker(value: string | undefined | null): string | null {
  const v = (value ?? "").trim();
  if (!v) return null;
  if (v.length > ICEBREAKER_MAX_LENGTH) {
    return `Keep it to ${ICEBREAKER_MAX_LENGTH} characters or fewer.`;
  }
  return null;
}