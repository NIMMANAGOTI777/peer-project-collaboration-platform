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

const DEMO_COOKIE_NAME = 'peer_collab_demo_role';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const demoParam = request.nextUrl.searchParams.get('demo');

  // Direct demo query parameter entry (?demo=STUDENT or ?demo=FACULTY_ADMIN / ?demo=ADMIN)
  if (demoParam) {
    const normalized = demoParam.toUpperCase();
    if (normalized === 'STUDENT') {
      const targetUrl = new URL('/dashboard', request.url);
      targetUrl.searchParams.delete('demo');
      const response = NextResponse.redirect(targetUrl);
      response.cookies.set(DEMO_COOKIE_NAME, 'STUDENT', { path: '/', maxAge: 86400 });
      return response;
    }
    if (normalized === 'FACULTY_ADMIN' || normalized === 'ADMIN') {
      const targetUrl = new URL('/admin', request.url);
      targetUrl.searchParams.delete('demo');
      const response = NextResponse.redirect(targetUrl);
      response.cookies.set(DEMO_COOKIE_NAME, 'ADMIN', { path: '/', maxAge: 86400 });
      return response;
    }
  }

  const token = request.cookies.get(TOKEN_NAME)?.value;
  const user = token ? parseJwtPayload(token) : null;
  const demoRole = request.cookies.get(DEMO_COOKIE_NAME)?.value as 'STUDENT' | 'ADMIN' | undefined;

  // 1. Admin Page Routes (/admin, /admin/*)
  if (pathname.startsWith('/admin')) {
    // Real authenticated admin
    if (user && user.role === 'ADMIN') {
      return NextResponse.next();
    }

    // Real authenticated student attempting admin route
    if (user && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Demo Mode Admin
    if (!user && demoRole === 'ADMIN') {
      return NextResponse.next();
    }

    // Demo Mode Student trying to access admin
    if (!user && demoRole === 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Unauthenticated visitor without demo session
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
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

  if (isStudentProtected) {
    // Allowed if real user OR demo visitor (either student or admin demo)
    if (user || demoRole === 'STUDENT' || demoRole === 'ADMIN') {
      return NextResponse.next();
    }

    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 3. Auth pages (/login, /register) when real authenticated user
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
    '/',
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
