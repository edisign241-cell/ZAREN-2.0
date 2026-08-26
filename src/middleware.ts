import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes publiques accessibles librement aux visiteurs sans compte
const PUBLIC_PATHS = [
  '/',
  '/map',
  '/shop',
  '/auth',
];

export function middleware(request: any) {
  const { pathname, search } = request.nextUrl || { pathname: '', search: '' };

  // 1. Ignorer les fichiers statiques, assets Next.js, API et images
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // 2. Fiches articles partagées sur les réseaux (/p/[code]) -> toujours publiques
  if (pathname.startsWith('/p/')) {
    return NextResponse.next();
  }

  // 3. Vérification de la session utilisateur via les cookies
  const hasAuthCookie =
    request.cookies.has('zaren_is_logged_in') ||
    request.cookies.has('zaren_auth_token') ||
    request.cookies.has('sb-vhelgezdnrrnlutboacv-auth-token');

  // 4. Routes protégées nécessitant une authentification explicite
  const isProtectedPath =
    pathname.startsWith('/seller') ||
    pathname.startsWith('/profile/settings') ||
    pathname.startsWith('/messages');

  if (isProtectedPath && !hasAuthCookie) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('auth', 'required');
    loginUrl.searchParams.set('redirectTo', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
