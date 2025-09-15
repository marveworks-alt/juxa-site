import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if (!needsAuth) return NextResponse.next();

  const USER = process.env.BASIC_AUTH_USER;
  const PASS = process.env.BASIC_AUTH_PASS;

  if (!USER || !PASS) {
    // If creds not set, allow access (useful for local dev)
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Juxa Admin"' },
    });
  }

  const [u, p] = atob(auth.slice(6)).split(':');
  if (u !== USER || p !== PASS) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Juxa Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
