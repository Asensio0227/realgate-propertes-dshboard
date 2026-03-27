import { getAuthUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:5000';

// ─── GET /api/sessions ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );

    // Forward query params straight to the backend
    const { searchParams } = req.nextUrl;
    const params = new URLSearchParams();
    if (searchParams.get('platform'))
      params.set('platform', searchParams.get('platform')!);
    if (searchParams.get('leadSaved'))
      params.set('leadSaved', searchParams.get('leadSaved')!);
    if (searchParams.get('search'))
      params.set('search', searchParams.get('search')!);
    if (searchParams.get('page')) params.set('page', searchParams.get('page')!);
    if (searchParams.get('limit'))
      params.set('limit', searchParams.get('limit')!);

    const token = req.cookies.get('rg_token')?.value;
    const res = await fetch(`${BACKEND}/api/sessions?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[GET /api/sessions]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
