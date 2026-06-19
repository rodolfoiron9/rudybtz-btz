'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
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
  audioDataRef: React.MutableRefObject<AudioData | null>;
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

function VisualizerMesh({ audioDataRef, preset }: VisualizerMeshProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  // Use a ref for temp objects to avoid re-creation on every render,
  // but keep them outside of useFrame to avoid per-frame allocations
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Initialize instanced mesh based on preset
  const { geometry, material, count } = useMemo(() => {
    const { gridSize, type, colorScheme } = preset;
    const count = gridSize * gridSize;

    let geometry: THREE.BufferGeometry;
    switch (type) {
      case 'spheres':
        geometry = new THREE.SphereGeometry(0.1, 8, 6);
        break;
      case 'waves':
        geometry = new THREE.PlaneGeometry(0.2, 0.2, 4, 4);
        break;
      case 'particles':
        geometry = new THREE.SphereGeometry(0.05, 4, 4);
        break;
      default:
        geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    }

    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(colorScheme.primary),
      transparent: true,
      opacity: 0.8,
    });

    return { geometry, material, count };
  }, [preset]);

  // Clean up geometry and material when preset changes
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Animate instanced mesh based on audio data
  useFrame((state) => {
    if (!instancedMeshRef.current || !audioDataRef.current) return;

    const { frequencies, bass, mid, treble, average } = audioDataRef.current;
    const { gridSize, effects, sensitivity, type } = preset;
    const time = state.clock.elapsedTime;
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;

    let idx = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const frequencyIndex = Math.floor((idx / (gridSize * gridSize)) * frequencies.length);
        const frequency = frequencies[frequencyIndex] || 0;
        const normalizedFreq = frequency / 255;

        // Reset transform
        tempObject.position.set(
          x * spacing - offset,
          0,
          z * spacing - offset
        );
        tempObject.rotation.set(0, 0, 0);
        tempObject.scale.set(1, 1, 1);

        // Apply scaling
        if (effects.scaling) {
          tempObject.scale.y = 1 + normalizedFreq * 2;
        }

        // Apply rotation
        if (effects.rotation) {
          tempObject.rotation.y = time + normalizedFreq * Math.PI;
        }

        // Apply pulsing
        if (effects.pulsing) {
          const pulse = Math.sin(time * 4 + idx * 0.1) * 0.2 + 1;
          tempObject.scale.x = pulse;
          tempObject.scale.z = pulse;
        }

        // Position modulation for wave effect
        if (type === 'waves') {
          tempObject.position.y = Math.sin(time * 2 + idx * 0.2) * normalizedFreq * 2;
        }

        tempObject.updateMatrix();
        instancedMeshRef.current.setMatrixAt(idx, tempObject.matrix);

        // Color modulation
        const hue = (bass * sensitivity.bass +
                     mid * sensitivity.mid +
                     treble * sensitivity.treble) / 765;
        
        tempColor.setHSL(hue, 0.8, 0.6);
        instancedMeshRef.current.setColorAt(idx, tempColor);

        idx++;
      }
    }

    // Need to tell Three.js to update the instance matrices and colors
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }

    // Group rotation (applied to the instanced mesh itself or a parent group)
    if (effects.rotation) {
      instancedMeshRef.current.rotation.y = time * 0.5 + average * 0.01;
    }
  });

  return (
    <group>
      <instancedMesh
        ref={instancedMeshRef}
        args={[geometry, material, count]}
      />
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light that pulses with bass */}
      <DirectionalAudioLight audioDataRef={audioDataRef} preset={preset} />
      
      {/* Point light that follows the audio */}
      <PointAudioLight audioDataRef={audioDataRef} preset={preset} />
    </group>
  );
}

interface AudioVisualizer3DProps {
  audioElement?: HTMLAudioElement | null;
  preset?: VisualizerPreset;
  className?: string;
}

/**
 * Separate component for Directional Light to update via useFrame
 */
function DirectionalAudioLight({
  audioDataRef,
  preset
}: {
  audioDataRef: React.MutableRefObject<AudioData | null>,
  preset: VisualizerPreset
}) {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (!lightRef.current || !audioDataRef.current) return;
    lightRef.current.intensity = 0.6 + (audioDataRef.current.bass / 255) * 0.4;
  });

  return (
    <directionalLight
      ref={lightRef}
      position={[5, 5, 5]}
      intensity={0.6}
      color={preset.colorScheme.accent}
    />
  );
}

/**
 * Separate component for Point Light to update via useFrame
 */
function PointAudioLight({
  audioDataRef,
  preset
}: {
  audioDataRef: React.MutableRefObject<AudioData | null>,
  preset: VisualizerPreset
}) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!lightRef.current || !audioDataRef.current) return;
    lightRef.current.intensity = 1 + (audioDataRef.current.average / 255);
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 3, 0]}
      intensity={1}
      color={preset.colorScheme.secondary}
      distance={20}
    />
  );
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
    const frequencies = new Uint8Array(analyser.frequencyBinCount);
    const waveform = new Uint8Array(analyser.fftSize);

    analyser.getByteFrequencyData(frequencies);
    analyser.getByteTimeDomainData(waveform);

    // Calculate audio metrics with manual loops for performance (avoiding allocations)
    let sum = 0;
    const freqLen = frequencies.length;
    for (let i = 0; i < freqLen; i++) {
      sum += frequencies[i] as number;
    }
    const average = sum / frequencies.length;
    
    // Frequency bands (bass: 0-85Hz, mid: 85-255Hz, treble: 255Hz+)
    const bassEnd = Math.floor(frequencies.length * 0.1);
    const midEnd = Math.floor(frequencies.length * 0.3);
    
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
    for (let i = midEnd; i < freqLen; i++) {
      trebleSum += frequencies[i] as number;
    }
    const treble = trebleSum / (frequencies.length - midEnd || 1);

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
        
        <VisualizerMesh audioDataRef={audioDataRef} preset={preset} />
        
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