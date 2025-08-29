'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D cube presets with no SSR
const CubePresetViewer = dynamic(
  () => import('./3d-cube-presets').then(mod => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted">Loading 3D Preview...</p>
        </div>
      </div>
    )
  }
);

// Dynamically import presets data without executing the component code
const getPresets = async () => {
  if (typeof window === 'undefined') return [];
  try {
    const mod = await import('./3d-cube-presets');
    return mod.cubePresets || [];
  } catch (error) {
    console.warn('Failed to load cube presets:', error);
    return [];
  }
};

// Safe export for presets that doesn't cause immediate import
export const cubePresets: any[] = [];
export type CubePreset = any;

const CubePresetViewerWrapper: React.FC<any> = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900 rounded-lg">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted">Loading 3D Cube Preview...</p>
        </div>
      </div>
    );
  }

  return <CubePresetViewer {...props} />;
};

export default CubePresetViewerWrapper;