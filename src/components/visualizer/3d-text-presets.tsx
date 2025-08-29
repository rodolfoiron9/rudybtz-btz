'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// 3D Text Preset Types
interface TextPreset {
  id: string;
  name: string;
  description: string;
  category: 'elegant' | 'futuristic' | 'cyberpunk' | 'minimalist' | 'artistic' | 'holographic';
  text: {
    content: string;
    font: string;
    size: number;
    height: number;
    curveSegments: number;
    bevelEnabled: boolean;
    bevelThickness: number;
    bevelSize: number;
    bevelSegments: number;
  };
  material: {
    type: 'standard' | 'phong' | 'lambert' | 'matcap' | 'shader';
    color: string;
    metalness?: number;
    roughness?: number;
    emissive?: string;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    envMapIntensity?: number;
  };
  effects: {
    gradient: {
      enabled: boolean;
      colors: string[];
      direction: 'horizontal' | 'vertical' | 'radial' | 'diagonal';
    };
    glow: {
      enabled: boolean;
      color: string;
      intensity: number;
      size: number;
    };
    outline: {
      enabled: boolean;
      color: string;
      thickness: number;
      opacity: number;
    };
    shadow: {
      enabled: boolean;
      color: string;
      blur: number;
      offset: [number, number, number];
      opacity: number;
    };
  };
  animation: {
    rotation: { x: number; y: number; z: number; speed: number };
    float: { enabled: boolean; amplitude: number; speed: number };
    pulse: { enabled: boolean; range: [number, number]; speed: number };
    wave: { enabled: boolean; amplitude: number; frequency: number; speed: number };
    typewriter: { enabled: boolean; speed: number };
  };
  lighting: {
    ambient: { intensity: number; color: string };
    directional: { intensity: number; color: string; position: [number, number, number] };
    point?: { intensity: number; color: string; position: [number, number, number] };
    spot?: { intensity: number; color: string; position: [number, number, number]; angle: number };
  };
  postProcessing: {
    bloom: { enabled: boolean; intensity: number; threshold: number };
    chromatic: { enabled: boolean; intensity: number };
    distortion: { enabled: boolean; intensity: number };
  };
}

// Predefined 3D Text Presets based on silver-violet gradient system
const textPresets: TextPreset[] = [
  // ELEGANT CATEGORY
  {
    id: 'silver-elegant',
    name: 'Silver Elegant',
    description: 'Sophisticated silver text with violet accents and soft lighting',
    category: 'elegant',
    text: {
      content: 'ELEGANT',
      font: '/fonts/helvetiker_regular.typeface.json',
      size: 1.2,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelSegments: 5
    },
    material: {
      type: 'standard',
      color: '#E5E7EB',
      metalness: 0.9,
      roughness: 0.1,
      emissive: '#8B5CF6',
      emissiveIntensity: 0.2,
      transparent: false,
      opacity: 1.0,
      envMapIntensity: 1.0
    },
    effects: {
      gradient: {
        enabled: true,
        colors: ['#F8FAFC', '#E5E7EB', '#8B5CF6'],
        direction: 'vertical'
      },
      glow: {
        enabled: true,
        color: '#8B5CF6',
        intensity: 0.5,
        size: 2.0
      },
      outline: {
        enabled: false,
        color: '#8B5CF6',
        thickness: 0.02,
        opacity: 0.8
      },
      shadow: {
        enabled: true,
        color: '#000000',
        blur: 10,
        offset: [0.1, -0.1, -0.1],
        opacity: 0.3
      }
    },
    animation: {
      rotation: { x: 0, y: 0.01, z: 0, speed: 1.0 },
      float: { enabled: true, amplitude: 0.1, speed: 2.0 },
      pulse: { enabled: false, range: [0.9, 1.1], speed: 2.0 },
      wave: { enabled: false, amplitude: 0.1, frequency: 2.0, speed: 1.0 },
      typewriter: { enabled: false, speed: 0.1 }
    },
    lighting: {
      ambient: { intensity: 0.4, color: '#ffffff' },
      directional: { intensity: 1.0, color: '#ffffff', position: [5, 5, 5] },
      point: { intensity: 0.8, color: '#8B5CF6', position: [2, 2, 3] }
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 0.5, threshold: 0.8 },
      chromatic: { enabled: false, intensity: 0.1 },
      distortion: { enabled: false, intensity: 0.05 }
    }
  },

  // FUTURISTIC CATEGORY
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'Glowing cyberpunk text with intense violet neon effects',
    category: 'cyberpunk',
    text: {
      content: 'NEON',
      font: '/fonts/helvetiker_bold.typeface.json',
      size: 1.5,
      height: 0.15,
      curveSegments: 16,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 8
    },
    material: {
      type: 'standard',
      color: '#8B5CF6',
      metalness: 0.1,
      roughness: 0.9,
      emissive: '#7C3AED',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
      envMapIntensity: 0.3
    },
    effects: {
      gradient: {
        enabled: true,
        colors: ['#7C3AED', '#8B5CF6', '#A855F7', '#C084FC'],
        direction: 'horizontal'
      },
      glow: {
        enabled: true,
        color: '#8B5CF6',
        intensity: 1.5,
        size: 3.0
      },
      outline: {
        enabled: true,
        color: '#7C3AED',
        thickness: 0.05,
        opacity: 1.0
      },
      shadow: {
        enabled: false,
        color: '#8B5CF6',
        blur: 20,
        offset: [0, 0, -0.2],
        opacity: 0.6
      }
    },
    animation: {
      rotation: { x: 0, y: 0.02, z: 0, speed: 1.5 },
      float: { enabled: false, amplitude: 0, speed: 0 },
      pulse: { enabled: true, range: [0.8, 1.2], speed: 3.0 },
      wave: { enabled: false, amplitude: 0, frequency: 0, speed: 0 },
      typewriter: { enabled: false, speed: 0 }
    },
    lighting: {
      ambient: { intensity: 0.2, color: '#8B5CF6' },
      directional: { intensity: 0.6, color: '#ffffff', position: [3, 4, 3] },
      spot: { intensity: 2.0, color: '#8B5CF6', position: [0, 5, 2], angle: 0.3 }
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 1.2, threshold: 0.4 },
      chromatic: { enabled: true, intensity: 0.3 },
      distortion: { enabled: false, intensity: 0 }
    }
  },

  // MINIMALIST CATEGORY
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Clean minimalist design with subtle silver-violet gradient',
    category: 'minimalist',
    text: {
      content: 'MINIMAL',
      font: '/fonts/helvetiker_regular.typeface.json',
      size: 1.0,
      height: 0.1,
      curveSegments: 8,
      bevelEnabled: false,
      bevelThickness: 0,
      bevelSize: 0,
      bevelSegments: 0
    },
    material: {
      type: 'lambert',
      color: '#F1F5F9',
      metalness: 0.0,
      roughness: 1.0,
      emissive: '#8B5CF6',
      emissiveIntensity: 0.1,
      transparent: false,
      opacity: 1.0
    },
    effects: {
      gradient: {
        enabled: true,
        colors: ['#F8FAFC', '#E5E7EB'],
        direction: 'diagonal'
      },
      glow: {
        enabled: false,
        color: '#8B5CF6',
        intensity: 0,
        size: 0
      },
      outline: {
        enabled: false,
        color: '#8B5CF6',
        thickness: 0,
        opacity: 0
      },
      shadow: {
        enabled: true,
        color: '#64748B',
        blur: 5,
        offset: [0.05, -0.05, -0.05],
        opacity: 0.2
      }
    },
    animation: {
      rotation: { x: 0, y: 0, z: 0, speed: 0 },
      float: { enabled: false, amplitude: 0, speed: 0 },
      pulse: { enabled: false, range: [1.0, 1.0], speed: 0 },
      wave: { enabled: false, amplitude: 0, frequency: 0, speed: 0 },
      typewriter: { enabled: false, speed: 0 }
    },
    lighting: {
      ambient: { intensity: 0.6, color: '#ffffff' },
      directional: { intensity: 0.8, color: '#ffffff', position: [2, 4, 2] }
    },
    postProcessing: {
      bloom: { enabled: false, intensity: 0, threshold: 1.0 },
      chromatic: { enabled: false, intensity: 0 },
      distortion: { enabled: false, intensity: 0 }
    }
  },

  // HOLOGRAPHIC CATEGORY
  {
    id: 'holographic-shimmer',
    name: 'Holographic Shimmer',
    description: 'Iridescent holographic text with dynamic color shifting',
    category: 'holographic',
    text: {
      content: 'HOLO',
      font: '/fonts/helvetiker_regular.typeface.json',
      size: 1.3,
      height: 0.25,
      curveSegments: 20,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 10
    },
    material: {
      type: 'standard',
      color: '#E5E7EB',
      metalness: 1.0,
      roughness: 0.0,
      emissive: '#8B5CF6',
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.95,
      envMapIntensity: 2.0
    },
    effects: {
      gradient: {
        enabled: true,
        colors: ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#8B5CF6'],
        direction: 'radial'
      },
      glow: {
        enabled: true,
        color: '#8B5CF6',
        intensity: 0.8,
        size: 2.5
      },
      outline: {
        enabled: true,
        color: '#06B6D4',
        thickness: 0.03,
        opacity: 0.6
      },
      shadow: {
        enabled: false,
        color: '#000000',
        blur: 0,
        offset: [0, 0, 0],
        opacity: 0
      }
    },
    animation: {
      rotation: { x: 0.005, y: 0.02, z: 0.01, speed: 2.0 },
      float: { enabled: true, amplitude: 0.15, speed: 1.5 },
      pulse: { enabled: true, range: [0.9, 1.1], speed: 4.0 },
      wave: { enabled: true, amplitude: 0.05, frequency: 3.0, speed: 2.0 },
      typewriter: { enabled: false, speed: 0 }
    },
    lighting: {
      ambient: { intensity: 0.3, color: '#8B5CF6' },
      directional: { intensity: 1.0, color: '#ffffff', position: [4, 6, 4] },
      point: { intensity: 1.5, color: '#06B6D4', position: [-2, 3, 2] },
      spot: { intensity: 1.8, color: '#8B5CF6', position: [0, 8, 0], angle: 0.4 }
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 1.0, threshold: 0.5 },
      chromatic: { enabled: true, intensity: 0.2 },
      distortion: { enabled: true, intensity: 0.1 }
    }
  },

  // ARTISTIC CATEGORY
  {
    id: 'liquid-metal',
    name: 'Liquid Metal',
    description: 'Flowing liquid metal text with organic deformation',
    category: 'artistic',
    text: {
      content: 'LIQUID',
      font: '/fonts/helvetiker_bold.typeface.json',
      size: 1.1,
      height: 0.3,
      curveSegments: 24,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 12
    },
    material: {
      type: 'standard',
      color: '#CBD5E1',
      metalness: 0.95,
      roughness: 0.05,
      emissive: '#7C3AED',
      emissiveIntensity: 0.25,
      transparent: false,
      opacity: 1.0,
      envMapIntensity: 1.5
    },
    effects: {
      gradient: {
        enabled: true,
        colors: ['#F8FAFC', '#CBD5E1', '#8B5CF6', '#7C3AED'],
        direction: 'vertical'
      },
      glow: {
        enabled: true,
        color: '#8B5CF6',
        intensity: 0.6,
        size: 1.8
      },
      outline: {
        enabled: false,
        color: '#8B5CF6',
        thickness: 0,
        opacity: 0
      },
      shadow: {
        enabled: true,
        color: '#000000',
        blur: 15,
        offset: [0.2, -0.2, -0.2],
        opacity: 0.4
      }
    },
    animation: {
      rotation: { x: 0.01, y: 0.015, z: 0.005, speed: 1.2 },
      float: { enabled: true, amplitude: 0.2, speed: 1.8 },
      pulse: { enabled: false, range: [1.0, 1.0], speed: 0 },
      wave: { enabled: true, amplitude: 0.08, frequency: 2.5, speed: 1.5 },
      typewriter: { enabled: false, speed: 0 }
    },
    lighting: {
      ambient: { intensity: 0.4, color: '#8B5CF6' },
      directional: { intensity: 1.1, color: '#ffffff', position: [6, 8, 6] },
      point: { intensity: 1.0, color: '#CBD5E1', position: [3, 2, 4] }
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 0.7, threshold: 0.7 },
      chromatic: { enabled: false, intensity: 0 },
      distortion: { enabled: true, intensity: 0.05 }
    }
  }
];

// 3D Text Component
interface TextVisualizerProps {
  preset: TextPreset;
  audioData?: {
    bass: number;
    mid: number;
    treble: number;
    average: number;
  } | null | undefined;
}

function TextVisualizer({ preset, audioData }: TextVisualizerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [currentText, setCurrentText] = useState(preset.text.content);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    const time = state.clock.elapsedTime;
    const audioBoost = audioData ? (audioData.average / 255) : 0.5;

    // Apply rotation animation
    const rotation = preset.animation.rotation;
    meshRef.current.rotation.x += rotation.x * rotation.speed;
    meshRef.current.rotation.y += rotation.y * rotation.speed;
    meshRef.current.rotation.z += rotation.z * rotation.speed;

    // Apply floating animation
    if (preset.animation.float.enabled) {
      const floatAmp = preset.animation.float.amplitude;
      const floatSpeed = preset.animation.float.speed;
      groupRef.current.position.y = Math.sin(time * floatSpeed + audioBoost * Math.PI) * floatAmp;
    }

    // Apply pulse animation
    if (preset.animation.pulse.enabled) {
      const pulseRange = preset.animation.pulse.range;
      const pulseSpeed = preset.animation.pulse.speed;
      const scale = pulseRange[0] + 
        (pulseRange[1] - pulseRange[0]) * 
        (Math.sin(time * pulseSpeed + audioBoost * Math.PI * 2) * 0.5 + 0.5);
      meshRef.current.scale.setScalar(scale);
    }

    // Apply wave animation
    if (preset.animation.wave.enabled && meshRef.current.geometry) {
      const waveAmp = preset.animation.wave.amplitude;
      const waveFreq = preset.animation.wave.frequency;
      const waveSpeed = preset.animation.wave.speed;
      
      // Apply wave deformation to geometry
      const geometry = meshRef.current.geometry as THREE.BufferGeometry;
      if (geometry.attributes.position) {
        const positions = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          if (x !== undefined && positions[i + 1] !== undefined) {
            const waveOffset = Math.sin(time * waveSpeed + x * waveFreq + audioBoost * Math.PI) * waveAmp;
            const currentY = positions[i + 1] as number;
            positions[i + 1] = currentY + waveOffset * 0.1; // Apply to Y coordinate
          }
        }
        geometry.attributes.position.needsUpdate = true;
      }
    }

    // Material color animation for holographic effect
    if (preset.category === 'holographic' && meshRef.current.material) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const hue = (time * 0.1 + audioBoost) % 1;
      material.color.setHSL(hue, 0.8, 0.7);
      material.emissive.setHSL(hue + 0.1, 0.9, 0.2);
    }
  });

  // Create material based on preset
  const createMaterial = () => {
    const mat = preset.material;
    
    const baseProps = {
      color: mat.color,
      transparent: mat.transparent || false,
      opacity: mat.opacity || 1.0
    };

    switch (mat.type) {
      case 'standard':
        return (
          <meshStandardMaterial 
            {...baseProps}
            metalness={mat.metalness || 0.0}
            roughness={mat.roughness || 0.5}
            emissive={mat.emissive || '#000000'}
            emissiveIntensity={mat.emissiveIntensity || 0.0}
            envMapIntensity={mat.envMapIntensity || 1.0}
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
        return (
          <meshLambertMaterial 
            {...baseProps}
            emissive={mat.emissive || '#000000'}
          />
        );
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
        castShadow
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
          castShadow
        />
      )}

      {/* Main 3D text */}
      <Center>
        <mesh ref={meshRef} castShadow receiveShadow>
          <Text3D
            font={preset.text.font}
            size={preset.text.size}
            height={preset.text.height}
            curveSegments={preset.text.curveSegments}
            bevelEnabled={preset.text.bevelEnabled}
            bevelThickness={preset.text.bevelThickness}
            bevelSize={preset.text.bevelSize}
            bevelSegments={preset.text.bevelSegments}
          >
            {currentText}
            {createMaterial()}
          </Text3D>
        </mesh>
      </Center>

      {/* Glow effect */}
      {preset.effects.glow.enabled && (
        <Center>
          <mesh scale={preset.effects.glow.size}>
            <Text3D
              font={preset.text.font}
              size={preset.text.size}
              height={0.01}
            >
              {currentText}
              <meshBasicMaterial 
                color={preset.effects.glow.color}
                transparent
                opacity={preset.effects.glow.intensity * 0.3}
              />
            </Text3D>
          </mesh>
        </Center>
      )}

      {/* Shadow plane */}
      {preset.effects.shadow.enabled && (
        <mesh 
          position={[
            preset.effects.shadow.offset[0], 
            -2 + preset.effects.shadow.offset[1], 
            preset.effects.shadow.offset[2]
          ]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color={preset.effects.shadow.color}
            transparent 
            opacity={preset.effects.shadow.opacity} 
          />
        </mesh>
      )}
    </group>
  );
}

// Main 3D Text Preset Component
interface TextPresetViewerProps {
  preset: TextPreset;
  customText?: string;
  audioData?: {
    bass: number;
    mid: number;
    treble: number;
    average: number;
  } | null | undefined;
  className?: string;
}

export default function TextPresetViewer({ 
  preset, 
  customText, 
  audioData, 
  className = "w-full h-full" 
}: TextPresetViewerProps) {
  const [currentPreset, setCurrentPreset] = useState(preset);

  // Update text content if custom text is provided
  useEffect(() => {
    if (customText) {
      setCurrentPreset(prev => ({
        ...prev,
        text: { ...prev.text, content: customText }
      }));
    }
  }, [customText]);

  return (
    <div className={className}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={3}
          maxPolarAngle={Math.PI / 2}
        />
        
        <TextVisualizer preset={currentPreset} audioData={audioData} />
        
        {/* Environment */}
        <fog attach="fog" args={['#000011', 8, 25]} />
      </Canvas>
    </div>
  );
}

export { type TextPreset, textPresets };
export type { TextPresetViewerProps };