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
  audioDataRef: React.MutableRefObject<AudioData>;
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
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const { gridSize, type, colorScheme } = preset;
  const count = gridSize * gridSize;

  // Use dummy object for matrix transformations
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  // Initialize instance matrices
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

  // Animate meshes based on audio data
  useFrame((state) => {
    if (!meshRef.current) return;

    const { frequencies, average, bass, mid, treble } = audioDataRef.current;
    if (frequencies.length === 0) return;

    const time = state.clock.elapsedTime;
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;
    let i = 0;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const index = i;
        // Calculate frequency band for this instance
        const frequencyIndex = Math.floor((index / count) * frequencies.length);
        const frequency = frequencies[frequencyIndex] || 0;
        const normalizedFreq = frequency / 255;

        dummy.position.set(
          x * spacing - offset,
          preset.type === 'waves' ? Math.sin(time * 2 + index * 0.2) * normalizedFreq * 2 : 0,
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
          const pulse = Math.sin(time * 4 + index * 0.1) * 0.2 + 1;
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
        meshRef.current.setMatrixAt(i, dummy.matrix);

        // Color modulation
        const hue = (bass * preset.sensitivity.bass + 
                     mid * preset.sensitivity.mid + 
                     treble * preset.sensitivity.treble) / 765;
        
        color.setHSL(hue % 1, 0.8, 0.6);
        meshRef.current.setColorAt(i, color);

        i++;
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Overall rotation
    if (preset.effects.rotation) {
      meshRef.current.rotation.y = time * 0.5 + average * 0.01;
    }

    // Update lights imperativey
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = 0.6 + (bass / 255) * 0.4;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 1 + (average / 255);
    }
  });

  const geometry = useMemo(() => {
    switch (type) {
      case 'spheres': return new THREE.SphereGeometry(0.1, 8, 6);
      case 'waves': return new THREE.PlaneGeometry(0.2, 0.2, 4, 4);
      case 'particles': return new THREE.SphereGeometry(0.05, 4, 4);
      default: return new THREE.BoxGeometry(0.2, 0.2, 0.2);
    }
  }, [type]);

  const material = useMemo(() => new THREE.MeshPhongMaterial({
    color: new THREE.Color(colorScheme.primary),
    transparent: true,
    opacity: 0.8,
  }), [colorScheme.primary]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <group>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />

      <ambientLight intensity={0.4} />
      
      <directionalLight
        ref={directionalLightRef}
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
  // Use ref for audio data to avoid React re-renders at 60fps
  const audioDataRef = useRef<AudioData>({
    frequencies: new Uint8Array(0),
    waveform: new Uint8Array(0),
    average: 0,
    bass: 0,
    mid: 0,
    treble: 0
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Pre-allocated buffers to avoid garbage collection
  const freqBufferRef = useRef<Uint8Array | null>(null);
  const waveBufferRef = useRef<Uint8Array | null>(null);

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

      const source = audioContext.createMediaElementSource(audioElement);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      freqBufferRef.current = new Uint8Array(analyser.frequencyBinCount);
      waveBufferRef.current = new Uint8Array(analyser.fftSize);

      audioDataRef.current.frequencies = freqBufferRef.current;
      audioDataRef.current.waveform = waveBufferRef.current;

      console.log('Audio visualizer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }, [audioElement]);

  // Audio analysis loop - optimized for performance
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !freqBufferRef.current || !waveBufferRef.current) return;

    const analyser = analyserRef.current;
    const frequencies = freqBufferRef.current;
    const waveform = waveBufferRef.current;

    analyser.getByteFrequencyData(frequencies as any);
    analyser.getByteTimeDomainData(waveform as any);

    // Calculate metrics using manual loops for maximum speed and zero allocation
    let total = 0;
    for (let i = 0; i < frequencies.length; i++) {
      total += frequencies[i] as number;
    }
    const average = total / frequencies.length;
    
    const bassEnd = Math.floor(frequencies.length * 0.1);
    const midEnd = Math.floor(frequencies.length * 0.3);
    
    let bassTotal = 0;
    for (let i = 0; i < bassEnd; i++) {
      bassTotal += frequencies[i] as number;
    }
    const bass = bassTotal / bassEnd;

    let midTotal = 0;
    for (let i = bassEnd; i < midEnd; i++) {
      midTotal += frequencies[i] as number;
    }
    const mid = midTotal / (midEnd - bassEnd);

    let trebleTotal = 0;
    for (let i = midEnd; i < frequencies.length; i++) {
      trebleTotal += frequencies[i] as number;
    }
    const treble = trebleTotal / (frequencies.length - midEnd);

    // Update ref directly - no re-render
    audioDataRef.current.average = average;
    audioDataRef.current.bass = bass;
    audioDataRef.current.mid = mid;
    audioDataRef.current.treble = treble;

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

      // If already playing
      if (!audioElement.paused) {
        handlePlay();
      }

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
