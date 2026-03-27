import { setAuthCookie, signToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { validateSignup } from '@/utils/validators';
import { NextRequest, NextResponse } from 'next/server';

const agencyId = process.env.DEFAULT_AGENCY_ID;

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, role, agency } = body;

    // Validate
    const errors = validateSignup({ name, email, password });
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Check duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 },
      );
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role ?? 'agent',
      agency: agencyId,
    });

    const token = signToken({
      id: user.id,
      role: user.role,
      email: user.email,
      agency: user.agency.toString(),
    });
    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    console.error('[signin]', message);

    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
