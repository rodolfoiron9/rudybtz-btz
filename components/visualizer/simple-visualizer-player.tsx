'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Play, Pause, VolumeX } from 'lucide-react';
import { type VisualizerPreset } from './audio-visualizer-3d';

interface SimpleVisualizerPlayerProps {
  trackTitle?: string;
  preset?: VisualizerPreset;
  className?: string;
}

export default function SimpleVisualizerPlayer({ 
  trackTitle = "Demo Track",
  preset,
  className
}: SimpleVisualizerPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`w-full h-80 bg-black rounded-lg relative overflow-hidden ${className}`}>
      {/* 3D Visualizer Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white/60">
          <Music className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-lg mb-2">3D Audio Visualizer</p>
          <p className="text-sm">Interactive 3D visualization will appear here</p>
          {preset && (
            <p className="text-xs mt-2 opacity-70">
              Preset: {preset.name} • Type: {preset.type}
            </p>
          )}
        </div>
      </div>
      
      {/* Audio Controls */}
      <div className="absolute bottom-4 left-4 right-4">
        <Card className="bg-black/80 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant={isPlaying ? "secondary" : "default"}
                  onClick={handlePlayPause}
                  className="h-8 w-8 p-0"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <span className="text-sm text-white">
                  {trackTitle}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMute}
                  className="h-8 w-8 p-0 text-white hover:text-white/80"
                >
                  <VolumeX className="h-4 w-4" />
                </Button>
                <div className="text-xs text-white/60">
                  {isPlaying ? 'Playing' : 'Paused'}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: isPlaying ? '35%' : '0%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}