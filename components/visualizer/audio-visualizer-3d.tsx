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

function VisualizerMesh({ audioDataRef, preset }: { audioDataRef: React.MutableRefObject<AudioData | null>, preset: VisualizerPreset }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Re-usable objects for calculations to avoid GC
  const tempObject = useRef(new THREE.Object3D());
  const tempColor = useRef(new THREE.Color());

  // Memoize geometry to only recreate when type changes
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

  // Memoize material
  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: preset.colorScheme.primary,
      transparent: true,
      opacity: 0.8,
    });
  }, [preset.colorScheme.primary]);

  // Cleanup geometries and materials
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  const count = preset.gridSize * preset.gridSize;

  useFrame((state) => {
    if (!meshRef.current || !audioDataRef.current) return;

    const audioData = audioDataRef.current;
    const { frequencies, average, bass, mid, treble } = audioData;
    const { gridSize, type, effects, sensitivity } = preset;
    const time = state.clock.elapsedTime;
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;
    const totalInstances = gridSize * gridSize;

    // Safety check for instance count during transition states
    if (meshRef.current.count !== totalInstances) return;

    let idx = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const frequencyIndex = Math.floor((idx / totalInstances) * frequencies.length);
        const frequency = frequencies[frequencyIndex] || 0;
        const normalizedFreq = frequency / 255;

        // Position
        tempObject.current.position.set(
          x * spacing - offset,
          type === 'waves' ? Math.sin(time * 2 + idx * 0.2) * normalizedFreq * 2 : 0,
          z * spacing - offset
        );

        // Scaling
        let scaleX = 1;
        let scaleY = 1;
        let scaleZ = 1;

        if (effects.scaling) {
          scaleY = 1 + normalizedFreq * 2;
        }

        if (effects.pulsing) {
          const pulse = Math.sin(time * 4 + idx * 0.1) * 0.2 + 1;
          scaleX = pulse;
          scaleZ = pulse;
        }

        tempObject.current.scale.set(scaleX, scaleY, scaleZ);

        // Rotation
        if (effects.rotation) {
          tempObject.current.rotation.y = time + normalizedFreq * Math.PI;
        } else {
          tempObject.current.rotation.y = 0;
        }

        tempObject.current.updateMatrix();
        meshRef.current.setMatrixAt(idx, tempObject.current.matrix);

        // Color
        const hue = (bass * sensitivity.bass +
                     mid * sensitivity.mid +
                     treble * sensitivity.treble) / 765;

        tempColor.current.setHSL(hue, 0.8, 0.6);
        meshRef.current.setColorAt(idx, tempColor.current);

        idx++;
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Group-level rotation
    if (effects.rotation) {
      meshRef.current.rotation.y = time * 0.5 + average * 0.01;
    }

    // Update lights imperatively
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = 0.6 + (bass / 255) * 0.4;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 1 + (average / 255);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={directionalLightRef}
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
        key={`visualizer-${preset.type}-${preset.gridSize}`}
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

  // Pre-allocate arrays to avoid GC
  const frequenciesArrayRef = useRef<Uint8Array | null>(null);
  const waveformArrayRef = useRef<Uint8Array | null>(null);

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

      frequenciesArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      waveformArrayRef.current = new Uint8Array(analyser.fftSize);

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
    if (!analyserRef.current || !frequenciesArrayRef.current || !waveformArrayRef.current) return;

    const analyser = analyserRef.current;
    const frequencies = frequenciesArrayRef.current;
    const waveform = waveformArrayRef.current;

    analyser.getByteFrequencyData(frequencies as any);
    analyser.getByteTimeDomainData(waveform as any);

    // Calculate audio metrics with manual loop to avoid allocations
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