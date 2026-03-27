import { getAuthUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:5000';

type Params = { params: Promise<{ id: string }> };

// ─── DELETE /api/sessions/[id] ────────────────────────────────────────────────

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );

    const { id } = await params;
    const token = req.cookies.get('rg_token')?.value;

    const res = await fetch(`${BACKEND}/api/sessions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[DELETE /api/sessions/:id]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
