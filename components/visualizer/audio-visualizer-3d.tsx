'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
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
  audioDataRef: React.RefObject<AudioData | null>;
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
  const groupRef = useRef<THREE.Group>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Pre-allocate utility objects to avoid garbage collection
  const { dummy, color, count } = useMemo(() => ({
    dummy: new THREE.Object3D(),
    color: new THREE.Color(),
    count: preset.gridSize * preset.gridSize
  }), [preset.gridSize]);

  // Create geometry and material based on preset
  const { geometry, material } = useMemo(() => {
    let geo: THREE.BufferGeometry;
    switch (preset.type) {
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
      color: new THREE.Color(preset.colorScheme.primary),
      transparent: true,
      opacity: 0.8,
    });

    return { geometry: geo, material: mat };
  }, [preset.type, preset.colorScheme.primary]);

  // Cleanup Three.js resources
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Initial positioning
  useEffect(() => {
    if (!meshRef.current) return;

    const spacing = 0.5;
    const offset = (preset.gridSize - 1) * spacing / 2;
    let i = 0;

    for (let x = 0; x < preset.gridSize; x++) {
      for (let z = 0; z < preset.gridSize; z++) {
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
  }, [preset.gridSize, dummy, geometry]); // Added geometry to trigger update when type changes

  // Animate instances based on audio data
  useFrame((state) => {
    const audioData = audioDataRef.current;
    if (!meshRef.current || !groupRef.current) return;

    const time = state.clock.elapsedTime;
    const spacing = 0.5;
    const offset = (preset.gridSize - 1) * spacing / 2;
    let i = 0;

    if (audioData) {
      const { frequencies, average, bass, mid, treble } = audioData;

      for (let x = 0; x < preset.gridSize; x++) {
        for (let z = 0; z < preset.gridSize; z++) {
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
          const scaleY = preset.effects.scaling ? 1 + normalizedFreq * 2 : 1;
          const pulse = preset.effects.pulsing ? Math.sin(time * 4 + index * 0.1) * 0.2 + 1 : 1;
          dummy.scale.set(pulse, scaleY, pulse);

          // Apply rotation
          if (preset.effects.rotation) {
            dummy.rotation.set(0, time + normalizedFreq * Math.PI, 0);
          } else {
            dummy.rotation.set(0, 0, 0);
          }

          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i, dummy.matrix);

          // Color modulation
          const hue = (bass * preset.sensitivity.bass +
                       mid * preset.sensitivity.mid +
                       treble * preset.sensitivity.treble) / 765;

          color.setHSL(hue, 0.8, 0.6);
          meshRef.current.setColorAt(i, color);

          i++;
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }

      // Update lights via refs to avoid re-renders
      if (dirLightRef.current) {
        dirLightRef.current.intensity = 0.6 + (bass / 255) * 0.4;
      }
      if (pointLightRef.current) {
        pointLightRef.current.intensity = 1 + (average / 255);
      }

      // Group rotation
      if (preset.effects.rotation) {
        groupRef.current.rotation.y = time * 0.5 + average * 0.01;
      }
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

      <instancedMesh ref={meshRef} args={[geometry, material, count]} />
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

  // Pre-allocate buffers for audio analysis to avoid GC
  const frequencyBufferRef = useRef<Uint8Array | null>(null);
  const waveformBufferRef = useRef<Uint8Array | null>(null);

  // Initialize Web Audio API
  const initializeAudio = useCallback(async () => {
    if (!audioElement || audioContextRef.current) return audioContextRef.current;

    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Initialize buffers
      frequencyBufferRef.current = new Uint8Array(analyser.frequencyBinCount);
      waveformBufferRef.current = new Uint8Array(analyser.fftSize);

      const source = audioContext.createMediaElementSource(audioElement);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      console.log('Audio visualizer initialized successfully');
      return audioContext;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return null;
    }
  }, [audioElement]);

  // Audio analysis loop
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !frequencyBufferRef.current || !waveformBufferRef.current) return;

    const analyser = analyserRef.current;
    const frequencies = frequencyBufferRef.current;
    const waveform = waveformBufferRef.current;

    analyser.getByteFrequencyData(frequencies as any);
    analyser.getByteTimeDomainData(waveform as any);

    let sum = 0;
    const freqLength = frequencies.length;
    for (let i = 0; i < freqLength; i++) {
      sum += frequencies[i] || 0;
    }
    const average = sum / (freqLength || 1);
    
    const bassEnd = Math.floor(freqLength * 0.1);
    const midEnd = Math.floor(freqLength * 0.3);
    
    let bassSum = 0;
    for (let i = 0; i < bassEnd; i++) bassSum += frequencies[i] || 0;
    const bass = bassSum / (bassEnd || 1);

    let midSum = 0;
    for (let i = bassEnd; i < midEnd; i++) midSum += frequencies[i] || 0;
    const mid = midSum / ((midEnd - bassEnd) || 1);

    let trebleSum = 0;
    for (let i = midEnd; i < freqLength; i++) trebleSum += frequencies[i] || 0;
    const treble = trebleSum / ((freqLength - midEnd) || 1);

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

  // Start audio analysis
  useEffect(() => {
    if (audioElement && !audioContextRef.current) {
      initializeAudio();
    }

    let cleanup: (() => void) | undefined;

    if (audioElement) {
      const handlePlay = async () => {
        let context = audioContextRef.current;
        if (!context) {
          context = await initializeAudio();
        }

        if (context) {
          if (context.state === 'suspended') {
            await context.resume();
          }
          analyzeAudio();
        }
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

      cleanup = () => {
        handlePause();
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    return cleanup;
  }, [audioElement, initializeAudio, analyzeAudio]);

  // Final cleanup
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
