'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { FrequencyData } from '@/lib/audio/analyzer';
import { cn } from '@/lib/utils';

interface SpectrumAnalyzerProps {
  frequencyData: FrequencyData | null;
  isPlaying: boolean;
  className?: string;
  height?: number;
  barCount?: number;
  backgroundColor?: string;
  barColor?: string;
  peakColor?: string;
  sensitivity?: number;
  smoothing?: number;
}

export function SpectrumAnalyzer({
  frequencyData,
  isPlaying,
  className = '',
  height = 120,
  barCount = 64,
  backgroundColor = '#1a1a1a',
  barColor = '#4f46e5',
  peakColor = '#60a5fa',
  sensitivity = 1.0,
  smoothing = 0.8
}: SpectrumAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const peakHoldsRef = useRef<number[]>(new Array(barCount).fill(0));
  const peakDecayRef = useRef<number[]>(new Array(barCount).fill(0));

  // Draw spectrum analyzer
  const drawSpectrum = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = canvas;
    
    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (!frequencyData || !isPlaying || !frequencyData.frequencyBinData) {
      // Draw empty bars when not playing
      const barWidth = canvasWidth / barCount;
      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        ctx.fillStyle = barColor + '20'; // Semi-transparent
        ctx.fillRect(x + 1, canvasHeight - 5, barWidth - 2, 3);
      }
      return;
    }

    const { frequencyBinData, frequencyFloatData } = frequencyData;
    const barWidth = canvasWidth / barCount;
    const dataPerBar = Math.floor(frequencyBinData.length / barCount);

    for (let i = 0; i < barCount; i++) {
      // Average frequency data for this bar
      let sum = 0;
      const startIndex = i * dataPerBar;
      const endIndex = Math.min(startIndex + dataPerBar, frequencyBinData.length);
      
      for (let j = startIndex; j < endIndex; j++) {
        // @ts-ignore - frequencyBinData is checked above
        sum += frequencyBinData[j];
      }
      
      const average = sum / (endIndex - startIndex);
      const normalizedValue = (average + 140) / 140; // Normalize from -140dB to 0dB
      const barHeight = Math.max(0, normalizedValue * canvasHeight * 0.9 * sensitivity);

      // Update peak holds with smoothing
      if (barHeight > (peakHoldsRef.current[i] || 0)) {
        peakHoldsRef.current[i] = barHeight;
        peakDecayRef.current[i] = 0;
      } else {
        peakDecayRef.current[i] = (peakDecayRef.current[i] || 0) + 1;
        if ((peakDecayRef.current[i] || 0) > 10 * smoothing) { // Hold peaks for 10 frames
          peakHoldsRef.current[i] = Math.max(0, (peakHoldsRef.current[i] || 0) - 2 * sensitivity);
        }
      }

      const x = i * barWidth;
      const y = canvasHeight - barHeight;

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, canvasHeight, 0, y);
      gradient.addColorStop(0, barColor);
      gradient.addColorStop(0.5, barColor + 'AA');
      gradient.addColorStop(1, peakColor);

      // Draw main bar
      ctx.fillStyle = gradient;
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

      // Draw peak hold indicator
      const peakY = canvasHeight - (peakHoldsRef.current[i] || 0);
      ctx.fillStyle = peakColor;
      ctx.fillRect(x + 1, peakY - 2, barWidth - 2, 2);

      // Add frequency labels for low frequencies
      if (i < 8 && i % 2 === 0) {
        const frequency = (i * 22050) / barCount; // Rough frequency calculation
        ctx.fillStyle = '#666';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          frequency < 1000 ? `${Math.round(frequency)}Hz` : `${(frequency / 1000).toFixed(1)}kHz`,
          x + barWidth / 2,
          canvasHeight - 2
        );
      }
    }

    // Draw frequency grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1 * sensitivity;
    ctx.setLineDash([2 * sensitivity, 2 * sensitivity]);
    
    // Horizontal lines (dB levels)
    for (let i = 1; i <= 4; i++) {
      const y = (canvasHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }, [frequencyData, isPlaying, barCount, backgroundColor, barColor, peakColor]);

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
      drawSpectrum();
      if (isPlaying) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, drawSpectrum]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        'spectrum-analyzer relative w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700',
        className
      )}
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Frequency labels */}
      <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs text-gray-500 p-1 pointer-events-none">
        <span>20Hz</span>
        <span>1kHz</span>
        <span>10kHz</span>
        <span>20kHz</span>
      </div>

      {/* dB level indicators */}
      <div className="absolute inset-y-0 right-0 flex flex-col justify-between text-xs text-gray-500 p-1 pointer-events-none">
        <span>0dB</span>
        <span>-30dB</span>
        <span>-60dB</span>
        <span>-90dB</span>
      </div>

      {/* Status indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-gray-400 text-sm">No audio signal</div>
        </div>
      )}
    </div>
  );
}