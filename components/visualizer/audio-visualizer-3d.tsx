'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface AudioData {
  frequencies: Uint8Array;
  waveform: Uint8Array;
  average: number;
  bass: number;
  mid: number;
  treble: number;
}

interface VisualizerMeshProps {
  audioData: AudioData | null;
  preset: VisualizerPreset;
}

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

function VisualizerMesh({ audioData, preset }: { audioData: React.MutableRefObject<AudioData | null>, preset: VisualizerPreset }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const { gridSize, type, colorScheme } = preset;
  const count = gridSize * gridSize;

  // Reusable objects for calculations (avoids per-frame garbage collection)
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  // UseMemo to create geometry and material once per preset change
  const { geometry, material } = useMemo(() => {
    let geo: THREE.BufferGeometry;
    switch (type) {
      case 'spheres':
        geo = new THREE.SphereGeometry(0.1, 8, 6);
        break;
      case 'waves':
        geo = new THREE.PlaneGeometry(0.2, 0.2, 4, 4);
        break;
      case 'particles':
        geo = new THREE.SphereGeometry(0.05, 4, 4);
        break;
      default:
        geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    }

    const mat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(colorScheme.primary),
      transparent: true,
      opacity: 0.8,
    });

    return { geometry: geo, material: mat };
  }, [type, colorScheme.primary]);

  // Cleanup geometry and material
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Animate meshes based on audio data
  useFrame((state) => {
    const data = audioData.current;
    if (!data || !meshRef.current) return;

    const { frequencies, average, bass, mid, treble } = data;
    const time = state.clock.elapsedTime;
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;

    let index = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const id = index++;

        // Calculate frequency band for this instance
        const frequencyIndex = Math.floor((id / count) * frequencies.length);
        const frequency = frequencies[frequencyIndex] || 0;
        const normalizedFreq = frequency / 255;

        dummy.position.set(
          x * spacing - offset,
          preset.type === 'waves' ? Math.sin(time * 2 + id * 0.2) * normalizedFreq * 2 : 0,
          z * spacing - offset
        );

        // Apply scaling
        let scaleX = 1;
        let scaleY = 1;
        let scaleZ = 1;

        if (preset.effects.scaling) {
          scaleY = 1 + normalizedFreq * 2;
        }

        if (preset.effects.pulsing) {
          const pulse = Math.sin(time * 4 + id * 0.1) * 0.2 + 1;
          scaleX = pulse;
          scaleZ = pulse;
        }

        dummy.scale.set(scaleX, scaleY, scaleZ);

        // Apply rotation
        if (preset.effects.rotation) {
          dummy.rotation.y = time + normalizedFreq * Math.PI;
        } else {
          dummy.rotation.y = 0;
        }

        dummy.updateMatrix();
        meshRef.current.setMatrixAt(id, dummy.matrix);

        // Color modulation
        const hue = (bass * preset.sensitivity.bass + 
                     mid * preset.sensitivity.mid + 
                     treble * preset.sensitivity.treble) / 765;
        
        color.setHSL(hue, 0.8, 0.6);
        meshRef.current.setColorAt(id, color);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Group rotation based on overall audio level
    if (preset.effects.rotation) {
      meshRef.current.rotation.y = time * 0.5 + average * 0.01;
    }

    // Update lights imperatively since component doesn't re-render
    if (dirLightRef.current) {
      dirLightRef.current.intensity = 0.6 + (bass / 255) * 0.4;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 1 + (average / 255);
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light that pulses with bass */}
      <directionalLight
        ref={dirLightRef}
        position={[5, 5, 5]}
        intensity={0.6}
        color={preset.colorScheme.accent}
      />
      
      {/* Point light that follows the audio */}
      <pointLight
        ref={pointLightRef}
        position={[0, 3, 0]}
        intensity={1}
        color={preset.colorScheme.secondary}
        distance={20}
      />
    </group>
  );
}

interface AudioVisualizer3DProps {
  audioElement?: HTMLAudioElement | null;
  preset?: VisualizerPreset;
  className?: string;
}

export default function AudioVisualizer3D({ 
  audioElement, 
  preset = defaultPreset,
  className = "w-full h-full"
}: AudioVisualizer3DProps) {
  const audioDataRef = useRef<AudioData | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Pre-allocate buffers to avoid garbage collection
  const freqBufferRef = useRef<Uint8Array | null>(null);
  const timeBufferRef = useRef<Uint8Array | null>(null);

  // Initialize Web Audio API
  const initializeAudio = useCallback(async () => {
    if (!audioElement || audioContextRef.current) return;

    try {
      // Create AudioContext
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Create source and connect
      const source = audioContext.createMediaElementSource(audioElement);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      console.log('Audio visualizer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }, [audioElement]);

  // Audio analysis loop
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;

    // Initialize buffers if not already done
    if (!freqBufferRef.current) {
      freqBufferRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
    if (!timeBufferRef.current) {
      timeBufferRef.current = new Uint8Array(analyser.fftSize);
    }

    const frequencies = freqBufferRef.current;
    const waveform = timeBufferRef.current;

    analyser.getByteFrequencyData(frequencies as any);
    analyser.getByteTimeDomainData(waveform as any);

    // Manual loops for better performance (avoids .slice and .reduce allocations)
    let totalSum = 0;
    const len = frequencies.length;
    for (let i = 0; i < len; i++) {
      totalSum += frequencies[i] as number;
    }
    const average = totalSum / len;
    
    // Frequency bands (bass: 0-10%, mid: 10-30%, treble: 30%+)
    const bassEnd = Math.floor(len * 0.1);
    const midEnd = Math.floor(len * 0.3);
    
    let bassSum = 0;
    for (let i = 0; i < bassEnd; i++) {
      bassSum += frequencies[i] as number;
    }
    const bass = bassSum / (bassEnd || 1);

    let midSum = 0;
    for (let i = bassEnd; i < midEnd; i++) {
      midSum += frequencies[i] as number;
    }
    const mid = midSum / (midEnd - bassEnd || 1);

    let trebleSum = 0;
    for (let i = midEnd; i < len; i++) {
      trebleSum += frequencies[i] as number;
    }
    const treble = trebleSum / (len - midEnd || 1);

    // Update ref instead of state to bypass React re-renders
    audioDataRef.current = {
      frequencies,
      waveform,
      average,
      bass,
      mid,
      treble
    };

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  // Start audio analysis when audio element is available
  useEffect(() => {
    if (audioElement && !audioContextRef.current) {
      initializeAudio();
    }

    if (audioElement && audioContextRef.current) {
      const handlePlay = () => {
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }
        analyzeAudio();
      };

      const handlePause = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);

      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    return () => {
      // Cleanup function for when dependencies change
    };
  }, [audioElement, initializeAudio, analyzeAudio]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={className}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={3}
          maxPolarAngle={Math.PI / 2}
        />
        
        <VisualizerMesh audioData={audioDataRef} preset={preset} />
        
        {/* Background */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial 
            color={preset.colorScheme.primary} 
            transparent 
            opacity={0.1} 
          />
        </mesh>
      </Canvas>
    </div>
  );
}

// Default visualizer preset
const defaultPreset: VisualizerPreset = {
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
};

export { type VisualizerPreset };