'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D preset manager with no SSR
const PresetManager3D = dynamic(
  () => import('./preset-manager-3d'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted">Loading 3D Preset Manager...</p>
        </div>
      </div>
    )
  }
);

const PresetManager3DWrapper: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-lg">3D Preset Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted">Initializing 3D Environment...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <PresetManager3D />;
};

export default PresetManager3DWrapper;