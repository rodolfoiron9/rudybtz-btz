'use client';

import React, { useState } from 'react';
import { FrequencyData, BeatData } from '@/lib/audio/analyzer';
import { BarVisualizer } from './BarVisualizer';
import { CircularVisualizer } from './CircularVisualizer';
import { SpectrumAnalyzer } from './SpectrumAnalyzer';
import { WaveformVisualizer } from './WaveformVisualizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VisualizerProps {
  frequencyData: FrequencyData | null;
  beatData: BeatData | null;
  isPlaying: boolean;
  waveformData: number[];
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
  className?: string;
  sensitivity?: number;
  smoothing?: number;
}

export function Visualizer({
  frequencyData,
  beatData,
  isPlaying,
  waveformData,
  currentTime,
  duration,
  onSeek,
  className = '',
  sensitivity = 1.0,
  smoothing = 0.8
}: VisualizerProps) {
  const [visualizationType, setVisualizationType] = useState('circular');
  const [showSettings, setShowSettings] = useState(false);
  const [vizSensitivity, setVizSensitivity] = useState(sensitivity);
  const [vizSmoothing, setVizSmoothing] = useState(smoothing);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={visualizationType} onValueChange={setVisualizationType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select visualization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="circular">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  Circular
                </div>
              </SelectItem>
              <SelectItem value="bar">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                  Bar
                </div>
              </SelectItem>
              <SelectItem value="spectrum">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-cyan-500"></div>
                  Spectrum
                </div>
              </SelectItem>
              <SelectItem value="waveform">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                  Waveform
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        {visualizationType === 'circular' && (
          <div className="flex items-center gap-2 text-yellow-400">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-medium">4 Presets</span>
          </div>
        )}
      </div>

      {/* Visualization Settings */}
      {showSettings && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-white">Visualization Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">Sensitivity</label>
                  <span className="text-xs text-gray-400">{vizSensitivity.toFixed(1)}</span>
                </div>
                <Slider
                  value={[vizSensitivity]}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  onValueChange={(value) => setVizSensitivity(value[0] ?? vizSensitivity)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">Smoothing</label>
                  <span className="text-xs text-gray-400">{vizSmoothing.toFixed(1)}</span>
                </div>
                <Slider
                  value={[vizSmoothing]}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  onValueChange={(value) => setVizSmoothing(value[0] ?? vizSmoothing)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visualizations */}
      <div className="w-full">
        {visualizationType === 'circular' && (
          <div className="flex justify-center">
            <CircularVisualizer
              frequencyData={frequencyData}
              beatData={beatData}
              isPlaying={isPlaying}
              sensitivity={vizSensitivity}
              smoothing={vizSmoothing}
            />
          </div>
        )}

        {visualizationType === 'bar' && (
          <BarVisualizer
            frequencyData={frequencyData}
            beatData={beatData}
            isPlaying={isPlaying}
            sensitivity={vizSensitivity}
            smoothing={vizSmoothing}
          />
        )}

        {visualizationType === 'spectrum' && (
          <SpectrumAnalyzer
            frequencyData={frequencyData}
            isPlaying={isPlaying}
            sensitivity={vizSensitivity}
            smoothing={vizSmoothing}
          />
        )}

        {visualizationType === 'waveform' && (
          <WaveformVisualizer
            waveformData={waveformData}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            onSeek={onSeek || (() => {})}
            sensitivity={vizSensitivity}
            smoothing={vizSmoothing}
          />
        )}
      </div>
    </div>
  );
}