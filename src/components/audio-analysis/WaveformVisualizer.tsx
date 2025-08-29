'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface WaveformVisualizerProps {
  waveformData: number[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  className?: string;
  height?: number;
  width?: number;
  backgroundColor?: string;
  waveColor?: string;
  progressColor?: string;
  sensitivity?: number;
  smoothing?: number;
}

export function WaveformVisualizer({
  waveformData,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  className = '',
  height = 120,
  width = 600,
  backgroundColor = '#1a1a1a',
  waveColor = '#4f46e5',
  progressColor = '#60a5fa',
  sensitivity = 1.0,
  smoothing = 0.8
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Draw waveform
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = canvas;
    
    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Calculate progress position
    const progressX = duration > 0 ? (currentTime / duration) * canvasWidth : 0;

    // Draw waveform
    const barWidth = canvasWidth / waveformData.length;
    const centerY = canvasHeight / 2;

    waveformData.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = Math.abs(value) * (canvasHeight * 0.8) * sensitivity;
      const y = centerY - barHeight / 2;

      // Use different colors for played vs unplayed sections
      ctx.fillStyle = x <= progressX ? progressColor : waveColor;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });

    // Draw progress line
    if (progressX > 0) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, canvasHeight);
      ctx.stroke();
    }

    // Draw beat indicators if playing
  if (isPlaying) {
    // Add subtle glow effect for the current position
    const gradient = ctx.createRadialGradient(progressX, centerY, 0, progressX, centerY, 20 * sensitivity);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(progressX - 20 * sensitivity, 0, 40 * sensitivity, canvasHeight);
  }
  }, [waveformData, currentTime, duration, isPlaying, backgroundColor, waveColor, progressColor]);

  // Handle canvas click for seeking
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek || duration <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickRatio = x / rect.width;
    const seekTime = clickRatio * duration;
    
    onSeek(Math.max(0, Math.min(duration, seekTime)));
  }, [onSeek, duration]);

  // Resize canvas to match container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    // Scale the drawing context to ensure correct drawing operations
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    // Set display size (css pixels)
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

  // Draw when data changes
  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Animation loop for smooth progress updates
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      drawWaveform();
      if (isPlaying) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animate();
    } else {
      drawWaveform();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, drawWaveform]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        'waveform-visualizer relative w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700',
        className
      )}
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
        style={{ display: 'block' }}
      />
      
      {/* Overlay with time markers */}
      <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs text-gray-400 p-2 pointer-events-none">
        <span>0:00</span>
        {duration > 0 && (
          <span>
            {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Loading overlay */}
      {!waveformData.length && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-gray-400 text-sm">No audio data</div>
        </div>
      )}
    </div>
  );
}