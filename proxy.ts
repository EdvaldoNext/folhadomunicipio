import { type NextRequest, NextResponse } from 'next/server';
import { readSessionFromRequest } from '@/lib/auth/session';

/**
 * Protege /admin para a equipe editorial (cookie de sessão assinado).
 */
export async function proxy(request: NextRequest) {
  const session = await readSessionFromRequest(request);
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    if (isLoginPage && session) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    if (!isLoginPage && !session) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
