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

// Reuse objects to avoid GC pressure in the animation loop
const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

function VisualizerMesh({ audioDataRef, preset }: VisualizerMeshProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { gridSize, type, colorScheme } = preset;
  const count = gridSize * gridSize;

  // Create geometry and material based on preset
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

  // Initialize instances positions
  useEffect(() => {
    if (!meshRef.current) return;

    const spacing = 0.5;
    const offset = ((gridSize - 1) * spacing) / 2;
    let i = 0;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        tempObject.position.set(x * spacing - offset, 0, z * spacing - offset);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt?.(i++, tempObject.matrix);
      }
    }
    if (meshRef.current.instanceMatrix) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [gridSize]);

  // Animate meshes based on audio data (using ref to avoid re-renders)
  useFrame((state) => {
    if (!audioDataRef.current || !meshRef.current) return;

    const { frequencies, bass, mid, treble } = audioDataRef.current;
    const time = state.clock.elapsedTime;
    const spacing = 0.5;
    const offset = ((gridSize - 1) * spacing) / 2;
    let i = 0;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const id = i++;

        // Calculate frequency band for this mesh
        const frequencyIndex = Math.floor((id / count) * frequencies.length);
        const frequency = frequencies[frequencyIndex] || 0;
        const normalizedFreq = frequency / 255;

        // Reset and apply transformations
        tempObject.position.set(x * spacing - offset, 0, z * spacing - offset);
        tempObject.rotation.set(0, 0, 0);
        tempObject.scale.set(1, 1, 1);

        // Apply scaling based on frequency and preset sensitivity
        if (preset.effects.scaling) {
          const scale = 1 + normalizedFreq * 2;
          tempObject.scale.y = scale;
        }

        // Apply rotation based on audio
        if (preset.effects.rotation) {
          tempObject.rotation.y = time + normalizedFreq * Math.PI;
        }

        // Apply pulsing effect
        if (preset.effects.pulsing) {
          const pulse = Math.sin(time * 4 + id * 0.1) * 0.2 + 1;
          tempObject.scale.x = pulse;
          tempObject.scale.z = pulse;
        }

        // Position modulation for wave effect
        if (preset.type === 'waves') {
          tempObject.position.y = Math.sin(time * 2 + id * 0.2) * normalizedFreq * 2;
        }

        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(id, tempObject.matrix);

        // Color modulation based on frequency bands
        const hue = (bass * preset.sensitivity.bass + 
                     mid * preset.sensitivity.mid + 
                     treble * preset.sensitivity.treble) / 765;
        
        tempColor.setHSL(hue, 0.8, 0.6);
        meshRef.current.setColorAt(id, tempColor);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Group rotation based on overall audio level
    if (preset.effects.rotation) {
      meshRef.current.rotation.y = time * 0.5 + audioDataRef.current.average * 0.01;
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />

      <ambientLight intensity={0.4} />
      
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.6 + (audioDataRef.current?.bass || 0) / 255 * 0.4}
        color={preset.colorScheme.accent}
      />
      
      <pointLight
        position={[0, 3, 0]}
        intensity={1 + (audioDataRef.current?.average || 0) / 255}
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

    const average = frequencies.reduce((sum, value) => sum + value, 0) / frequencies.length;
    
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
    return undefined;
  }, [audioElement, initializeAudio, analyzeAudio]);

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
