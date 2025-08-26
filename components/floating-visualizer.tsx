'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Music, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamically import the visualizer to avoid SSR issues
const AudioVisualizer3D = dynamic(
  () => import('./visualizer').then(mod => mod.AudioVisualizer3D),
  { ssr: false }
);

const presets = {
  electronic: {
    name: 'Electronic',
    type: 'cubes' as const,
    gridSize: 8,
    colorScheme: {
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      accent: '#F59E0B'
    },
    effects: {
      rotation: true,
      scaling: true,
      pulsing: false,
      particles: false
    },
    sensitivity: {
      bass: 1.0,
      mid: 0.8,
      treble: 0.6
    }
  }
};

export default function FloatingVisualizer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo track URL - replace with actual track
  const demoTrackUrl = "/demo-track.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      // Fallback to mock visualization
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={demoTrackUrl}
        preload="metadata"
        crossOrigin="anonymous"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Toggle Button */}
      <Button
        onClick={toggleVisibility}
        size="icon"
        className="fixed bottom-6 right-6 z-50 glassmorphism bg-primary/20 hover:bg-primary/30 border border-primary/30"
        aria-label="Toggle audio visualizer"
      >
        <Music className="w-5 h-5" />
      </Button>

      {/* Floating Visualizer */}
      {isVisible && (
        <div className={cn(
          "fixed z-40 glassmorphism bg-background/80 border border-border/50 rounded-xl transition-all duration-300",
          isExpanded 
            ? "bottom-6 right-6 w-96 h-80" 
            : "bottom-20 right-6 w-80 h-48"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/20">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">3D Audio Visualizer</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={toggleExpanded}
                aria-label={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => setIsVisible(false)}
                aria-label="Close visualizer"
              >
                ×
              </Button>
            </div>
          </div>

          {/* 3D Visualizer Content */}
          <div className="relative flex-1 bg-black rounded-b-xl overflow-hidden">
            {isPlaying ? (
              <AudioVisualizer3D
                audioElement={audioRef.current}
                preset={presets.electronic}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Click play to start visualization</p>
                </div>
              </div>
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={togglePlay}
                size="icon"
                className="w-16 h-16 rounded-full bg-primary/80 hover:bg-primary backdrop-blur-sm"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? (
                  <div className="w-6 h-6 flex gap-1">
                    <div className="w-2 h-6 bg-white rounded"></div>
                    <div className="w-2 h-6 bg-white rounded"></div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                )}
              </Button>
            </div>

            {/* Track Info (only in expanded mode) */}
            {isExpanded && (
              <div className="absolute top-4 left-4 z-10">
                <div className="glassmorphism bg-black/50 rounded-lg p-2">
                  <p className="text-white font-medium text-xs">Demo Track</p>
                  <p className="text-white/70 text-xs">RUDYBTZ</p>
                </div>
              </div>
            )}

            {/* Volume Control (only in expanded mode) */}
            {isExpanded && (
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="glassmorphism bg-black/50 rounded-lg p-3">
                  <label className="text-xs text-white/60 block mb-2">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    aria-label="Volume control"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}