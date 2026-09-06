import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Always rewrite to the maintenance page, keeping the user's URL intact
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next();
  }
  
  return NextResponse.rewrite(new URL('/maintenance', request.url));
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico and typical image extensions
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
