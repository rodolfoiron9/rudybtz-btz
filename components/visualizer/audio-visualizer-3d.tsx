'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
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
  const groupRef = useRef<THREE.Group>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Pre-allocate temporary objects for performance
  const tempObject = useRef(new THREE.Object3D());
  const tempColor = useRef(new THREE.Color());

  // Initialize instanced mesh based on preset
  useEffect(() => {
    const { gridSize, type, colorScheme } = preset;
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

    // Create material with preset colors
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(colorScheme.primary),
      transparent: true,
      opacity: 0.8,
    });

    // Create the instanced mesh if it doesn't exist or replace it
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

    // Set initial positions
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;
    let i = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        tempObject.current.position.set(
          x * spacing - offset,
          0,
          z * spacing - offset
        );
        tempObject.current.updateMatrix();
        instancedMesh.setMatrixAt(i++, tempObject.current.matrix);
      }
    }
    instancedMesh.instanceMatrix.needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.clear();
      groupRef.current.add(instancedMesh);
      // @ts-ignore - assigning to ref
      instancedMeshRef.current = instancedMesh;
    }

    return () => {
      geometry.dispose();
      material.dispose();
      instancedMesh.dispose();
    };
  }, [preset]);

  // Animate instances based on audio data
  useFrame((state) => {
    const audioData = audioDataRef.current;
    const instancedMesh = instancedMeshRef.current;
    if (!audioData || !instancedMesh || !groupRef.current) return;

    const { frequencies, average, bass, mid, treble } = audioData;
    const time = state.clock.elapsedTime;
    const { gridSize, effects, sensitivity, colorScheme } = preset;
    const count = gridSize * gridSize;

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

        // Reset temp object
        tempObject.current.position.set(
          x * spacing - offset,
          0,
          z * spacing - offset
        );
        tempObject.current.rotation.set(0, 0, 0);
        tempObject.current.scale.set(1, 1, 1);

        // Apply scaling based on frequency and preset sensitivity
        if (effects.scaling) {
          const scaleY = 1 + normalizedFreq * 2;
          tempObject.current.scale.y = scaleY;
        }

        // Apply rotation based on audio
        if (effects.rotation) {
          tempObject.current.rotation.y = time + normalizedFreq * Math.PI;
        }

        // Apply pulsing effect
        if (effects.pulsing) {
          const pulse = Math.sin(time * 4 + index * 0.1) * 0.2 + 1;
          tempObject.current.scale.x = pulse;
          tempObject.current.scale.z = pulse;
        }

        // Position modulation for wave effect
        if (preset.type === 'waves') {
          tempObject.current.position.y = Math.sin(time * 2 + index * 0.2) * normalizedFreq * 2;
        }

        tempObject.current.updateMatrix();
        instancedMesh.setMatrixAt(index, tempObject.current.matrix);

        // Color modulation
        const hue = (bass * sensitivity.bass +
                     mid * sensitivity.mid +
                     treble * sensitivity.treble) / 765;

        tempColor.current.setHSL(hue, 0.8, 0.6);
        instancedMesh.setColorAt(index, tempColor.current);
        
        i++;
      }
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }

    // Group rotation based on overall audio level
    if (effects.rotation) {
      groupRef.current.rotation.y = time * 0.5 + average * 0.01;
    }

    // Update light intensities imperatively
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = 0.6 + (bass / 255) * 0.4;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 1 + (average / 255);
    }
  });

  return (
    <group ref={groupRef}>
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

    // Calculate audio metrics efficiently using manual loops to avoid array allocations
    let sum = 0;
    const len = frequencies.length;
    for (let i = 0; i < len; i++) {
      sum += (frequencies[i] as number);
    }
    const average = sum / (len || 1);
    
    // Frequency bands (bass: 0-85Hz, mid: 85-255Hz, treble: 255Hz+)
    const bassEnd = Math.floor(len * 0.1);
    const midEnd = Math.floor(len * 0.3);
    
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
    for (let i = midEnd; i < len; i++) {
      trebleSum += (frequencies[i] as number);
    }
    const treble = trebleSum / (len - midEnd || 1);

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