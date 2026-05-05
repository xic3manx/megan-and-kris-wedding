/**
 * Auth helpers — single shared password printed on the Bella Figura
 * enclosure card. Cookie-based; no per-user accounts.
 *
 * Design: when a guest authenticates, we store the password itself in
 * an HTTP-only cookie and validate it on each request via the same
 * `passwordMatches` function. This keeps middleware (Edge runtime) and
 * the API route (Node runtime) in lockstep — no derived tokens that
 * might compute differently across runtimes.
 */

export const AUTH_COOKIE = "mk_auth";

/**
 * Constant-time-ish equality. Web Crypto's `timingSafeEqual` would be
 * better but isn't available in Edge runtime; this is good enough for
 * a 13-guest site behind an obscure URL.
 */
export function passwordMatches(input: string): boolean {
  const expected = process.env.SITE_PASSWORD ?? "";
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
