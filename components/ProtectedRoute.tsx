"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'CLIENT' | 'LAWYER' | 'ADMIN' | 'user' | 'lawyer' | 'admin'>;
  requireVerification?: boolean; // For lawyers - require APPROVED status
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireVerification = false,
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated
      if (!isAuthenticated || !user) {
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      // Check role-based access
      if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user.role?.toUpperCase();
        const isAllowed = allowedRoles.some(
          (role) => role.toUpperCase() === userRole
        );

        if (!isAllowed) {
          // Redirect to appropriate dashboard based on role
          if (user.role === 'LAWYER' || user.role === 'lawyer') {
            router.push(redirectTo || '/dashboard/lawyer');
          } else if (user.role === 'CLIENT' || user.role === 'user') {
            router.push(redirectTo || '/dashboard/client');
          } else {
            router.push(redirectTo || '/login');
          }
          return;
        }
      }

      // Check verification status for lawyers
      if (requireVerification) {
        if (user.verificationStatus && user.verificationStatus !== 'APPROVED') {
          router.push('/lawyer/verification-pending');
          return;
        }
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, requireVerification, redirectTo, router]);

  // Show loading state while checking auth
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check role access
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toUpperCase();
    const isAllowed = allowedRoles.some(
      (role) => role.toUpperCase() === userRole
    );

    if (!isAllowed) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600">Access denied. Redirecting...</p>
          </div>
        </div>
      );
    }
  }

  // Check verification
  if (requireVerification && user.verificationStatus !== 'APPROVED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Verification required. Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
