import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (!token && (pathname === '/' || pathname === '/generate')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && (pathname === '/login' || pathname === '/register' || pathname=='/')) {
    return NextResponse.redirect(new URL('/generate', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/generate', '/login', '/register'],
};
