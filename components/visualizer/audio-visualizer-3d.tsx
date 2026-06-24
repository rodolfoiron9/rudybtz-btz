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

function VisualizerMesh({ audioData, preset }: VisualizerMeshProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Reusable objects for performance
  const dummy = useRef(new THREE.Object3D());
  const color = useRef(new THREE.Color());

  // Memory management: dispose geometry and material on unmount or preset change
  const { geometry, material } = useMemo(() => {
    const { type, colorScheme } = preset;

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
  }, [preset.type, preset.colorScheme.primary]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Animate meshes based on audio data
  useFrame((state) => {
    if (!audioData || !meshRef.current) return;

    const { frequencies, average, bass, mid, treble } = audioData;
    const time = state.clock.elapsedTime;
    const { gridSize, effects, sensitivity, type } = preset;
    const count = gridSize * gridSize;

    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;

    let index = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const i = index++;

        // Calculate frequency band for this instance
        const frequencyIndex = Math.floor((i / count) * frequencies.length);
        const frequency = (frequencies[frequencyIndex] as number) || 0;
        const normalizedFreq = frequency / 255;

        // Reset dummy
        dummy.current.position.set(
          x * spacing - offset,
          0,
          z * spacing - offset
        );
        dummy.current.rotation.set(0, 0, 0);
        dummy.current.scale.set(1, 1, 1);

        // Apply scaling
        if (effects.scaling) {
          const scaleY = 1 + normalizedFreq * 2;
          dummy.current.scale.y = scaleY;
        }

        // Apply rotation
        if (effects.rotation) {
          dummy.current.rotation.y = time + normalizedFreq * Math.PI;
        }

        // Apply pulsing
        if (effects.pulsing) {
          const pulse = Math.sin(time * 4 + i * 0.1) * 0.2 + 1;
          dummy.current.scale.x *= pulse;
          dummy.current.scale.z *= pulse;
        }

        // Wave effect position modulation
        if (type === 'waves') {
          dummy.current.position.y = Math.sin(time * 2 + i * 0.2) * normalizedFreq * 2;
        }

        dummy.current.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.current.matrix);

        // Color modulation
        const hue = (bass * sensitivity.bass +
                     mid * sensitivity.mid +
                     treble * sensitivity.treble) / 765;
        
        color.current.setHSL(hue, 0.8, 0.6);
        meshRef.current.setColorAt(i, color.current);
      }
    }

    // Flag for update
    if (meshRef.current.instanceMatrix) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Overall rotation
    if (effects.rotation) {
      meshRef.current.rotation.y = time * 0.5 + average * 0.01;
    }
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, preset.gridSize * preset.gridSize]}
      />
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light that pulses with bass */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.6 + (audioData?.bass || 0) / 255 * 0.4}
        color={preset.colorScheme.accent}
      />
      
      {/* Point light that follows the audio */}
      <pointLight
        position={[0, 3, 0]}
        intensity={1 + (audioData?.average || 0) / 255}
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
  const [audioData, setAudioData] = useState<AudioData | null>(null);
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
    const frequencyBinCount = analyser.frequencyBinCount;
    const fftSize = analyser.fftSize;

    const frequencies = new Uint8Array(frequencyBinCount);
    const waveform = new Uint8Array(fftSize);

    analyser.getByteFrequencyData(frequencies);
    analyser.getByteTimeDomainData(waveform);

    // Calculate audio metrics using manual loops to avoid per-frame allocations from .reduce() and .slice()
    let sum = 0;
    for (let i = 0; i < frequencyBinCount; i++) {
      sum += (frequencies[i] as number);
    }
    const average = sum / (frequencyBinCount || 1);
    
    // Frequency bands (bass: 0-10%, mid: 10-30%, treble: 30%+)
    const bassEnd = Math.floor(frequencyBinCount * 0.1);
    const midEnd = Math.floor(frequencyBinCount * 0.3);
    
    let bassSum = 0;
    for (let i = 0; i < bassEnd; i++) {
      bassSum += (frequencies[i] as number);
    }
    const bass = bassSum / (bassEnd || 1);

    let midSum = 0;
    for (let i = bassEnd; i < midEnd; i++) {
      midSum += (frequencies[i] as number);
    }
    const mid = midSum / (midEnd - bassEnd || 1);

    let trebleSum = 0;
    for (let i = midEnd; i < frequencyBinCount; i++) {
      trebleSum += (frequencies[i] as number);
    }
    const treble = trebleSum / (frequencyBinCount - midEnd || 1);

    setAudioData({
      frequencies,
      waveform,
      average,
      bass,
      mid,
      treble
    });

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
        
        <VisualizerMesh audioData={audioData} preset={preset} />
        
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