import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SECRET = process.env.JWT_SECRET as string;
const COOKIE = 'rg_token';

export interface JwtPayload {
  id: string;
  role: string;
  email: string;
  agency: string;
}

// ─── Sign ─────────────────────────────────────────────────────────────────────
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

// ─── Verify ───────────────────────────────────────────────────────────────────
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ─── Set cookie ───────────────────────────────────────────────────────────────
export async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// ─── Clear cookie ─────────────────────────────────────────────────────────────
export async function clearAuthCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

// ─── Get payload from cookie ──────────────────────────────────────────────────
export async function getAuthUser(): Promise<JwtPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── Get payload from request (for middleware) ────────────────────────────────
export function getAuthUserFromRequest(req: NextRequest): JwtPayload | null {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
