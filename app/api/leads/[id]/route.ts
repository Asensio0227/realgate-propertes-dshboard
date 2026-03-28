import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Lead from '@/models/Leads';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// ─── Shared: resolve agency and ownership ─────────────────────────────────────

async function resolveAgencyLead(authUserId: string, leadId: string) {
  const dbUser = await User.findById(authUserId).select('agency').lean();
  if (!dbUser?.agency)
    return { error: 'User is not linked to an agency', status: 403 };

  const lead = await Lead.findOne({ _id: leadId, agency: dbUser.agency });
  if (!lead) return { error: 'Lead not found', status: 404 };

  return { lead };
}

// ─── PATCH /api/leads/[id] ────────────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    await connectDB();
    const { id } = await params;
    const result = await resolveAgencyLead(authUser.id, id);

    if ('error' in result) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: result.status },
      );
    }

    const body = await req.json();
    delete body.agency; // prevent agency from being overwritten

    const ALLOWED = [
      'status',
      'priority',
      'notes',
      'source',
      'type',
      'propertyType',
      'budget',
      'location',
      'name',
      'phone',
    ];
    const update: Record<string, unknown> = {};
    for (const key of ALLOWED) {
      if (key in body) update[key] = body[key];
    }

    const updated = await Lead.findByIdAndUpdate(
      id,
      { $set: update },
      { returnDocument: 'after', runValidators: true },
    );
    return NextResponse.json({ success: true, lead: updated });
  } catch (err) {
    console.error('[PATCH /api/leads/:id]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/leads/[id] ───────────────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    await connectDB();
    const { id } = await params;
    const result = await resolveAgencyLead(authUser.id, id);

    if ('error' in result) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: result.status },
      );
    }

    await Lead.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    console.error('[DELETE /api/leads/:id]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
