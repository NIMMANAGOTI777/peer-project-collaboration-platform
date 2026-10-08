import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_NAME = 'peer_collab_token';

function parseJwtPayload(token: string): { id: string; name: string; email: string; role: 'STUDENT' | 'ADMIN'; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_NAME)?.value;
  const user = token ? parseJwtPayload(token) : null;

  // 1. Admin Page Routes (/admin, /admin/*)
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    if (user.role !== 'ADMIN') {
      // Student attempting to access admin route -> redirect to student dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 2. Protected Student Page Routes
  const studentProtectedPrefixes = [
    '/dashboard',
    '/profile',
    '/matches',
    '/collaboration-requests',
    '/notifications',
    '/settings',
    '/projects/create',
  ];

  const isStudentProtected = studentProtectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (isStudentProtected && !user) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 3. Auth pages (/login, /register) when already authenticated
  if (user && (pathname === '/login' || pathname === '/register')) {
    if (user.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/matches/:path*',
    '/collaboration-requests/:path*',
    '/notifications/:path*',
    '/settings/:path*',
    '/projects/create',
    '/login',
    '/register',
  ],
};
