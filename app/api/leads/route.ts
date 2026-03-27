import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Lead from '@/models/Leads';
import User from '@/models/User';
import { validateLead } from '@/utils/validators';
import { NextRequest, NextResponse } from 'next/server';

// ─── GET /api/leads ───────────────────────────────────────────────────────────
// Returns leads scoped to the logged-in user's agency.
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    await connectDB();

    // Resolve the agency for this user
    const dbUser = await User.findById(authUser.id).select('agency').lean();
    if (!dbUser?.agency) {
      return NextResponse.json(
        { success: false, message: 'User is not linked to an agency' },
        { status: 403 },
      );
    }

    const agencyId = dbUser.agency;

    const { searchParams } = req.nextUrl;
    const filter: Record<string, unknown> = { agency: agencyId };

    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (priority) filter.priority = priority;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      leads,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[GET /api/leads]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}

// ─── POST /api/leads ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    await connectDB();

    const dbUser = await User.findById(authUser.id).select('agency').lean();
    if (!dbUser?.agency) {
      return NextResponse.json(
        { success: false, message: 'User is not linked to an agency' },
        { status: 403 },
      );
    }

    const body = await req.json();

    // Always attach the authenticated agency — ignore any agency in the body
    const payload = { ...body, agency: dbUser.agency };

    const errors = validateLead(payload);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const lead = await Lead.create(payload);
    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/leads]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
