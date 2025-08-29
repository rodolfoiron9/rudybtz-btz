'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Box, 
  Type, 
  Play, 
  Pause, 
  Settings,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PresetManagerProps {
  className?: string;
}

export default function Simple3DPresetManager({ className }: PresetManagerProps) {
  const [activeTab, setActiveTab] = useState<'cubes' | 'text'>('cubes');
  const [isLoading, setIsLoading] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    // Check for WebGL support
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setHasWebGL(!!gl);
      } catch (e) {
        setHasWebGL(false);
      }
    };

    const timer = setTimeout(() => {
      checkWebGL();
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Card className={cn('cyber-card', className)}>
        <CardHeader>
          <CardTitle className="text-xl cyber-glow flex items-center gap-2">
            <Box className="w-6 h-6" />
            3D Preset Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Initializing 3D environment...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasWebGL) {
    return (
      <Card className={cn('cyber-card', className)}>
        <CardHeader>
          <CardTitle className="text-xl cyber-glow flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            3D Preset Manager - WebGL Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">WebGL Not Available</h3>
              <p className="text-muted-foreground mb-4">
                3D visualization requires WebGL support. Please enable WebGL in your browser settings.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('cyber-card', className)}>
      <CardHeader>
        <CardTitle className="text-xl cyber-glow flex items-center gap-2">
          <Box className="w-6 h-6" />
          3D Preset Manager
          <Badge variant="outline" className="ml-auto">
            Ready for 3D
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'cubes' | 'text')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cubes" className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              Cube Presets
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Text Presets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cubes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Preset Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="cursor-pointer transition-all hover:scale-105">
                      <CardContent className="p-3">
                        <div className="h-20 bg-black rounded-lg mb-2 flex items-center justify-center">
                          <Box className="w-8 h-8 text-gray-600" />
                        </div>
                        <h4 className="font-medium text-sm">Cube Preset {i + 1}</h4>
                        <p className="text-xs text-muted-foreground">
                          3D cube visualization preset
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-black rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Box className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        3D preview will load here
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Preset Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="cursor-pointer transition-all hover:scale-105">
                      <CardContent className="p-3">
                        <div className="h-20 bg-black rounded-lg mb-2 flex items-center justify-center">
                          <Type className="w-8 h-8 text-gray-600" />
                        </div>
                        <h4 className="font-medium text-sm">Text Preset {i + 1}</h4>
                        <p className="text-xs text-muted-foreground">
                          3D text visualization preset
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-black rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Type className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        3D text preview will load here
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">Development Mode</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            3D preset functionality is available but currently using placeholder components to prevent SSR conflicts.
            The full 3D visualization system can be enabled once SSR compatibility is fully resolved.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}