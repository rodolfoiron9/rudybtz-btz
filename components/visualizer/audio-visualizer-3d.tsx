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
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Pre-allocate helper objects to avoid garbage collection in the frame loop
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  // Initialize instanced mesh based on preset
  useEffect(() => {
    if (!groupRef.current?.add) return;

    const { gridSize, type } = preset;
    const count = gridSize * gridSize;

    // Create geometry based on type
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

    // Create material
    const material = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.8,
    });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    (meshRef as any).current = instancedMesh;
    groupRef.current.add(instancedMesh);

    // Initial positions
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;
    let i = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        dummy.position.set(x * spacing - offset, 0, z * spacing - offset);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i++, dummy.matrix);
      }
    }
    instancedMesh.instanceMatrix.needsUpdate = true;

    return () => {
      geometry.dispose();
      material.dispose();
      if (groupRef.current) groupRef.current.remove(instancedMesh);
    };
  }, [preset, dummy]);

  // Animate meshes based on audio data
  useFrame((state) => {
    const audioData = audioDataRef.current;
    if (!audioData || !meshRef.current || !groupRef.current) return;

    const { frequencies, average, bass, mid, treble } = audioData;
    const time = state.clock.elapsedTime;
    const { gridSize, effects, sensitivity, type } = preset;
    const count = gridSize * gridSize;

    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;

    for (let i = 0; i < count; i++) {
      // Calculate frequency band for this instance
      const frequencyIndex = Math.floor((i / count) * frequencies.length);
      const frequency = frequencies[frequencyIndex] || 0;
      const normalizedFreq = frequency / 255;

      const x = Math.floor(i / gridSize);
      const z = i % gridSize;

      dummy.position.set(x * spacing - offset, 0, z * spacing - offset);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);

      // Apply scaling based on frequency and preset sensitivity
      if (effects.scaling) {
        const scale = 1 + normalizedFreq * 2;
        dummy.scale.y = scale;
      }

      // Apply rotation based on audio
      if (effects.rotation) {
        dummy.rotation.y = time + normalizedFreq * Math.PI;
      }

      // Apply pulsing effect
      if (effects.pulsing) {
        const pulse = Math.sin(time * 4 + i * 0.1) * 0.2 + 1;
        dummy.scale.x = pulse;
        dummy.scale.z = pulse;
      }

      // Position modulation for wave effect
      if (type === 'waves') {
        dummy.position.y = Math.sin(time * 2 + i * 0.2) * normalizedFreq * 2;
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color modulation based on frequency bands
      const hue = (bass * sensitivity.bass +
                   mid * sensitivity.mid +
                   treble * sensitivity.treble) / 765;

      color.setHSL(hue, 0.8, 0.6);
      meshRef.current.setColorAt(i, color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Group rotation based on overall audio level
    if (effects.rotation) {
      groupRef.current.rotation.y = time * 0.5 + average * 0.01;
    }

    // Update lights
    if (dirLightRef.current) {
      dirLightRef.current.intensity = 0.6 + (bass / 255) * 0.4;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 1 + (average / 255);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={dirLightRef}
        position={[5, 5, 5]}
        intensity={0.6}
        color={preset.colorScheme.accent}
      />
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

  // Reuse buffers to avoid per-frame allocations
  const freqBufferRef = useRef<Uint8Array | null>(null);
  const timeBufferRef = useRef<Uint8Array | null>(null);

  // Initialize Web Audio API
  const initializeAudio = useCallback(async () => {
    if (!audioElement || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      freqBufferRef.current = new Uint8Array(analyser.frequencyBinCount);
      timeBufferRef.current = new Uint8Array(analyser.fftSize);

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
    if (!analyserRef.current || !freqBufferRef.current || !timeBufferRef.current) return;

    const analyser = analyserRef.current;
    const frequencies = freqBufferRef.current;
    const waveform = timeBufferRef.current;

    analyser.getByteFrequencyData(frequencies as any);
    analyser.getByteTimeDomainData(waveform as any);

    // Calculate audio metrics with manual loops for better performance
    let sum = 0;
    for (let i = 0; i < frequencies.length; i++) {
      sum += frequencies[i] as number;
    }
    const average = sum / frequencies.length;
    
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
    for (let i = midEnd; i < frequencies.length; i++) {
      trebleSum += frequencies[i] as number;
    }
    const treble = trebleSum / (frequencies.length - midEnd || 1);

    (audioDataRef as any).current = {
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