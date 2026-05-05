import { NextResponse } from "next/server";
import { AUTH_COOKIE, passwordMatches } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";

  if (!passwordMatches(password)) {
    // small jitter to take the edge off brute force — pointless for 13 guests
    // but it costs us nothing and reads as polite.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // ~6 months — covers pre-wedding through post-wedding gallery viewing
    maxAge: 60 * 60 * 24 * 180,
  });
  return res;
}

export async function DELETE() {
  // Logout — useful for testing and if you ever want to invalidate
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(AUTH_COOKIE);
  return res;
}
