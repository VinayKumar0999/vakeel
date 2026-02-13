/**
 * VK Backend Authentication Middleware
 * Validates session tokens for protected API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from './vk-db';

export interface AuthContext {
  user_id: number;
  user_type: 'advocate' | 'client';
  session: any;
}

/**
 * Middleware to authenticate requests using Bearer token
 * Returns user context if authenticated, or error response if not
 */
export async function authenticateRequest(request: NextRequest): Promise<{ 
  authenticated: boolean; 
  context?: AuthContext; 
  error?: NextResponse;
}> {
  try {
    // Get Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return {
        authenticated: false,
        error: NextResponse.json(
          { error: 'Missing authorization header' },
          { status: 401 }
        ),
      };
    }

    // Extract token (format: "Bearer <token>")
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return {
        authenticated: false,
        error: NextResponse.json(
          { error: 'Invalid authorization header format. Expected: Bearer <token>' },
          { status: 401 }
        ),
      };
    }

    const token = parts[1];

    // Validate session token
    const session = await getSessionByToken(token);
    
    if (!session) {
      return {
        authenticated: false,
        error: NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        ),
      };
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      return {
        authenticated: false,
        error: NextResponse.json(
          { error: 'Session expired' },
          { status: 401 }
        ),
      };
    }

    // Return authenticated context
    return {
      authenticated: true,
      context: {
        user_id: session.user_id,
        user_type: session.user_type,
        session,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      authenticated: false,
      error: NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Middleware to check if user has a specific role
 */
export function requireUserType(context: AuthContext, requiredType: 'advocate' | 'client'): { 
  authorized: boolean; 
  error?: NextResponse;
} {
  if (context.user_type !== requiredType) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Access denied. Insufficient permissions.' },
        { status: 403 }
      ),
    };
  }

  return { authorized: true };
}

/**
 * Higher-order function to wrap API route handlers with authentication
 * Usage:
 * 
 * export const POST = withAuth(async (request, context) => {
 *   // context.user_id and context.user_type are available
 *   return NextResponse.json({ ... });
 * });
 */
export function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated || !auth.context) {
      return auth.error!;
    }

    return handler(request, auth.context);
  };
}

/**
 * Higher-order function to wrap API route handlers with authentication and role check
 * Usage:
 * 
 * export const POST = withAuthAndRole('advocate', async (request, context) => {
 *   // Only advocates can access this endpoint
 *   return NextResponse.json({ ... });
 * });
 */
export function withAuthAndRole(
  requiredRole: 'advocate' | 'client',
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated || !auth.context) {
      return auth.error!;
    }

    const roleCheck = requireUserType(auth.context, requiredRole);
    if (!roleCheck.authorized) {
      return roleCheck.error!;
    }

    return handler(request, auth.context);
  };
}
