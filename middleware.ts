import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // Just pass through — middleware is only for reading cookies on Vercel
  // The actual auth check happens in the API routes
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
