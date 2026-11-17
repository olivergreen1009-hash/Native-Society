import type { ApplicationSubmitBody } from "@/lib/application-api";
import type { ApplicationProfilePhoto } from "@/lib/types";

export type SupabaseApplicationRow = {
  id: string;
  full_name: string;
  email: string;
  date_of_birth: string;
  raw_data: Record<string, unknown> | null;
  created_at: string | null;
};

export function parseApplicationRawData(
  raw: unknown,
): ApplicationSubmitBody | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as ApplicationSubmitBody;
}

export function occupationFromRow(row: SupabaseApplicationRow): string {
  const raw = parseApplicationRawData(row.raw_data);
  return raw?.occupation?.trim() ?? "—";
}

export function summerFromRow(row: SupabaseApplicationRow): string {
  const raw = parseApplicationRawData(row.raw_data);
  if (!raw?.summerDestination) return "—";
  if (raw.summerDestination === "Other" && raw.summerOther) {
    return `Other (${raw.summerOther})`;
  }
  return raw.summerDestination;
}

export function highSchoolFromRow(row: SupabaseApplicationRow): string {
  const raw = parseApplicationRawData(row.raw_data);
  const name = raw?.highSchool?.schoolName?.trim();
  if (name) return name;
  return "—";
}

export function formatSubmittedAt(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function profilePhotoDataUrl(
  photo: ApplicationProfilePhoto | undefined,
): string | null {
  if (!photo?.dataBase64?.trim()) return null;
  const mime = photo.mimeType || "image/jpeg";
  if (photo.dataBase64.startsWith("data:")) return photo.dataBase64;
  return `data:${mime};base64,${photo.dataBase64}`;
}