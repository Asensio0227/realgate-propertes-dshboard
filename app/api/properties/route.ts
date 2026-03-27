import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Property from '@/models/Property';
import { validateProperty } from '@/utils/validators';
import { NextRequest, NextResponse } from 'next/server';

// ─── GET /api/properties ──────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );

    await connectDB();

    const { searchParams } = req.nextUrl;
    const filter: Record<string, unknown> = { agency: user.agency };

    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const available = searchParams.get('available');
    const search = searchParams.get('search');

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (available) filter.available = available === 'true';
    if (search) filter.title = { $regex: search, $options: 'i' };

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      properties,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[GET /api/properties]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}

// ─── POST /api/properties ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );

    await connectDB();
    const body = await req.json();

    const errors = validateProperty(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Ensure images is always a clean string array
    const images: string[] = Array.isArray(body.images)
      ? body.images.filter(
          (u: unknown) => typeof u === 'string' && u.startsWith('http'),
        )
      : [];

    const property = await Property.create({
      ...body,
      images,
      agency: user.agency,
    });
    return NextResponse.json({ success: true, property }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/properties]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
