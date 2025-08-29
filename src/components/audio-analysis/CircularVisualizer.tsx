'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { FrequencyData, BeatData } from '@/lib/audio/analyzer';
import { cn } from '@/lib/utils';

interface VisualizationPreset {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  beatColor: string;
  style: 'bars' | 'dots' | 'lines' | 'mixed';
}

interface CircularVisualizerProps {
  frequencyData: FrequencyData | null;
  beatData: BeatData | null;
  isPlaying: boolean;
  className?: string;
  size?: number;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  beatColor?: string;
  sensitivity?: number;
  smoothing?: number;
}

export function CircularVisualizer({
  frequencyData,
  beatData,
  isPlaying,
  className = '',
  size = 300,
  backgroundColor = '#0a0a0a',
  primaryColor = '#4f46e5',
  secondaryColor = '#06b6d4',
  beatColor = '#f59e0b',
  sensitivity = 1.0,
  smoothing = 0.8
}: CircularVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimeRef = useRef(0);
  const beatIntensityRef = useRef(0);
  const [currentPreset, setCurrentPreset] = useState(0);

  const visualizationPresets: VisualizationPreset[] = [
    {
      name: 'Neon Bars',
      primaryColor: '#4f46e5',
      secondaryColor: '#06b6d4',
      beatColor: '#f59e0b',
      style: 'bars'
    },
    {
      name: 'Cosmic Dots',
      primaryColor: '#ec4899',
      secondaryColor: '#8b5cf6',
      beatColor: '#06b6d4',
      style: 'dots'
    },
    {
      name: 'Spectrum Lines',
      primaryColor: '#10b981',
      secondaryColor: '#f59e0b',
      beatColor: '#ef4444',
      style: 'lines'
    },
    {
      name: 'Mixed Visualization',
      primaryColor: '#6366f1',
      secondaryColor: '#14b8a6',
      beatColor: '#f97316',
      style: 'mixed'
    }
  ];

  // Cycle through visualization presets
  const cyclePreset = () => {
    setCurrentPreset((prev) => (prev + 1) % visualizationPresets.length);
  };

  const currentPresetData = visualizationPresets[currentPreset];

  // Draw circular visualizer
  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update animation time
    animationTimeRef.current += isPlaying ? 0.02 * sensitivity : 0.005 * sensitivity;

    // Update beat intensity with decay
    if (beatData && beatData.confidence > 0.5 * smoothing && isPlaying) {
      beatIntensityRef.current = Math.min(1, beatIntensityRef.current + 0.3 * sensitivity);
    } else {
      beatIntensityRef.current = Math.max(0, beatIntensityRef.current - 0.05 * smoothing);
    }

    if (!frequencyData || !isPlaying) {
      // Draw static rings when not playing
      if (currentPresetData) {
        drawStaticRings(ctx, centerX, centerY, radius, currentPresetData.primaryColor);
      }
      return;
    }

    // Only draw if we have frequency data
    if (!frequencyData?.frequencyBinData) {
      return;
    }

    const { frequencyBinData } = frequencyData;
    const barCount = 128;
    const dataPerBar = Math.floor(frequencyBinData.length / barCount);

    // Draw background rings
    if (currentPresetData) {
      drawBackgroundRings(ctx, centerX, centerY, radius, currentPresetData.primaryColor, currentPresetData.secondaryColor);
    }

    // Draw frequency visualization based on preset style
    if (currentPresetData) {
      switch (currentPresetData.style) {
        case 'bars':
          drawBars(ctx, centerX, centerY, radius, frequencyData, barCount, dataPerBar, currentPresetData);
          break;
        case 'dots':
          drawDots(ctx, centerX, centerY, radius, frequencyData, barCount, dataPerBar, currentPresetData);
          break;
        case 'lines':
          drawLines(ctx, centerX, centerY, radius, frequencyData, barCount, dataPerBar, currentPresetData);
          break;
        case 'mixed':
          drawMixed(ctx, centerX, centerY, radius, frequencyData, barCount, dataPerBar, currentPresetData);
          break;
      }

      // Draw center elements
      drawCenterVisuals(ctx, centerX, centerY, radius, beatData, currentPresetData.beatColor);
    }

  }, [frequencyData, beatData, isPlaying, backgroundColor, sensitivity, smoothing, currentPresetData]);

  // Helper function to draw static rings
  const drawStaticRings = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, color: string) => {
    for (let i = 1; i <= 3; i++) {
      const ringRadius = (radius * i) / 4;
      ctx.strokeStyle = color + '30';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  // Helper function to draw background rings
  const drawBackgroundRings = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, primary: string, secondary: string) => {
    // Outer ring
    ctx.strokeStyle = primary + '20';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring (animated)
    const animatedRadius = radius * 0.4 + Math.sin(animationTimeRef.current) * 5;
    ctx.strokeStyle = secondary + '40';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, animatedRadius, 0, Math.PI * 2);
    ctx.stroke();
  };

  // Draw frequency bars visualization
  const drawBars = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    frequencyData: FrequencyData,
    barCount: number,
    dataPerBar: number,
    preset: VisualizationPreset
  ) => {
    const { frequencyBinData } = frequencyData;
    
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
      
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
      const barLength = (normalizedValue + animationOffset) * (radius * 0.4) * beatMultiplier;
      
      // Calculate positions
      const innerRadius = radius * 0.4;
      const outerRadius = innerRadius + barLength;
      
      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * outerRadius;
      const y2 = centerY + Math.sin(angle) * outerRadius;

      // Color based on frequency range and beat
      let barColor;
      if (i < barCount * 0.2) {
        // Bass frequencies
        barColor = beatIntensityRef.current > 0.3 ? preset.beatColor : preset.primaryColor;
      } else if (i < barCount * 0.6) {
        // Mid frequencies
        barColor = preset.secondaryColor;
      } else {
        // High frequencies
        barColor = preset.primaryColor;
      }

      // Draw bar with glow effect
      drawGlowingLine(ctx, x1, y1, x2, y2, barColor, normalizedValue + beatIntensityRef.current);
    }
  };

  // Draw frequency dots visualization
  const drawDots = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    frequencyData: FrequencyData,
    dotCount: number,
    dataPerDot: number,
    preset: VisualizationPreset
  ) => {
    const { frequencyBinData } = frequencyData;
    
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2 - Math.PI / 2;
      
      // Calculate average frequency for this dot
      let sum = 0;
      const startIndex = i * dataPerDot;
      const endIndex = Math.min(startIndex + dataPerDot, frequencyBinData.length);
      
      for (let j = startIndex; j < endIndex; j++) {
        const value = frequencyBinData[j];
        if (value !== undefined) {
          sum += value;
        }
      }
      
      const average = sum / (endIndex - startIndex);
      const normalizedValue = Math.max(0, (average + 140) / 140) * sensitivity;
      
      // Add beat intensity and animation
      const beatMultiplier = 1 + beatIntensityRef.current * 0.3;
      const animationOffset = Math.sin(animationTimeRef.current + i * 0.2) * 0.2;
      const dotRadius = (normalizedValue + animationOffset) * 10 * beatMultiplier;
      
      // Calculate position
      const distance = radius * 0.5 + normalizedValue * radius * 0.3;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      // Color based on frequency range and beat
      let dotColor;
      if (i < dotCount * 0.2) {
        // Bass frequencies
        dotColor = beatIntensityRef.current > 0.3 ? preset.beatColor : preset.primaryColor;
      } else if (i < dotCount * 0.6) {
        // Mid frequencies
        dotColor = preset.secondaryColor;
      } else {
        // High frequencies
        dotColor = preset.primaryColor;
      }

      // Draw dot with glow effect
      drawGlowingDot(ctx, x, y, dotRadius, dotColor, normalizedValue + beatIntensityRef.current);
    }
  };

  // Draw frequency lines visualization
  const drawLines = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    frequencyData: FrequencyData,
    lineCount: number,
    dataPerLine: number,
    preset: VisualizationPreset
  ) => {
    const { frequencyBinData } = frequencyData;
    
    // Draw connecting lines
    ctx.beginPath();
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2 - Math.PI / 2;
      
      // Calculate average frequency for this line
      let sum = 0;
      const startIndex = i * dataPerLine;
      const endIndex = Math.min(startIndex + dataPerLine, frequencyBinData.length);
      
      for (let j = startIndex; j < endIndex; j++) {
        const value = frequencyBinData[j];
        if (value !== undefined) {
          sum += value;
        }
      }
      
      const average = sum / (endIndex - startIndex);
      const normalizedValue = Math.max(0, (average + 140) / 140) * sensitivity;
      
      // Add beat intensity and animation
      const beatMultiplier = 1 + beatIntensityRef.current * 0.2;
      const animationOffset = Math.sin(animationTimeRef.current + i * 0.15) * 0.15;
      const distance = radius * 0.3 + (normalizedValue + animationOffset) * radius * 0.5 * beatMultiplier;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    // Create gradient for line
    const gradient = ctx.createLinearGradient(
      centerX - radius, 
      centerY - radius, 
      centerX + radius, 
      centerY + radius
    );
    gradient.addColorStop(0, preset.primaryColor);
    gradient.addColorStop(0.5, preset.secondaryColor);
    gradient.addColorStop(1, preset.beatColor);

    // Draw line with glow effect
    ctx.shadowColor = preset.primaryColor;  // Use a string color for shadow
    ctx.shadowBlur = 10;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3 + (beatIntensityRef.current || 0) * 5;
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;
  };

  // Draw mixed visualization
  const drawMixed = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    frequencyData: FrequencyData,
    elementCount: number,
    dataPerElement: number,
    preset: VisualizationPreset
  ) => {
    // Draw bars for lower frequencies
    const barCount = Math.floor(elementCount * 0.6);
    const dataPerBar = Math.floor(frequencyData.frequencyBinData.length * 0.6 / barCount);
    const barData = {
      frequencyBinData: frequencyData.frequencyBinData.slice(0, Math.floor(frequencyData.frequencyBinData.length * 0.6))
    } as FrequencyData;
    
    drawBars(ctx, centerX, centerY, radius * 0.9, barData, barCount, dataPerBar, preset);
    
    // Draw dots for higher frequencies
    const dotCount = elementCount - barCount;
    const dataPerDot = Math.floor((frequencyData.frequencyBinData.length - barData.frequencyBinData.length) / dotCount);
    const dotData = {
      frequencyBinData: frequencyData.frequencyBinData.slice(barData.frequencyBinData.length)
    } as FrequencyData;
    
    drawDots(ctx, centerX, centerY, radius * 0.9, dotData, dotCount, dataPerDot, preset);
  };

  // Helper function to draw glowing lines
  const drawGlowingLine = (
    ctx: CanvasRenderingContext2D, 
    x1: number, y1: number, x2: number, y2: number, 
    color: string, intensity: number
  ) => {
    const lineWidth = Math.max(1, intensity * 4 * sensitivity);
    
    // Draw glow
    ctx.shadowColor = color;
    ctx.shadowBlur = lineWidth * 2;
    ctx.strokeStyle = color + 'AA';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw core line
    ctx.shadowBlur = 0;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, lineWidth * 0.5);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // Helper function to draw glowing dots
  const drawGlowingDot = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    radius: number,
    color: string,
    intensity: number
  ) => {
    const dotRadius = Math.max(1, radius * sensitivity);
    
    // Draw glow
    ctx.shadowColor = color;
    ctx.shadowBlur = dotRadius * 2;
    ctx.fillStyle = color + 'AA';
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw core dot
    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, dotRadius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  };

  // Helper function to draw center visuals
  const drawCenterVisuals = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, centerY: number, 
    radius: number, 
    beatData: BeatData | null,
    beatColor: string
  ) => {
    // Center pulse based on beat
    const pulseRadius = 20 + beatIntensityRef.current * 15 * sensitivity;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
    gradient.addColorStop(0, beatColor + 'AA');
    gradient.addColorStop(1, beatColor + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    // BPM display
    if (beatData && beatData.bpm > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(beatData.bpm)}`, centerX, centerY - 5);
      
      ctx.font = '10px monospace';
      ctx.fillText('BPM', centerX, centerY + 10);
      
      // Draw preset name
      if (currentPresetData) {
        ctx.font = '10px monospace';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText(currentPresetData.name, centerX, centerY + 30);
      }
    }

    // Rotating elements
    const rotationSpeed = isPlaying ? 0.01 * sensitivity : 0.002 * sensitivity;
    const rotationAngle = animationTimeRef.current * rotationSpeed;
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + rotationAngle;
      const x = centerX + Math.cos(angle) * (radius * 0.25);
      const y = centerY + Math.sin(angle) * (radius * 0.25);
      
      if (currentPresetData) {
        ctx.fillStyle = currentPresetData.secondaryColor + '60';
      }
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Resize canvas to match container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = size * devicePixelRatio;
    canvas.height = size * devicePixelRatio;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
  }, [size]);

  // Set up resize observer
  useEffect(() => {
    resizeCanvas();
  }, [resizeCanvas]);

  // Animation loop
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      drawVisualizer();
      animationFrame = requestAnimationFrame(animate);
    };

    if (isPlaying || frequencyData) {
      animate();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [drawVisualizer, isPlaying, frequencyData]);

  // Handle click to cycle presets
  const handleClick = () => {
    cyclePreset();
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        'circular-visualizer relative bg-gray-900 rounded-full overflow-hidden border border-gray-700 shadow-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105',
        className
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
      onClick={handleClick}
      title="Click to cycle visualization presets"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Status overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-full">
          <div className="text-gray-400 text-sm text-center">
            <div>Audio</div>
            <div>Visualizer</div>
            <div className="text-xs mt-2 text-gray-500">Click to cycle presets</div>
          </div>
        </div>
      )}
      
      {/* Preset indicator */}
      {isPlaying && currentPresetData && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentPresetData.name}
        </div>
      )}
    </div>
  );
}