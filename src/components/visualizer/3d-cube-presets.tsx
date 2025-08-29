'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// 3D Cube Preset Types
interface CubePreset {
  id: string;
  name: string;
  description: string;
  category: 'geometric' | 'organic' | 'crystalline' | 'abstract' | 'architectural';
  geometry: {
    type: 'box' | 'sphere' | 'torus' | 'octahedron' | 'icosahedron' | 'dodecahedron';
    size: [number, number, number];
    segments?: number;
    detail?: number;
  };
  material: {
    type: 'phong' | 'standard' | 'lambert' | 'toon' | 'shader';
    color: string;
    metalness?: number;
    roughness?: number;
    emissive?: string;
    transparent?: boolean;
    opacity?: number;
    wireframe?: boolean;
  };
  lighting: {
    ambient: { intensity: number; color: string };
    directional: { intensity: number; color: string; position: [number, number, number] };
    point?: { intensity: number; color: string; position: [number, number, number] };
    spot?: { intensity: number; color: string; position: [number, number, number]; angle: number };
  };
  animation: {
    rotation: { x: number; y: number; z: number; speed: number };
    scale: { enabled: boolean; range: [number, number]; speed: number };
    position: { enabled: boolean; amplitude: [number, number, number]; speed: number };
    morphing: { enabled: boolean; intensity: number; speed: number };
  };
  postProcessing: {
    bloom: { enabled: boolean; intensity: number; threshold: number };
    outline: { enabled: boolean; color: string; thickness: number };
    shadows: { enabled: boolean; type: 'hard' | 'soft'; opacity: number };
  };
}

// Predefined 3D Cube Presets
const cubePresets: CubePreset[] = [
  // GEOMETRIC CATEGORY
  {
    id: 'silver-cube-classic',
    name: 'Silver Cube Classic',
    description: 'Clean geometric cube with silver-violet metallic finish',
    category: 'geometric',
    geometry: {
      type: 'box',
      size: [2, 2, 2],
      segments: 1
    },
    material: {
      type: 'standard',
      color: '#C0C0C0',
      metalness: 0.9,
      roughness: 0.1,
      emissive: '#8B5CF6',
      transparent: false,
      opacity: 1.0
    },
    lighting: {
      ambient: { intensity: 0.3, color: '#ffffff' },
      directional: { intensity: 1.0, color: '#8B5CF6', position: [5, 5, 5] },
      point: { intensity: 0.8, color: '#C0C0C0', position: [2, 4, 2] }
    },
    animation: {
      rotation: { x: 0.01, y: 0.02, z: 0, speed: 1.0 },
      scale: { enabled: true, range: [0.8, 1.2], speed: 2.0 },
      position: { enabled: false, amplitude: [0, 0, 0], speed: 1.0 },
      morphing: { enabled: false, intensity: 0, speed: 1.0 }
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 0.5, threshold: 0.8 },
      outline: { enabled: false, color: '#8B5CF6', thickness: 2 },
      shadows: { enabled: true, type: 'soft', opacity: 0.3 }
    }
  },
  {
    id: 'violet-octahedron',
    name: 'Violet Octahedron',
    description: 'Crystalline octahedron with violet energy core',
    category: 'crystalline',
    geometry: {
      type: 'octahedron',
      size: [1.5, 1.5, 1.5],
      detail: 2
    },
    material: {
      type: 'phong',
      color: '#8B5CF6',
      metalness: 0.7,
      roughness: 0.2,
      emissive: '#4C1D95',
      transparent: true,
      opacity: 0.85
    },
    lighting: {
      ambient: { intensity: 0.4, color: '#8B5CF6' },
      directional: { intensity: 1.2, color: '#ffffff', position: [3, 6, 3] },
      point: { intensity: 1.0, color: '#8B5CF6', position: [0, 0, 0] }
    },
    animation: {
      rotation: { x: 0.02, y: 0.03, z: 0.01, speed: 1.5 },
      scale: { enabled: true, range: [0.9, 1.3], speed: 3.0 },
      position: { enabled: true, amplitude: [0, 0.5, 0], speed: 2.0 },
      morphing: { enabled: true, intensity: 0.2, speed: 2.5 }
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 0.8, threshold: 0.6 },
      outline: { enabled: true, color: '#8B5CF6', thickness: 1 },
      shadows: { enabled: true, type: 'soft', opacity: 0.4 }
    }
  },
  {
    id: 'holographic-torus',
    name: 'Holographic Torus',
    description: 'Futuristic torus with holographic silver-violet shimmer',
    category: 'abstract',
    geometry: {
      type: 'torus',
      size: [1.8, 0.6, 32],
      segments: 64
    },
    material: {
      type: 'shader',
      color: '#E5E7EB',
      metalness: 1.0,
      roughness: 0.0,
      emissive: '#8B5CF6',
      transparent: true,
      opacity: 0.9,
      wireframe: false
    },
    lighting: {
      ambient: { intensity: 0.2, color: '#8B5CF6' },
      directional: { intensity: 0.8, color: '#ffffff', position: [4, 4, 4] },
      spot: { intensity: 2.0, color: '#8B5CF6', position: [0, 5, 0], angle: 0.5 }
    },
    animation: {
      rotation: { x: 0.01, y: 0.04, z: 0.02, speed: 2.0 },
      scale: { enabled: true, range: [0.7, 1.4], speed: 1.5 },
      position: { enabled: true, amplitude: [0.3, 0.2, 0.3], speed: 1.8 },
      morphing: { enabled: true, intensity: 0.3, speed: 3.0 }
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 1.2, threshold: 0.4 },
      outline: { enabled: true, color: '#C0C0C0', thickness: 3 },
      shadows: { enabled: false, type: 'soft', opacity: 0.2 }
    }
  },
  // ORGANIC CATEGORY
  {
    id: 'liquid-sphere',
    name: 'Liquid Silver Sphere',
    description: 'Organic sphere with liquid metal surface effects',
    category: 'organic',
    geometry: {
      type: 'sphere',
      size: [1.8, 1.8, 1.8],
      segments: 64
    },
    material: {
      type: 'standard',
      color: '#F8FAFC',
      metalness: 0.95,
      roughness: 0.05,
      emissive: '#8B5CF6',
      transparent: false,
      opacity: 1.0
    },
    lighting: {
      ambient: { intensity: 0.3, color: '#8B5CF6' },
      directional: { intensity: 1.0, color: '#ffffff', position: [2, 8, 2] },
      point: { intensity: 1.5, color: '#C0C0C0', position: [-2, 2, 3] }
    },
    animation: {
      rotation: { x: 0.005, y: 0.01, z: 0.008, speed: 0.8 },
      scale: { enabled: true, range: [0.85, 1.15], speed: 2.5 },
      position: { enabled: true, amplitude: [0.1, 0.3, 0.1], speed: 1.2 },
      morphing: { enabled: true, intensity: 0.4, speed: 1.5 }
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 0.6, threshold: 0.7 },
      outline: { enabled: false, color: '#8B5CF6', thickness: 1 },
      shadows: { enabled: true, type: 'soft', opacity: 0.5 }
    }
  },
  // ARCHITECTURAL CATEGORY
  {
    id: 'crystal-tower',
    name: 'Crystal Tower',
    description: 'Architectural crystal structure with violet energy',
    category: 'architectural',
    geometry: {
      type: 'box',
      size: [1.2, 3.5, 1.2],
      segments: 1
    },
    material: {
      type: 'phong',
      color: '#F1F5F9',
      metalness: 0.8,
      roughness: 0.15,
      emissive: '#7C3AED',
      transparent: true,
      opacity: 0.9
    },
    lighting: {
      ambient: { intensity: 0.4, color: '#8B5CF6' },
      directional: { intensity: 1.1, color: '#ffffff', position: [5, 10, 5] },
      spot: { intensity: 3.0, color: '#8B5CF6', position: [0, 8, 0], angle: 0.3 }
    },
    animation: {
      rotation: { x: 0, y: 0.015, z: 0, speed: 1.0 },
      scale: { enabled: true, range: [0.9, 1.1], speed: 4.0 },
      position: { enabled: true, amplitude: [0, 0.8, 0], speed: 3.0 },
      morphing: { enabled: false, intensity: 0, speed: 1.0 }
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 0.9, threshold: 0.5 },
      outline: { enabled: true, color: '#8B5CF6', thickness: 2 },
      shadows: { enabled: true, type: 'hard', opacity: 0.6 }
    }
  }
];

// 3D Cube Component
interface CubeVisualizerProps {
  preset: CubePreset;
  audioData?: {
    bass: number;
    mid: number;
    treble: number;
    average: number;
  } | null | undefined;
}

function CubeVisualizer({ preset, audioData }: CubeVisualizerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    const time = state.clock.elapsedTime;
    const audioBoost = audioData ? (audioData.average / 255) : 0.5;

    // Apply rotation animation
    const rotation = preset.animation.rotation;
    meshRef.current.rotation.x += rotation.x * rotation.speed;
    meshRef.current.rotation.y += rotation.y * rotation.speed;
    meshRef.current.rotation.z += rotation.z * rotation.speed;

    // Apply scale animation
    if (preset.animation.scale.enabled) {
      const scaleRange = preset.animation.scale.range;
      const scaleSpeed = preset.animation.scale.speed;
      const scale = scaleRange[0] + 
        (scaleRange[1] - scaleRange[0]) * 
        (Math.sin(time * scaleSpeed + audioBoost * Math.PI) * 0.5 + 0.5);
      meshRef.current.scale.setScalar(scale);
    }

    // Apply position animation
    if (preset.animation.position.enabled) {
      const posAmp = preset.animation.position.amplitude;
      const posSpeed = preset.animation.position.speed;
      groupRef.current.position.x = Math.sin(time * posSpeed) * posAmp[0];
      groupRef.current.position.y = Math.sin(time * posSpeed * 0.7) * posAmp[1];
      groupRef.current.position.z = Math.cos(time * posSpeed * 0.5) * posAmp[2];
    }

    // Apply morphing effects
    if (preset.animation.morphing.enabled && meshRef.current.geometry) {
      const intensity = preset.animation.morphing.intensity;
      const speed = preset.animation.morphing.speed;
      // Custom morphing logic based on geometry type
      if (preset.geometry.type === 'sphere') {
        const geometry = meshRef.current.geometry as THREE.BufferGeometry;
        if (geometry.attributes.position) {
          // Apply vertex displacement for organic morphing
          geometry.attributes.position.needsUpdate = true;
        }
      }
    }
  });

  // Create geometry based on preset
  const createGeometry = () => {
    const { type, size, segments, detail } = preset.geometry;
    
    switch (type) {
      case 'sphere':
        return <sphereGeometry args={[size[0], segments || 32, segments || 16]} />;
      case 'torus':
        return <torusGeometry args={[size[0], size[1], segments || 16, size[2] || 100]} />;
      case 'octahedron':
        return <octahedronGeometry args={[size[0], detail || 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[size[0], detail || 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[size[0], detail || 0]} />;
      default:
        return <boxGeometry args={size} />;
    }
  };

  // Create material based on preset
  const createMaterial = () => {
    const mat = preset.material;
    
    const baseProps = {
      color: mat.color,
      transparent: mat.transparent || false,
      opacity: mat.opacity || 1.0,
      wireframe: mat.wireframe || false
    };

    switch (mat.type) {
      case 'standard':
        return (
          <meshStandardMaterial 
            {...baseProps}
            metalness={mat.metalness || 0.0}
            roughness={mat.roughness || 0.5}
            emissive={mat.emissive || '#000000'}
          />
        );
      case 'phong':
        return (
          <meshPhongMaterial 
            {...baseProps}
            emissive={mat.emissive || '#000000'}
            shininess={100 - (mat.roughness || 0.5) * 100}
          />
        );
      case 'lambert':
        return <meshLambertMaterial {...baseProps} emissive={mat.emissive || '#000000'} />;
      case 'toon':
        return <meshToonMaterial {...baseProps} />;
      default:
        return <meshStandardMaterial {...baseProps} />;
    }
  };

  return (
    <group ref={groupRef}>
      {/* Lighting setup */}
      <ambientLight 
        intensity={preset.lighting.ambient.intensity} 
        color={preset.lighting.ambient.color} 
      />
      <directionalLight
        intensity={preset.lighting.directional.intensity}
        color={preset.lighting.directional.color}
        position={preset.lighting.directional.position}
        castShadow={preset.postProcessing.shadows.enabled}
      />
      {preset.lighting.point && (
        <pointLight
          intensity={preset.lighting.point.intensity}
          color={preset.lighting.point.color}
          position={preset.lighting.point.position}
        />
      )}
      {preset.lighting.spot && (
        <spotLight
          intensity={preset.lighting.spot.intensity}
          color={preset.lighting.spot.color}
          position={preset.lighting.spot.position}
          angle={preset.lighting.spot.angle}
          castShadow={preset.postProcessing.shadows.enabled}
        />
      )}

      {/* Main mesh */}
      <mesh ref={meshRef} castShadow receiveShadow>
        {createGeometry()}
        {createMaterial()}
      </mesh>

      {/* Ground plane for shadows */}
      {preset.postProcessing.shadows.enabled && (
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            transparent 
            opacity={preset.postProcessing.shadows.opacity} 
          />
        </mesh>
      )}
    </group>
  );
}

// Main 3D Cube Preset Component
interface CubePresetViewerProps {
  preset: CubePreset;
  audioData?: {
    bass: number;
    mid: number;
    treble: number;
    average: number;
  } | null | undefined;
  className?: string;
}

export default function CubePresetViewer({ preset, audioData, className = "w-full h-full" }: CubePresetViewerProps) {
  return (
    <div className={className}>
      <Canvas shadows={preset.postProcessing.shadows.enabled}>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxDistance={15}
          minDistance={2}
          maxPolarAngle={Math.PI / 2}
        />
        
        <CubeVisualizer preset={preset} audioData={audioData} />
        
        {/* Environment */}
        <fog attach="fog" args={['#000000', 5, 15]} />
      </Canvas>
    </div>
  );
}

export { type CubePreset, cubePresets };
export type { CubePresetViewerProps };