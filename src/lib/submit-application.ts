export type ApplicationInsertRow = {
  full_name: string;
  email: string;
  date_of_birth: string;
  raw_data: Record<string, unknown>;
};

export type ApplicationInsertResult =
  | { ok: true; id: string }
  | { ok: false; message: string; details?: string };

export async function insertApplication(
  row: ApplicationInsertRow,
): Promise<ApplicationInsertResult> {
  try {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });

    let payload: { message?: string; details?: string; ok?: boolean } = {};
    try {
      payload = (await res.json()) as typeof payload;
    } catch {
      payload = {};
    }

    if (!res.ok) {
      console.error("[applications] API insert failed:", res.status, payload);
      return {
        ok: false,
        message: payload.message ?? `Save failed (HTTP ${res.status}).`,
        details: payload.details,
      };
    }

    console.info("[applications] Insert ok via API");
    return { ok: true, id: "saved" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[applications] Unexpected insert error:", err);
    return { ok: false, message };
  }
}