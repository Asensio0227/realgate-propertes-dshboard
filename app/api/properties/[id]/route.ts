import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Property from '@/models/Property';
import { validateProperty } from '@/utils/validators';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// ─── PUT /api/properties/[id] ─────────────────────────────────────────────────

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // Only full-validate when core fields are present (not for availability toggles)
    if (body.title) {
      const errors = validateProperty(body);
      if (Object.keys(errors).length > 0) {
        return NextResponse.json({ success: false, errors }, { status: 400 });
      }
    }

    // Sanitise images if provided
    if ('images' in body) {
      body.images = Array.isArray(body.images)
        ? body.images.filter(
            (u: unknown) => typeof u === 'string' && u.startsWith('http'),
          )
        : [];
    }

    // Prevent agency from being changed via update
    delete body.agency;

    const property = await Property.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: 'after', runValidators: true },
    );

    if (!property) {
      return NextResponse.json(
        { success: false, message: 'Property not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, property });
  } catch (err) {
    console.error('[PUT /api/properties/:id]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/properties/[id] ──────────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin only' },
        { status: 403 },
      );
    }

    await connectDB();
    const { id } = await params;

    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return NextResponse.json(
        { success: false, message: 'Property not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error('[DELETE /api/properties/:id]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
