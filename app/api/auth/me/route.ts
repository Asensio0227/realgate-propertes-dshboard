import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      );
    }

    await connectDB();
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

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
