'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Settings } from 'lucide-react';

// Dynamic import to avoid SSR issues with 3D components
const VisualizerPlayer = dynamic(
  () => import('@/components/visualizer').then(mod => mod.VisualizerPlayer),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-80 bg-black rounded-lg flex items-center justify-center">
        <div className="text-white/60 text-center">
          <Music className="w-8 h-8 mx-auto mb-2 animate-pulse" />
          <p>Loading 3D Visualizer...</p>
        </div>
      </div>
    )
  }
);

const presets = {
  electronic: {
    name: 'Electronic',
    type: 'cubes' as const,
    gridSize: 10,
    colorScheme: {
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      accent: '#F59E0B'
    },
    effects: {
      rotation: true,
      scaling: true,
      pulsing: true,
      particles: false
    },
    sensitivity: {
      bass: 1.5,
      mid: 1.0,
      treble: 0.8
    }
  },
  
  ambient: {
    name: 'Ambient',
    type: 'spheres' as const,
    gridSize: 6,
    colorScheme: {
      primary: '#10B981',
      secondary: '#3B82F6',
      accent: '#8B5CF6'
    },
    effects: {
      rotation: true,
      scaling: false,
      pulsing: true,
      particles: true
    },
    sensitivity: {
      bass: 0.8,
      mid: 1.2,
      treble: 1.0
    }
  },
  
  heavy: {
    name: 'Heavy',
    type: 'cubes' as const,
    gridSize: 12,
    colorScheme: {
      primary: '#EF4444',
      secondary: '#F59E0B',
      accent: '#DC2626'
    },
    effects: {
      rotation: false,
      scaling: true,
      pulsing: false,
      particles: false
    },
    sensitivity: {
      bass: 2.0,
      mid: 1.0,
      treble: 0.5
    }
  },
  
  wave: {
    name: 'Wave',
    type: 'waves' as const,
    gridSize: 8,
    colorScheme: {
      primary: '#06B6D4',
      secondary: '#0EA5E9',
      accent: '#0284C7'
    },
    effects: {
      rotation: false,
      scaling: false,
      pulsing: true,
      particles: false
    },
    sensitivity: {
      bass: 1.0,
      mid: 1.5,
      treble: 1.2
    }
  }
};

interface VisualizerPreset {
  name: string;
  type: 'cubes' | 'spheres' | 'waves' | 'particles';
  gridSize: number;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  effects: {
    rotation: boolean;
    scaling: boolean;
    pulsing: boolean;
    particles: boolean;
  };
  sensitivity: {
    bass: number;
    mid: number;
    treble: number;
  };
}

export default function VisualizerDemo() {
  const [selectedPreset, setSelectedPreset] = useState<VisualizerPreset>(presets.electronic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              3D Audio Visualizer
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience your music in three dimensions with real-time audio analysis and stunning visual effects.
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Play className="w-3 h-3 mr-1" />
              Interactive
            </Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              Web Audio API
            </Badge>
            <Badge variant="secondary" className="bg-violet-500/10 text-violet-500">
              React Three Fiber
            </Badge>
          </div>
        </div>

        {/* Main Visualizer */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Live Visualizer Demo
            </CardTitle>
            <CardDescription>
              Click play to start the 3D audio visualization. Use mouse to orbit around the 3D scene.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <VisualizerPlayer 
              trackTitle="Electronic Demo Track"
              preset={selectedPreset}
            />
          </CardContent>
        </Card>

        {/* Preset Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Visualizer Presets</CardTitle>
            <CardDescription>
              Choose different visual styles optimized for various music genres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(presets).map(([key, preset]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedPreset.name === preset.name
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onClick={() => setSelectedPreset(preset)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{preset.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {preset.type}
                      </Badge>
                    </div>
                    
                    {/* Color Preview */}
                    <div className="flex gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colorScheme.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colorScheme.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colorScheme.accent }}
                      />
                    </div>
                    
                    {/* Effects */}
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(preset.effects)
                        .filter(([_, enabled]) => enabled)
                        .map(([effect]) => (
                          <Badge key={effect} variant="secondary" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                    </div>
                    
                    {/* Grid Size */}
                    <p className="text-xs text-muted-foreground">
                      Grid: {preset.gridSize}×{preset.gridSize}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Real-time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced Web Audio API integration analyzes frequency bands, bass, mid, and treble in real-time for responsive visualizations.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3D Graphics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built with React Three Fiber and Three.js for smooth 3D rendering with orbit controls and dynamic lighting effects.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customizable Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Multiple preset configurations optimized for different music genres with customizable colors, effects, and sensitivities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Info */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
            <CardDescription>
              Built with modern web technologies for optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Audio Processing</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Web Audio API for real-time analysis</li>
                  <li>• FFT size: 512 for optimal frequency resolution</li>
                  <li>• Smoothing time constant: 0.8</li>
                  <li>• Frequency band separation (bass/mid/treble)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3D Rendering</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• React Three Fiber + Three.js</li>
                  <li>• Orbit controls for interactive viewing</li>
                  <li>• Dynamic lighting and material effects</li>
                  <li>• Optimized mesh generation and animation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}