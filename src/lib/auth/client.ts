import { SESSION_COOKIE, encodeSession, type SessionPayload } from "./session";

export function setClientSession(session: SessionPayload): void {
  const value = encodeSession(session);
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearClientSession(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}