import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

// POST /api/auth/logout
export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}

// GET /api/auth/logout → /me  (reuse file, separate route below)
