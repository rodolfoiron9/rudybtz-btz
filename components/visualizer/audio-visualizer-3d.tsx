'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
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
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  const { gridSize, type, colorScheme } = preset;
  const count = gridSize * gridSize;

  // Create geometry based on type
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

  // Create material
  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(colorScheme.primary),
      transparent: true,
      opacity: 0.8,
    });
  }, [colorScheme.primary]);

  // Cleanup geometries and materials
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Animate meshes based on audio data
  useFrame((state) => {
    const audioData = audioDataRef.current;
    const mesh = meshRef.current;
    if (!mesh) return;

    const { frequencies, average, bass, mid, treble } = audioData || {
      frequencies: new Uint8Array(0),
      average: 0,
      bass: 0,
      mid: 0,
      treble: 0
    };

    const time = state.clock.elapsedTime;
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;

    for (let i = 0; i < count; i++) {
      const x = i % gridSize;
      const z = Math.floor(i / gridSize);

      // Calculate frequency band for this mesh
      const frequencyIndex = frequencies.length > 0
        ? Math.floor((i / count) * frequencies.length)
        : 0;
      const frequency = frequencies[frequencyIndex] || 0;
      const normalizedFreq = frequency / 255;

      dummy.position.set(
        x * spacing - offset,
        0,
        z * spacing - offset
      );

      // Position modulation for wave effect
      if (preset.type === 'waves') {
        dummy.position.y = Math.sin(time * 2 + i * 0.2) * normalizedFreq * 2;
      }

      // Apply scaling based on frequency and preset sensitivity
      let scaleX = 1;
      let scaleY = 1;
      let scaleZ = 1;

      if (preset.effects.scaling) {
        scaleY = 1 + normalizedFreq * 2;
      }

      // Apply pulsing effect
      if (preset.effects.pulsing) {
        const pulse = Math.sin(time * 4 + i * 0.1) * 0.2 + 1;
        scaleX = pulse;
        scaleZ = pulse;
      }

      dummy.scale.set(scaleX, scaleY, scaleZ);

      // Apply rotation based on audio
      if (preset.effects.rotation) {
        dummy.rotation.y = time + normalizedFreq * Math.PI;
      }

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Color modulation
      const hue = (bass * preset.sensitivity.bass +
                   mid * preset.sensitivity.mid +
                   treble * preset.sensitivity.treble) / 765;

      color.setHSL(hue, 0.8, 0.6);
      mesh.setColorAt(i, color);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // Group rotation based on overall audio level
    if (preset.effects.rotation) {
      mesh.rotation.y = time * 0.5 + average * 0.01;
    }

    // Update lights imperatively to avoid re-renders
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = 0.4;
    }
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = 0.6 + (bass / 255) * 0.4;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 1 + (average / 255);
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.4} />
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
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />
    </>
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

  // Pre-allocated buffers for audio analysis to avoid GC pressure
  const frequenciesRef = useRef<Uint8Array | null>(null);
  const waveformRef = useRef<Uint8Array | null>(null);
  const audioDataRef = useRef<AudioData | null>(null);

  // Audio analysis loop
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;

    // Initialize or resize buffers if needed
    if (!frequenciesRef.current || frequenciesRef.current.length !== analyser.frequencyBinCount) {
      frequenciesRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
    if (!waveformRef.current || waveformRef.current.length !== analyser.fftSize) {
      waveformRef.current = new Uint8Array(analyser.fftSize);
    }

    const frequencies = frequenciesRef.current;
    const waveform = waveformRef.current;

    analyser.getByteFrequencyData(frequencies as any);
    analyser.getByteTimeDomainData(waveform as any);

    // Calculate audio metrics using manual loops (faster than reduce/slice)
    let total = 0;
    for (let i = 0; i < frequencies.length; i++) {
      total += (frequencies[i] as number);
    }
    const average = total / frequencies.length;
    
    // Frequency bands (bass: 0-10%, mid: 10-30%, treble: 30-100%)
    const bassEnd = Math.floor(frequencies.length * 0.1);
    const midEnd = Math.floor(frequencies.length * 0.3);
    
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
    for (let i = midEnd; i < frequencies.length; i++) {
      trebleSum += (frequencies[i] as number);
    }
    const treble = trebleSum / (frequencies.length - midEnd || 1);

    // Update ref instead of state to avoid React re-renders at 60fps
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