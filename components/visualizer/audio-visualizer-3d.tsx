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

interface VisualizerMeshProps {
  audioDataRef: React.RefObject<AudioData | null>;
  preset: VisualizerPreset;
}

function VisualizerMesh({ audioDataRef, preset }: VisualizerMeshProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Pre-allocate objects for reuse in frame loop to avoid GC
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorHelper = useMemo(() => new THREE.Color(), []);

  const { gridSize, type, colorScheme } = preset;
  const count = gridSize * gridSize;

  // Create geometry and material
  const { geometry, material } = useMemo(() => {
    let geo: THREE.BufferGeometry;
    switch (type) {
      case 'spheres':
        geo = new THREE.SphereGeometry(0.1, 16, 12);
        break;
      case 'waves':
        geo = new THREE.PlaneGeometry(0.2, 0.2, 4, 4);
        break;
      case 'particles':
        geo = new THREE.SphereGeometry(0.05, 8, 8);
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

  // Cleanup resources
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Initial instance positioning
  useEffect(() => {
    if (!meshRef.current) return;

    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;
    let i = 0;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        dummy.position.set(
          x * spacing - offset,
          0,
          z * spacing - offset
        );
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i++, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [gridSize, dummy]);

  // High-performance animation loop bypassing React reconciliation
  useFrame((state) => {
    const audioData = audioDataRef.current;
    if (!audioData || !meshRef.current) return;

    const { frequencies, average, bass, mid, treble } = audioData;
    const time = state.clock.elapsedTime;
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;

    let i = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const index = i;
        // Calculate frequency band for this instance
        const frequencyIndex = Math.floor((index / count) * frequencies.length);
        const frequency = (frequencies[frequencyIndex] as number) || 0;
        const normalizedFreq = frequency / 255;

        // Reset dummy transformations
        dummy.position.set(x * spacing - offset, 0, z * spacing - offset);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);

        // Apply scaling
        if (preset.effects.scaling) {
          const scaleY = 1 + normalizedFreq * 2;
          dummy.scale.y = scaleY;
        }

        // Apply rotation
        if (preset.effects.rotation) {
          dummy.rotation.y = time + normalizedFreq * Math.PI;
        }

        // Apply pulsing
        if (preset.effects.pulsing) {
          const pulse = Math.sin(time * 4 + index * 0.1) * 0.2 + 1;
          dummy.scale.x = pulse;
          dummy.scale.z = pulse;
        }

        // Position modulation for wave effect
        if (preset.type === 'waves') {
          dummy.position.y = Math.sin(time * 2 + index * 0.2) * normalizedFreq * 2;
        }

        dummy.updateMatrix();
        meshRef.current.setMatrixAt(index, dummy.matrix);

        // Color modulation
        const hue = (bass * preset.sensitivity.bass + 
                     mid * preset.sensitivity.mid + 
                     treble * preset.sensitivity.treble) / 765;
        
        colorHelper.setHSL(hue % 1, 0.8, 0.6);
        meshRef.current.setColorAt(index, colorHelper);

        i++;
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Imperative light updates
    if (dirLightRef.current) {
      dirLightRef.current.intensity = 0.6 + (bass / 255) * 0.4;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 1 + (average / 255);
    }

    // Group rotation
    if (groupRef.current && preset.effects.rotation) {
      groupRef.current.rotation.y = time * 0.5 + average * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={dirLightRef}
        position={[5, 5, 5]}
        color={preset.colorScheme.accent}
      />
      <pointLight
        ref={pointLightRef}
        position={[0, 3, 0]}
        color={preset.colorScheme.secondary}
        distance={20}
      />
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, count]}
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

  // Audio analysis loop - updates ref to avoid React re-renders
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const frequencies = new Uint8Array(analyser.frequencyBinCount);
    const waveform = new Uint8Array(analyser.fftSize);

    analyser.getByteFrequencyData(frequencies);
    analyser.getByteTimeDomainData(waveform);

    // Calculate audio metrics
    const average = frequencies.reduce((sum, value) => sum + value, 0) / frequencies.length;
    
    // Frequency bands
    const bassEnd = Math.floor(frequencies.length * 0.1);
    const midEnd = Math.floor(frequencies.length * 0.3);
    
    const bass = frequencies.slice(0, bassEnd).reduce((sum, value) => sum + value, 0) / bassEnd;
    const mid = frequencies.slice(bassEnd, midEnd).reduce((sum, value) => sum + value, 0) / (midEnd - bassEnd);
    const treble = frequencies.slice(midEnd).reduce((sum, value) => sum + value, 0) / (frequencies.length - midEnd);

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
    return undefined;
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
