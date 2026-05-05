/**
 * Single source of truth for the wedding date.
 *
 * Ceremony is July 14, 2026 at 12:00 PM Pacific (PDT, UTC-7).
 * That's 2026-07-14T19:00:00Z in UTC.
 *
 * Reception begins at 5:00 PM PT (00:00:00Z on the 15th).
 * Breakfast is the following morning at 8:00 AM PT (15:00:00Z on the 15th).
 */

export const CEREMONY_AT = new Date("2026-07-14T19:00:00Z");
export const RECEPTION_AT = new Date("2026-07-15T00:00:00Z");
export const BREAKFAST_AT = new Date("2026-07-15T15:00:00Z");

export const PRETTY_DATE = "Tuesday · July 14, 2026";
export const PRETTY_DATE_SHORT = "07.14.2026";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
}

export function diffParts(target: Date, now: Date = new Date()): CountdownParts {
  let ms = target.getTime() - now.getTime();
  const past = ms < 0;
  ms = Math.abs(ms);

  const days = Math.floor(ms / 86_400_000);
  ms -= days * 86_400_000;
  const hours = Math.floor(ms / 3_600_000);
  ms -= hours * 3_600_000;
  const minutes = Math.floor(ms / 60_000);
  ms -= minutes * 60_000;
  const seconds = Math.floor(ms / 1000);

  return { days, hours, minutes, seconds, past };
}
