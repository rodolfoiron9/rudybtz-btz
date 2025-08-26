'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Play, Pause, Volume2, VolumeX, Settings, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import AudioVisualizer3D, { type VisualizerPreset } from './audio-visualizer-3d';

interface VisualizerPlayerProps {
  trackUrl?: string;
  trackTitle?: string;
  preset?: VisualizerPreset;
  className?: string;
  autoStart?: boolean;
}

export default function VisualizerPlayer({ 
  trackUrl, 
  trackTitle = "Demo Track",
  preset,
  className,
  autoStart = false 
}: VisualizerPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo track URL (you can replace with actual track)
  const demoTrackUrl = trackUrl || "/demo-track.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <div className={cn("relative", className)}>
        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={demoTrackUrl}
          preload="metadata"
          crossOrigin="anonymous"
        />

        <Card className="overflow-hidden">
          {/* Header */}
          <CardHeader className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Music className="w-5 h-5" />
                3D Audio Visualizer
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="w-8 h-8"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Visualizer */}
          <CardContent className="p-0">
            <div className="relative h-80 bg-black">
              <AudioVisualizer3D
                audioElement={audioRef.current}
                preset={preset || {
                  name: 'Default',
                  type: 'cubes',
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
                }}
                className="w-full h-full"
              />
              
              {/* Track Info Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <div className="glassmorphism bg-black/50 rounded-lg p-3">
                  <p className="text-white font-medium text-sm">{trackTitle}</p>
                  <p className="text-white/70 text-xs">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-background/50 backdrop-blur-sm">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Seek audio track"
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={togglePlay}
                    size="icon"
                    className="w-12 h-12 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="w-10 h-10"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    aria-label="Volume control"
                    className="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Close Button */}
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Fullscreen Visualizer */}
          <AudioVisualizer3D
            audioElement={audioRef.current}
            preset={preset || {
              name: 'Default',
              type: 'cubes',
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
            }}
            className="w-full h-full"
          />

          {/* Fullscreen Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="glassmorphism bg-black/50 rounded-lg p-4">
              <div className="flex items-center justify-between text-white mb-4">
                <div>
                  <h3 className="font-semibold">{trackTitle}</h3>
                  <p className="text-sm text-white/70">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button
                    onClick={togglePlay}
                    size="icon"
                    variant="ghost"
                    className="w-12 h-12 rounded-full text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Fullscreen Progress */}
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Fullscreen seek audio track"
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}