import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  
  if (nextUrl.pathname.startsWith('/api/admin')) {
    if (session?.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
  }
  
  if (nextUrl.pathname.startsWith('/api/user')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/api/admin/:path*', '/api/user/:path*'],
};
