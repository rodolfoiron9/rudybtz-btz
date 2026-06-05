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

  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  // Initialize instanced mesh based on preset
  useEffect(() => {
    if (!instancedMeshRef.current) return;

    const { gridSize } = preset;
    const spacing = 0.5;
    const offset = ((gridSize - 1) * spacing) / 2;

    let i = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        dummy.position.set(x * spacing - offset, 0, z * spacing - offset);
        dummy.updateMatrix();
        instancedMeshRef.current.setMatrixAt(i++, dummy.matrix);
      }
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [preset, dummy]);

  // Animate instanced mesh based on audio data
  useFrame((state) => {
    const audioData = audioDataRef.current;
    if (!audioData || !instancedMeshRef.current) return;

    const { frequencies, average, bass, mid, treble } = audioData;
    const { gridSize, effects, sensitivity, type } = preset;
    const time = state.clock.elapsedTime;
    const count = gridSize * gridSize;

    for (let i = 0; i < count; i++) {
      // Calculate frequency band for this instance
      const frequencyIndex = Math.floor((i / count) * frequencies.length);
      const frequency = frequencies[frequencyIndex] || 0;
      const normalizedFreq = frequency / 255;

      const spacing = 0.5;
      const offset = ((gridSize - 1) * spacing) / 2;
      const x = Math.floor(i / gridSize);
      const z = i % gridSize;

      dummy.position.set(x * spacing - offset, 0, z * spacing - offset);

      // Apply scaling based on frequency and preset sensitivity
      if (effects.scaling) {
        const scaleY = 1 + normalizedFreq * 2;
        dummy.scale.set(1, scaleY, 1);
      } else {
        dummy.scale.set(1, 1, 1);
      }

      // Apply pulsing effect
      if (effects.pulsing) {
        const pulse = Math.sin(time * 4 + i * 0.1) * 0.2 + 1;
        dummy.scale.x *= pulse;
        dummy.scale.z *= pulse;
      }

      // Apply rotation based on audio
      if (effects.rotation) {
        dummy.rotation.y = time + normalizedFreq * Math.PI;
      } else {
        dummy.rotation.y = 0;
      }

      // Position modulation for wave effect
      if (type === 'waves') {
        dummy.position.y = Math.sin(time * 2 + i * 0.2) * normalizedFreq * 2;
      }

      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);

      // Color modulation based on frequency bands
      const hue =
        (bass * sensitivity.bass + mid * sensitivity.mid + treble * sensitivity.treble) / 765;
      color.setHSL(hue, 0.8, 0.6);
      instancedMeshRef.current.setColorAt(i, color);
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }

    // Group rotation (applied to the whole instanced mesh)
    if (effects.rotation) {
      instancedMeshRef.current.rotation.y = time * 0.5 + average * 0.01;
    }
  });

  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const audioData = audioDataRef.current;
    if (!audioData) return;

    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = 0.6 + (audioData.bass / 255) * 0.4;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 1 + audioData.average / 255;
    }
  });

  const geometry = useMemo(() => {
    const { type } = preset;
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
  }, [preset]);

  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(preset.colorScheme.primary),
      transparent: true,
      opacity: 0.8,
    });
  }, [preset]);

  // Clean up resources
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <>
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

    // Calculate audio metrics
    const average = frequencies.reduce((sum, value) => sum + value, 0) / frequencies.length;
    
    // Frequency bands (bass: 0-85Hz, mid: 85-255Hz, treble: 255Hz+)
    const bassEnd = Math.floor(frequencies.length * 0.1);
    const midEnd = Math.floor(frequencies.length * 0.3);
    
    const bass = frequencies.slice(0, bassEnd).reduce((sum, value) => sum + value, 0) / bassEnd;
    const mid = frequencies.slice(bassEnd, midEnd).reduce((sum, value) => sum + value, 0) / (midEnd - bassEnd);
    const treble = frequencies.slice(midEnd).reduce((sum, value) => sum + value, 0) / (frequencies.length - midEnd);

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
        audioContextRef.current.close?.();
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
