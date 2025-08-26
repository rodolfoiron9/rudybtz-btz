'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  fallbackPath = '/admin/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (loading) return;

      if (!user) {
        router.push(fallbackPath);
        return;
      }

      if (requireAdmin) {
        try {
          const adminStatus = await checkAdminStatus();
          setIsAdmin(adminStatus);
          
          if (!adminStatus) {
            router.push('/admin/unauthorized');
            return;
          }
        } catch (error) {
          console.error('Failed to check admin status:', error);
          router.push('/admin/unauthorized');
          return;
        }
      }

      setChecking(false);
    };

    checkAuth();
  }, [user, loading, requireAdmin, router, fallbackPath]);

  const checkAdminStatus = async (): Promise<boolean> => {
    // Check if user email matches admin emails
    const adminEmails = [
      'rudybtz@gmail.com',
      'admin@rudybtz.com',
      // Add your admin emails here
    ];

    return adminEmails.includes(user?.email || '');
  };

  // Show loading state
  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authenticating...</h3>
            <p className="text-sm text-muted-foreground text-center">
              Verifying your access permissions
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show unauthorized state for non-admin users
  if (requireAdmin && isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="w-8 h-8 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              You don't have permission to access this area. Admin privileges are required.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
              >
                Go Home
              </Button>
              <Button 
                onClick={() => router.push('/admin/login')}
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show protected content for authenticated users
  if (user && (!requireAdmin || isAdmin)) {
    return <>{children}</>;
  }

  // Fallback: redirect to login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Card className="w-96">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Shield className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Please sign in to access this area
          </p>
          <Button onClick={() => router.push(fallbackPath)}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}