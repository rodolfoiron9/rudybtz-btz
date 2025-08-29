'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/admin/login');
      } else if (requireAdmin && !isAdmin) {
        // Redirect to unauthorized page if not admin
        router.push('/unauthorized');
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return React.createElement('div', {
      className: 'min-h-screen bg-background-color flex items-center justify-center'
    }, React.createElement('div', {
      className: 'text-center'
    }, React.createElement(Loader2, {
      className: 'w-8 h-8 animate-spin text-violet-400 mx-auto mb-4'
    }), React.createElement('p', {
      className: 'text-muted'
    }, 'Verifying access...')));
  }

  // Don't render children if not authenticated or not authorized
  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return React.createElement(React.Fragment, null, children);
}