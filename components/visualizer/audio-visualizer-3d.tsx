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
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const [meshes, setMeshes] = useState<THREE.Mesh[]>([]);

  // Initialize meshes based on preset
  useEffect(() => {
    if (!groupRef.current) return;

    // Clear existing meshes
    groupRef.current.clear();
    meshRefs.current = [];

    const newMeshes: THREE.Mesh[] = [];
    const { gridSize, type, colorScheme } = preset;

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

    // Create grid of meshes
    const spacing = 0.5;
    const offset = (gridSize - 1) * spacing / 2;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const mesh = new THREE.Mesh(geometry, material.clone());
        mesh.position.set(
          x * spacing - offset,
          0,
          z * spacing - offset
        );
        
        groupRef.current.add(mesh);
        newMeshes.push(mesh);
        meshRefs.current.push(mesh);
      }
    }

    setMeshes(newMeshes);

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [preset]);

  // Animate meshes based on audio data
  useFrame((state) => {
    if (!audioData || !groupRef.current) return;

    const { frequencies, average, bass, mid, treble } = audioData;
    const time = state.clock.elapsedTime;

    meshRefs.current.forEach((mesh, index) => {
      if (!mesh) return;

      // Calculate frequency band for this mesh
      const frequencyIndex = Math.floor((index / meshRefs.current.length) * frequencies.length);
      const frequency = frequencies[frequencyIndex] || 0;
      const normalizedFreq = frequency / 255;

      // Apply scaling based on frequency and preset sensitivity
      if (preset.effects.scaling) {
        const scale = 1 + normalizedFreq * 2;
        mesh.scale.setY(scale);
      }

      // Apply rotation based on audio
      if (preset.effects.rotation) {
        mesh.rotation.y = time + normalizedFreq * Math.PI;
      }

      // Apply pulsing effect
      if (preset.effects.pulsing) {
        const pulse = Math.sin(time * 4 + index * 0.1) * 0.2 + 1;
        mesh.scale.setX(pulse);
        mesh.scale.setZ(pulse);
      }

      // Color modulation based on frequency bands
      const material = mesh.material as THREE.MeshPhongMaterial;
      if (material) {
        const hue = (bass * preset.sensitivity.bass + 
                     mid * preset.sensitivity.mid + 
                     treble * preset.sensitivity.treble) / 765; // Max value for RGB
        
        material.color.setHSL(hue, 0.8, 0.6);
        material.emissive.setHSL(hue, 0.5, normalizedFreq * 0.3);
      }

      // Position modulation for wave effect
      if (preset.type === 'waves') {
        mesh.position.y = Math.sin(time * 2 + index * 0.2) * normalizedFreq * 2;
      }
    });

    // Group rotation based on overall audio level
    if (preset.effects.rotation) {
      groupRef.current.rotation.y = time * 0.5 + average * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
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