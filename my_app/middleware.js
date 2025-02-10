import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "./lib/jwt";

export async function middleware(request) {
  // Get the path from the request
  const path = request.nextUrl.pathname;
  
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify the token
    const user = await verifyToken(token);

    // If no user or invalid token, redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based access control
    if (user.role === 'admin') {
      // If non-admin tries to access admin routes
      if (path.startsWith('/adminvisitor') && user.role !== 'admin') {
        return NextResponse.redirect(new URL('/home', request.url));
      }
    } else {
      // If admin routes are accessed by non-admin
      if (path.startsWith('/adminvisitor')) {
        return NextResponse.redirect(new URL('/home', request.url));
      }
    }

    // If all checks pass, allow the request
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    // Clear the invalid token
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    '/adminvisitor/:path*',
    '/visit/:path*',
    '/apartment/:path*',
    '/visitor/:path*',
    '/welcome/:path*',
    '/home/:path*'
  ],
};
