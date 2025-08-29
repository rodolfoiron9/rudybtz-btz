'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AudioAnalysisEngine, AudioMetadata, FrequencyData, BeatData } from '@/lib/audio/analyzer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Volume2, Upload, Mic, Settings, Zap } from 'lucide-react';
import { Visualizer } from './Visualizer';

interface AudioPlayerProps {
  className?: string;
  autoPlay?: boolean;
  showVisualizers?: boolean;
  showControls?: boolean;
  sensitivity?: number;
  smoothing?: number;
}

export function AudioPlayer({ 
  className = '', 
  autoPlay = false,
  showVisualizers = true,
  showControls = true,
  sensitivity = 1.0,
  smoothing = 0.8
}: AudioPlayerProps) {
  // Core state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Analysis state
  const [frequencyData, setFrequencyData] = useState<FrequencyData | null>(null);
  const [beatData, setBeatData] = useState<BeatData | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // Visualization settings
  const [showSettings, setShowSettings] = useState(false);
  const [vizSensitivity, setVizSensitivity] = useState(sensitivity);
  const [vizSmoothing, setVizSmoothing] = useState(smoothing);

  // Refs
  const engineRef = useRef<AudioAnalysisEngine | null>(null);
  const animationRef = useRef<number>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize audio engine
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        engineRef.current = new AudioAnalysisEngine({
          fftSize: 2048,
          smoothingTimeConstant: 0.8,
          minDecibels: -90,
          maxDecibels: -10
        });
        await engineRef.current.initialize();
      } catch (err) {
        setError('Failed to initialize audio engine');
        console.error('Audio engine initialization error:', err);
      }
    };

    initializeEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Animation loop for real-time analysis
  const updateAnalysis = useCallback(() => {
    if (engineRef.current && isPlaying) {
      // Update current time
      setCurrentTime(engineRef.current.getCurrentTime());

      // Get frequency data
      const freqData = engineRef.current.getFrequencyData();
      setFrequencyData(freqData);

      // Get beat data
      const beats = engineRef.current.detectBeats();
      setBeatData(beats);
    }

    animationRef.current = requestAnimationFrame(updateAnalysis);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      updateAnalysis();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updateAnalysis]);

  // Load audio file
  const loadAudioFile = async (file: File) => {
    if (!engineRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const audioMetadata = await engineRef.current.loadAudioFile(file);
      setMetadata(audioMetadata);
      setDuration(audioMetadata.duration);
      setCurrentTime(0);

      // Generate full waveform
      const waveform = engineRef.current.generateFullWaveform(1000);
      setWaveformData(waveform);

      if (autoPlay) {
        await handlePlay();
      }
    } catch (err) {
      setError('Failed to load audio file');
      console.error('Audio loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load audio from URL
  const loadAudioURL = async (url: string) => {
    if (!engineRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const audioMetadata = await engineRef.current.loadAudioURL(url);
      setMetadata(audioMetadata);
      setDuration(audioMetadata.duration);
      setCurrentTime(0);

      // Generate full waveform
      const waveform = engineRef.current.generateFullWaveform(1000);
      setWaveformData(waveform);

      if (autoPlay) {
        await handlePlay();
      }
    } catch (err) {
      setError('Failed to load audio URL');
      console.error('Audio URL loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Playback controls
  const handlePlay = async () => {
    if (!engineRef.current) return;

    try {
      await engineRef.current.play(currentTime);
      setIsPlaying(true);
    } catch (err) {
      setError('Playback failed');
      console.error('Playback error:', err);
    }
  };

  const handlePause = () => {
    if (!engineRef.current) return;
    engineRef.current.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!engineRef.current) return;
    engineRef.current.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = async (time: number[]) => {
    if (!engineRef.current) return;
    const seekTime = time[0];
    if (seekTime !== undefined) {
      await engineRef.current.seekTo(seekTime);
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (vol: number[]) => {
    const newVolume = vol[0];
    if (newVolume !== undefined) {
      setVolume(newVolume);
      if (engineRef.current) {
        engineRef.current.setVolume(newVolume);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadAudioFile(file);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`audio-player ${className}`}>
      <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Audio Analysis Player
            </span>
            {beatData?.bpm && beatData.bpm > 0 && (
              <span className="text-sm font-normal text-blue-400">
                {beatData.bpm} BPM
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload audio file"
              title="Select an audio file to upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Upload className="w-4 h-4" />
              {isLoading ? 'Loading...' : 'Upload Audio'}
            </Button>
            
            {metadata && (
              <div className="text-sm text-gray-300">
                <span className="font-medium">{metadata.title}</span>
                {metadata.artist && <span> - {metadata.artist}</span>}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Visualizers */}
          {showVisualizers && metadata && (
            <Visualizer
              frequencyData={frequencyData}
              beatData={beatData}
              waveformData={waveformData}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              onSeek={(time: number) => handleSeek([time])}
            />
          )}

          {/* Controls */}
          {showControls && metadata && (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={isPlaying ? handlePause : handlePlay}
                  size="lg"
                  className="w-12 h-12 rounded-full"
                  disabled={!metadata}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>

                <Button
                  onClick={handleStop}
                  variant="outline"
                  size="sm"
                  disabled={!metadata}
                >
                  <Square className="w-4 h-4" />
                </Button>

                {/* Volume Control */}
                <div className="flex items-center gap-2 ml-4">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                  <span className="text-xs text-gray-400 w-8">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>

              {/* Audio Info */}
              {metadata && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Duration</div>
                    <div className="text-sm font-medium text-white">
                      {formatTime(duration)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Sample Rate</div>
                    <div className="text-sm font-medium text-white">
                      {(metadata.sampleRate / 1000).toFixed(1)} kHz
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Channels</div>
                    <div className="text-sm font-medium text-white">
                      {metadata.channels === 1 ? 'Mono' : 'Stereo'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Format</div>
                    <div className="text-sm font-medium text-white">
                      {metadata.format.split('/')[1]?.toUpperCase() || 'Unknown'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
