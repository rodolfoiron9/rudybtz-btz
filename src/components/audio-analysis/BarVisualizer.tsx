'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { FrequencyData, BeatData } from '@/lib/audio/analyzer';
import { cn } from '@/lib/utils';

interface BarVisualizerProps {
  frequencyData: FrequencyData | null;
  beatData: BeatData | null;
  isPlaying: boolean;
  className?: string;
  height?: number;
  barCount?: number;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  beatColor?: string;
  sensitivity?: number;
  smoothing?: number;
}

export function BarVisualizer({
  frequencyData,
  beatData,
  isPlaying,
  className = '',
  height = 150,
  barCount = 64,
  backgroundColor = '#0a0a0a',
  primaryColor = '#4f46e5',
  secondaryColor = '#06b6d4',
  beatColor = '#f59e0b',
  sensitivity = 1.0,
  smoothing = 0.8
}: BarVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const beatIntensityRef = useRef(0);
  const animationTimeRef = useRef(0);

  // Draw bar visualizer
  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = canvas;
    
    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Update animation time
    animationTimeRef.current += isPlaying ? 0.02 * sensitivity : 0.005 * sensitivity;

    // Update beat intensity with decay
    if (beatData && beatData.confidence > 0.5 * smoothing && isPlaying) {
      beatIntensityRef.current = Math.min(1, beatIntensityRef.current + 0.3 * sensitivity);
    } else {
      beatIntensityRef.current = Math.max(0, beatIntensityRef.current - 0.05 * smoothing);
    }

    if (!frequencyData || !isPlaying || !frequencyData.frequencyBinData) {
      // Draw static bars when not playing
      const barWidth = canvasWidth / barCount;
      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        ctx.fillStyle = primaryColor + '30';
        ctx.fillRect(x + 1, canvasHeight - 10, barWidth - 2, 5);
      }
      return;
    }

    const { frequencyBinData } = frequencyData;
    const dataPerBar = Math.floor(frequencyBinData.length / barCount);

    // Draw frequency bars
    for (let i = 0; i < barCount; i++) {
      // Calculate average frequency for this bar
      let sum = 0;
      const startIndex = i * dataPerBar;
      const endIndex = Math.min(startIndex + dataPerBar, frequencyBinData.length);
      
      for (let j = startIndex; j < endIndex; j++) {
        const value = frequencyBinData[j];
        if (value !== undefined) {
          sum += value;
        }
      }
      
      const average = sum / (endIndex - startIndex);
      const normalizedValue = Math.max(0, (average + 140) / 140) * sensitivity;
      
      // Add beat intensity and animation
      const beatMultiplier = 1 + beatIntensityRef.current * 0.5;
      const animationOffset = Math.sin(animationTimeRef.current + i * 0.1) * 0.1;
      const barHeight = (normalizedValue + animationOffset) * (canvasHeight * 0.8) * beatMultiplier;
      
      const x = i * (canvasWidth / barCount);
      const y = canvasHeight - barHeight;
      const barWidth = canvasWidth / barCount;

      // Color based on frequency range and beat
      let barColor;
      if (i < barCount * 0.2) {
        // Bass frequencies
        barColor = beatIntensityRef.current > 0.3 ? beatColor : primaryColor;
      } else if (i < barCount * 0.6) {
        // Mid frequencies
        barColor = secondaryColor;
      } else {
        // High frequencies
        barColor = primaryColor;
      }

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, canvasHeight, 0, y);
      gradient.addColorStop(0, barColor);
      gradient.addColorStop(1, barColor + 'AA');

      // Draw bar with glow effect
      ctx.shadowColor = barColor;
      ctx.shadowBlur = 5 * sensitivity;
      ctx.fillStyle = gradient;
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

      // Draw peak indicator
      if (beatIntensityRef.current > 0.5) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = beatColor;
        ctx.fillRect(x + 1, y - 3, barWidth - 2, 3);
      }
    }

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [frequencyData, beatData, isPlaying, backgroundColor, primaryColor, secondaryColor, beatColor, sensitivity, smoothing, barCount]);

  // Resize canvas to match container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = rect.width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    canvas.style.width = rect.width + 'px';
    canvas.style.height = height + 'px';
  }, [height]);

  // Set up resize observer
  useEffect(() => {
    const resizeObserver = new ResizeObserver(resizeCanvas);
    const container = containerRef.current;
    
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [resizeCanvas]);

  // Animation loop
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      drawVisualizer();
      if (isPlaying) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying || frequencyData) {
      animate();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, drawVisualizer, frequencyData]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        'bar-visualizer relative w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700',
        className
      )}
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Status overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-gray-400 text-sm">No audio signal</div>
        </div>
      )}
    </div>
  );
}