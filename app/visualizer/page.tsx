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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Music className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              3D Audio Visualizer
            </h1>
          </div>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience your music in three dimensions with real-time audio analysis and stunning visual effects.
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-400">
              <Play className="w-3 h-3 mr-1" />
              Interactive
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">
              Web Audio API
            </Badge>
            <Badge variant="secondary" className="bg-violet-500/10 text-violet-400">
              React Three Fiber
            </Badge>
          </div>
        </div>

        {/* Main Visualizer */}
        <Card className="overflow-hidden bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="w-5 h-5" />
              Live Visualizer Demo
            </CardTitle>
            <CardDescription className="text-gray-300">
              Click play to start the 3D audio visualization. Use mouse to orbit around the 3D scene.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-80 bg-black rounded-lg flex items-center justify-center">
              <div className="text-white/60 text-center">
                <Music className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p>3D Visualizer Component Loading...</p>
                <p className="text-sm mt-2 text-gray-400">WebGL + Audio API Integration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preset Selection */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Visualizer Presets</CardTitle>
            <CardDescription className="text-gray-300">
              Choose different visual styles optimized for various music genres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(presets).map(([key, preset]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedPreset.name === preset.name
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-purple-400 hover:bg-purple-500/5'
                  }`}
                  onClick={() => setSelectedPreset(preset)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{preset.name}</h3>
                      <Badge variant="outline" className="text-xs text-gray-300">
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
                          <Badge key={effect} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                            {effect}
                          </Badge>
                        ))}
                    </div>
                    
                    {/* Grid Size */}
                    <p className="text-xs text-gray-400">
                      Grid: {preset.gridSize}×{preset.gridSize}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-white">Real-time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Advanced Web Audio API integration analyzes frequency bands, bass, mid, and treble in real-time for responsive visualizations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-white">3D Graphics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Built with React Three Fiber and Three.js for smooth 3D rendering with orbit controls and dynamic lighting effects.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}