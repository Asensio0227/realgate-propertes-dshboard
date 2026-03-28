import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Session from '@/models/Session';
import { NextRequest, NextResponse } from 'next/server';

// ─── GET /api/sessions ────────────────────────────────────────────────────────
// Returns sessions scoped to the logged-in user's agency.
// Query params: platform, leadSaved, search, page, limit

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }
    if (!user.agency) {
      return NextResponse.json(
        { success: false, message: 'User is not linked to an agency' },
        { status: 403 },
      );
    }

    await connectDB();

    const { searchParams } = req.nextUrl;
    const filter: Record<string, unknown> = { agency: user.agency };

    const platform = searchParams.get('platform');
    const leadSaved = searchParams.get('leadSaved');
    const search = searchParams.get('search');

    if (platform) filter.platform = platform;
    if (leadSaved !== null) filter.leadSaved = leadSaved === 'true';
    if (search) filter.senderId = { $regex: search, $options: 'i' };

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '50');
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      Session.find(filter)
        .sort({ lastActivity: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Session.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      sessions,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[GET /api/sessions]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/sessions?id=<sessionId> ──────────────────────────────────────
// Uses query param instead of [id] path segment to avoid Turbopack regex bug
// in Next.js 16 with dynamic API segments.

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }
    if (!user.agency) {
      return NextResponse.json(
        { success: false, message: 'User is not linked to an agency' },
        { status: 403 },
      );
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 },
      );
    }

    await connectDB();

    // Agency-scope the delete — agents can only delete their own agency's sessions
    const session = await Session.findOneAndDelete({
      _id: id,
      agency: user.agency,
    });
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: 'Session deleted' });
  } catch (err) {
    console.error('[DELETE /api/sessions]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
