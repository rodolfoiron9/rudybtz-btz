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
  const tempObject = useRef(new THREE.Object3D()).current;
  const tempColor = useRef(new THREE.Color()).current;

  // Initialize instance matrices
  useEffect(() => {
    if (!meshRef.current?.setMatrixAt) return;

    const { gridSize } = preset;
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;
    let i = 0;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        tempObject.position.set(x * spacing - offset, 0, z * spacing - offset);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i++, tempObject.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [preset.gridSize]);

  // Animate meshes based on audio data
  useFrame((state) => {
    if (!meshRef.current) return;

    const { frequencies, average, bass, mid, treble } = audioDataRef.current;
    if (frequencies.length === 0) return;
    const { gridSize, sensitivity, effects, type } = preset;
    const time = state.clock.elapsedTime;
    const count = gridSize * gridSize;

    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;
    let i = 0;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const index = i++;

        // Calculate frequency band for this instance
        const frequencyIndex = Math.floor((index / count) * frequencies.length);
        const frequency = frequencies[frequencyIndex] || 0;
        const normalizedFreq = frequency / 255;

        // Reset transform
        tempObject.position.set(x * spacing - offset, 0, z * spacing - offset);
        tempObject.rotation.set(0, 0, 0);
        tempObject.scale.set(1, 1, 1);

        // Apply scaling based on frequency and preset sensitivity
        if (effects.scaling) {
          const scale = 1 + normalizedFreq * 2;
          tempObject.scale.setY(scale);
        }

        // Apply rotation based on audio
        if (effects.rotation) {
          tempObject.rotation.y = time + normalizedFreq * Math.PI;
        }

        // Apply pulsing effect
        if (effects.pulsing) {
          const pulse = Math.sin(time * 4 + index * 0.1) * 0.2 + 1;
          tempObject.scale.setX(pulse);
          tempObject.scale.setZ(pulse);
        }

        // Position modulation for wave effect
        if (type === 'waves') {
          tempObject.position.y = Math.sin(time * 2 + index * 0.2) * normalizedFreq * 2;
        }

        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(index, tempObject.matrix);

        // Color modulation
        const hue = (bass * sensitivity.bass +
                     mid * sensitivity.mid +
                     treble * sensitivity.treble) / 765;
        
        tempColor.setHSL(hue, 0.8, 0.6);
        meshRef.current.setColorAt(index, tempColor);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Overall rotation
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

  const geometry = useMemo(() => {
    switch (preset.type) {
      case 'spheres': return new THREE.SphereGeometry(0.1, 8, 6);
      case 'waves': return new THREE.PlaneGeometry(0.2, 0.2, 4, 4);
      case 'particles': return new THREE.SphereGeometry(0.05, 4, 4);
      default: return new THREE.BoxGeometry(0.2, 0.2, 0.2);
    }
  }, [preset.type]);

  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(preset.colorScheme.primary),
      transparent: true,
      opacity: 0.8,
    });
  }, [preset.colorScheme.primary]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

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
        ref={directionalLightRef}
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

    // Pre-allocate buffers if they don't exist or size changed
    if (audioDataRef.current.frequencies.length !== analyser.frequencyBinCount) {
      audioDataRef.current.frequencies = new Uint8Array(analyser.frequencyBinCount);
    }
    if (audioDataRef.current.waveform.length !== analyser.fftSize) {
      audioDataRef.current.waveform = new Uint8Array(analyser.fftSize);
    }

    const { frequencies, waveform } = audioDataRef.current;

    analyser.getByteFrequencyData(frequencies as any);
    analyser.getByteTimeDomainData(waveform as any);

    // Calculate audio metrics
    let total = 0;
    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;

    const len = frequencies.length;
    const bassEnd = Math.floor(len * 0.1);
    const midEnd = Math.floor(len * 0.3);

    for (let i = 0; i < len; i++) {
      const val = frequencies[i] as number;
      total += val;
      if (i < bassEnd) {
        bassSum += val;
      } else if (i < midEnd) {
        midSum += val;
      } else {
        trebleSum += val;
      }
    }

    audioDataRef.current.average = total / len;
    audioDataRef.current.bass = bassSum / (bassEnd || 1);
    audioDataRef.current.mid = midSum / (midEnd - bassEnd || 1);
    audioDataRef.current.treble = trebleSum / (len - midEnd || 1);

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