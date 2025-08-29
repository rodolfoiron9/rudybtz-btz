'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D text presets with no SSR
const TextPresetViewer = dynamic(
  () => import('./3d-text-presets').then(mod => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted">Loading 3D Text Preview...</p>
        </div>
      </div>
    )
  }
);

// Dynamically import presets data without executing the component code
const getPresets = async () => {
  if (typeof window === 'undefined') return [];
  try {
    const mod = await import('./3d-text-presets');
    return mod.textPresets || [];
  } catch (error) {
    console.warn('Failed to load text presets:', error);
    return [];
  }
};

// Safe export for presets that doesn't cause immediate import
export const textPresets: any[] = [];
export type TextPreset = any;

const TextPresetViewerWrapper: React.FC<any> = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900 rounded-lg">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted">Loading 3D Text Preview...</p>
        </div>
      </div>
    );
  }

  return <TextPresetViewer {...props} />;
};

export default TextPresetViewerWrapper;