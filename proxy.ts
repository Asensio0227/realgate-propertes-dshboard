import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from './lib/auth';

const PUBLIC_PATHS = [
  '/', // home landing page — exact match handled below
  '/signin',
  '/signup',
  '/api/auth/signin',
  '/api/auth/signup',
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths (exact match for '/' to avoid catching everything)
  if (
    PUBLIC_PATHS.some((p) =>
      p === '/' ? pathname === '/' : pathname.startsWith(p),
    )
  ) {
    return NextResponse.next();
  }

  // Allow static files and Next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const user = getAuthUserFromRequest(req);

  // Not authenticated → redirect to signin
  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  // Protect API routes — only admin/agent
  if (pathname.startsWith('/api/') && !['admin', 'agent'].includes(user.role)) {
    return NextResponse.json(
      { success: false, message: 'Forbidden' },
      { status: 403 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
