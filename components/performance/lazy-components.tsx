import { lazy, Suspense, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentProps {
  children?: React.ReactNode;
  fallback?: React.ComponentType;
  className?: string;
}

// Generic lazy wrapper component
export function LazyWrapper({ 
  children, 
  fallback: Fallback = DefaultFallback,
  className 
}: LazyComponentProps) {
  return (
    <Suspense fallback={<Fallback />}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
}

// Default loading fallback
function DefaultFallback() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// Specific loading fallbacks for different components
export function AudioPlayerFallback() {
  return (
    <div className="bg-gray-900 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-16 w-16 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-2 w-full" />
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

export function VisualizerFallback() {
  return (
    <div className="bg-black rounded-lg flex items-center justify-center h-64">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full animate-pulse" />
        <p className="text-gray-400">Loading 3D Visualizer...</p>
      </div>
    </div>
  );
}

export function AlbumArtFallback() {
  return (
    <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-center space-y-2">
        <Skeleton className="h-6 w-6 mx-auto rounded" />
        <p className="text-xs text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export function DashboardFallback() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Tabs */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Lazy component factory
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  FallbackComponent: ComponentType = DefaultFallback
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyComponentWrapper(props: P) {
    return (
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };
}

// Pre-built lazy components for common heavy components
export const LazyAudioPlayer = createLazyComponent(
  () => import('@/components/audio-player').then(mod => ({ default: mod.default })).catch(() => ({ default: () => <AudioPlayerFallback /> })),
  AudioPlayerFallback
);

export const LazyFloatingVisualizer = createLazyComponent(
  () => import('@/components/floating-visualizer'),
  VisualizerFallback
);

export const LazyAdminDashboard = createLazyComponent(
  () => import('@/components/admin-dashboard').catch(() => ({ default: () => <DashboardFallback /> })),
  DashboardFallback
);

// HOC for adding lazy loading to any component
export function withLazyLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  FallbackComponent: ComponentType = DefaultFallback
) {
  const LazyWrappedComponent = lazy(() => 
    Promise.resolve({ default: WrappedComponent })
  );

  return function LazyLoadedComponent(props: P) {
    return (
      <Suspense fallback={<FallbackComponent />}>
        <LazyWrappedComponent {...(props as any)} />
      </Suspense>
    );
  };
}