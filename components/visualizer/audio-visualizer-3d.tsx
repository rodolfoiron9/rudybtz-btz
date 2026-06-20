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
  audioDataRef: React.MutableRefObject<AudioData | null>;
  preset: VisualizerPreset;
}

function VisualizerMesh({ audioDataRef, preset }: VisualizerMeshProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  // Initialize instanced mesh based on preset
  const { gridSize, type, colorScheme } = preset;
  const instanceCount = gridSize * gridSize;

  const geometry = useMemo(() => {
    switch (type) {
      case 'spheres':
        return new THREE.SphereGeometry(0.1, 8, 6);
      case 'waves':
        return new THREE.PlaneGeometry(0.2, 0.2, 4, 4);
      case 'particles':
        return new THREE.SphereGeometry(0.05, 4, 4);
      default:
        return new THREE.BoxGeometry(0.2, 0.2, 0.2);
    }
  }, [type]);

  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(colorScheme.primary),
      transparent: true,
      opacity: 0.8,
    });
  }, [colorScheme.primary]);

  // Clean up resources
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Animate meshes based on audio data
  useFrame((state) => {
    if (!meshRef.current || !audioDataRef.current) return;

    const audioData = audioDataRef.current;
    const { frequencies, average, bass, mid, treble } = audioData;
    const time = state.clock.elapsedTime;

    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;

    for (let i = 0; i < instanceCount; i++) {
      const x = i % gridSize;
      const z = Math.floor(i / gridSize);

      // Calculate frequency band for this instance
      const frequencyIndex = Math.floor((i / instanceCount) * frequencies.length);
      const frequency = frequencies[frequencyIndex] || 0;
      const normalizedFreq = frequency / 255;

      // Position
      let posY = 0;
      if (preset.type === 'waves') {
        posY = Math.sin(time * 2 + i * 0.2) * normalizedFreq * 2;
      }
      dummy.position.set(
        x * spacing - offset,
        posY,
        z * spacing - offset
      );

      // Scaling
      let scaleY = 1;
      let scaleXZ = 1;
      if (preset.effects.scaling) {
        scaleY = 1 + normalizedFreq * 2;
      }
      if (preset.effects.pulsing) {
        scaleXZ = Math.sin(time * 4 + i * 0.1) * 0.2 + 1;
      }
      dummy.scale.set(scaleXZ, scaleY, scaleXZ);

      // Rotation
      if (preset.effects.rotation) {
        dummy.rotation.y = time + normalizedFreq * Math.PI;
      } else {
        dummy.rotation.y = 0;
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color modulation
      const hue = (bass * preset.sensitivity.bass +
                   mid * preset.sensitivity.mid +
                   treble * preset.sensitivity.treble) / 765;

      color.setHSL(hue, 0.8, 0.6);
      meshRef.current.setColorAt(i, color);
    }

    if (meshRef.current.instanceMatrix) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Overall rotation
    if (preset.effects.rotation) {
      meshRef.current.rotation.y = time * 0.5 + average * 0.01;
    }

    // Update light intensities imperatively
    if (dirLightRef.current) {
      dirLightRef.current.intensity = 0.6 + (bass / 255) * 0.4;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 1 + average / 255;
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[geometry, material, instanceCount]} />

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

  // Pre-allocate buffers
  const frequenciesRef = useRef<Uint8Array | null>(null);
  const waveformRef = useRef<Uint8Array | null>(null);

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

      // Initialize pre-allocated buffers
      frequenciesRef.current = new Uint8Array(analyser.frequencyBinCount);
      waveformRef.current = new Uint8Array(analyser.fftSize);

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
    if (!analyserRef.current || !frequenciesRef.current || !waveformRef.current) return;

    const analyser = analyserRef.current;
    const frequencies = frequenciesRef.current;
    const waveform = waveformRef.current;

    analyser.getByteFrequencyData(frequencies as any);
    analyser.getByteTimeDomainData(waveform as any);

    // Calculate audio metrics using a single loop for efficiency
    let sum = 0;
    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;

    const len = frequencies.length;
    const bassEnd = Math.floor(len * 0.1);
    const midEnd = Math.floor(len * 0.3);

    for (let i = 0; i < len; i++) {
      const val = frequencies[i] as number;
      sum += val;
      if (i < bassEnd) {
        bassSum += val;
      } else if (i < midEnd) {
        midSum += val;
      } else {
        trebleSum += val;
      }
    }

    audioDataRef.current = {
      frequencies,
      waveform,
      average: sum / len,
      bass: bassSum / bassEnd,
      mid: midSum / (midEnd - bassEnd),
      treble: trebleSum / (len - midEnd)
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