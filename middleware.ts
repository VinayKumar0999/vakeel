import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get token from cookies or Authorization header
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Get user from cookies (stored by Zustand persist)
  const authStorage = request.cookies.get('auth-storage')?.value
  let isAuthenticated = false
  let userRole = null

  if (authStorage) {
    try {
      // Decode URI component if encoded
      const decodedStorage = decodeURIComponent(authStorage)
      const authData = JSON.parse(decodedStorage)
      isAuthenticated = authData.state?.isAuthenticated === true
      userRole = authData.state?.user?.role
    } catch (e) {
      // Invalid auth storage - try parsing without decode
      try {
        const authData = JSON.parse(authStorage)
        isAuthenticated = authData.state?.isAuthenticated === true
        userRole = authData.state?.user?.role
      } catch (e2) {
        // Invalid auth storage
      }
    }
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!isAuthenticated && !token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Role-based access control
    if (request.nextUrl.pathname.startsWith('/dashboard/client')) {
      if (userRole && userRole !== 'CLIENT' && userRole !== 'user') {
        // Redirect to appropriate dashboard based on role
        if (userRole === 'LAWYER' || userRole === 'lawyer') {
          return NextResponse.redirect(new URL('/dashboard/lawyer', request.url))
        }
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    if (request.nextUrl.pathname.startsWith('/dashboard/lawyer')) {
      if (userRole && userRole !== 'LAWYER' && userRole !== 'lawyer') {
        // Redirect to appropriate dashboard based on role
        if (userRole === 'CLIENT' || userRole === 'user') {
          return NextResponse.redirect(new URL('/dashboard/client', request.url))
        }
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }

  // Protect lawyer routes (except verification-pending which is public after signup)
  if (request.nextUrl.pathname.startsWith('/lawyer') && 
      !request.nextUrl.pathname.startsWith('/lawyer/verification-pending')) {
    if (!isAuthenticated && !token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user is a lawyer
    if (userRole && userRole !== 'LAWYER' && userRole !== 'lawyer') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect admin routes (hidden when NEXT_PUBLIC_ENABLE_ADMIN_APPROVALS is not true)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminApprovalsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN_APPROVALS === 'true'
    if (!adminApprovalsEnabled) {
      return NextResponse.redirect(new URL('/dashboard/client', request.url))
    }
    if (!isAuthenticated && !token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (userRole !== 'ADMIN' && userRole !== 'admin' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/client', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/lawyer/:path*',
    '/admin/:path*'
  ]
}
