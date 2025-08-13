'use client';

import { useAuth } from '@/hooks/use-auth';
import AdminDashboard from '@/components/admin-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const isAuth = useAuth();

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4 bg-background">
        <Skeleton className="w-full h-16 max-w-4xl" />
        <Skeleton className="w-full h-64 max-w-4xl" />
        <Skeleton className="w-full h-64 max-w-4xl" />
      </div>
    );
  }

  return <AdminDashboard />;
}
