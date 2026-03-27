import { setAuthCookie, signToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      email: user.email,
      agency: user.agency.toString(),
    });
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    console.error('[signin]', message);

    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
