'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface Dynamic3DComponentProps {
  preset?: any;
  audioData?: any;
  customText?: string;
  className?: string;
}

const Dynamic3DComponent: React.FC<Dynamic3DComponentProps> = ({ 
  preset, 
  audioData, 
  customText, 
  className 
}) => {
  const [CubeComponent, setCubeComponent] = useState<any>(null);
  const [TextComponent, setTextComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadComponents = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const [cubeModule, textModule] = await Promise.all([
          import('./3d-cube-presets').catch(() => null),
          import('./3d-text-presets').catch(() => null)
        ]);
        
        if (cubeModule) setCubeComponent(() => cubeModule.default);
        if (textModule) setTextComponent(() => textModule.default);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load 3D components:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadComponents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-muted-foreground">3D preview unavailable</p>
      </div>
    );
  }

  // Determine which component to use based on preset type
  const isTextPreset = preset?.type === 'text' || customText !== undefined;
  const Component = isTextPreset ? TextComponent : CubeComponent;

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-muted-foreground">Component not loaded</p>
      </div>
    );
  }

  const props = {
    preset,
    audioData,
    className,
    ...(isTextPreset && { customText })
  };

  return <Component {...props} />;
};

export default Dynamic3DComponent;