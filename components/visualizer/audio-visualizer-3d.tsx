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
  const groupRef = useRef<THREE.Group>(null);

  // Reuse objects to avoid GC pressure
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  // Refs for pulsing/lighting that were previously in JSX
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Initialize meshes based on preset
  useEffect(() => {
    if (!instancedMeshRef.current) return;

    const { gridSize, colorScheme } = preset;
    const count = gridSize * gridSize;

    // Reset scales/matrices for all instances
    for (let i = 0; i < count; i++) {
      dummy.position.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
      instancedMeshRef.current.setColorAt(i, color.set(colorScheme.primary));
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [preset]);

  // Animate meshes based on audio data
  useFrame((state) => {
    const audioData = audioDataRef.current;
    if (!audioData || !instancedMeshRef.current || !groupRef.current) return;

    const { frequencies, average, bass, mid, treble } = audioData;
    const { gridSize, type, effects, sensitivity } = preset;
    const time = state.clock.elapsedTime;
    const count = gridSize * gridSize;
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;

    for (let i = 0; i < count; i++) {
      const x = Math.floor(i / gridSize);
      const z = i % gridSize;

      // Calculate frequency band for this mesh
      const frequencyIndex = Math.floor((i / count) * frequencies.length);
      const frequency = frequencies[frequencyIndex] || 0;
      const normalizedFreq = frequency / 255;

      // Reset dummy
      dummy.position.set(
        x * spacing - offset,
        0,
        z * spacing - offset
      );
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);

      // Apply scaling based on frequency and preset sensitivity
      if (effects.scaling) {
        const scale = 1 + normalizedFreq * 2;
        dummy.scale.setY(scale);
      }

      // Apply rotation based on audio
      if (effects.rotation) {
        dummy.rotation.y = time + normalizedFreq * Math.PI;
      }

      // Apply pulsing effect
      if (effects.pulsing) {
        const pulse = Math.sin(time * 4 + i * 0.1) * 0.2 + 1;
        dummy.scale.x *= pulse;
        dummy.scale.z *= pulse;
      }

      // Position modulation for wave effect
      if (type === 'waves') {
        dummy.position.y = Math.sin(time * 2 + i * 0.2) * normalizedFreq * 2;
      }

      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);

      // Color modulation based on frequency bands
      const hue = (bass * sensitivity.bass +
                   mid * sensitivity.mid +
                   treble * sensitivity.treble) / 765;

      color.setHSL(hue, 0.8, 0.6);
      instancedMeshRef.current.setColorAt(i, color);
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }

    // Group rotation based on overall audio level
    if (effects.rotation) {
      groupRef.current.rotation.y = time * 0.5 + average * 0.01;
    }

    // Update lights imperatively
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = 0.6 + (bass / 255) * 0.4;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 1 + (average / 255);
    }
  });

  // Choose geometry based on type
  const geometry = useMemo(() => {
    switch (preset.type) {
      case 'spheres':
        return new THREE.SphereGeometry(0.1, 8, 6);
      case 'waves':
        return new THREE.PlaneGeometry(0.2, 0.2, 4, 4);
      case 'particles':
        return new THREE.SphereGeometry(0.05, 4, 4);
      default:
        return new THREE.BoxGeometry(0.2, 0.2, 0.2);
    }
  }, [preset.type]);

  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(preset.colorScheme.primary),
      transparent: true,
      opacity: 0.8,
    });
  }, [preset.colorScheme.primary]);

  // Clean up Three.js resources
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={instancedMeshRef}
        args={[geometry, material, preset.gridSize * preset.gridSize]}
      />
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light that pulses with bass */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 5, 5]}
        color={preset.colorScheme.accent}
      />
      
      {/* Point light that follows the audio */}
      <pointLight
        ref={pointLightRef}
        position={[0, 3, 0]}
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

    // Calculate audio metrics using a single manual loop for performance
    let total = 0;
    let bassTotal = 0;
    let midTotal = 0;
    let trebleTotal = 0;
    
    const length = frequencies.length;
    const bassEnd = Math.floor(length * 0.1);
    const midEnd = Math.floor(length * 0.3);
    
    for (let i = 0; i < length; i++) {
      const val = frequencies[i] as number;
      total += val;
      if (i < bassEnd) {
        bassTotal += val;
      } else if (i < midEnd) {
        midTotal += val;
      } else {
        trebleTotal += val;
      }
    }

    audioDataRef.current = {
      frequencies,
      waveform,
      average: total / length,
      bass: bassTotal / (bassEnd || 1),
      mid: midTotal / (midEnd - bassEnd || 1),
      treble: trebleTotal / (length - midEnd || 1)
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