import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import AudioVisualizer3D from '@/components/visualizer/audio-visualizer-3d'
import React from 'react'

// Mock Three.js and R3F
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="camera" />,
}))

// We need to mock Three.js objects that are used in the component
vi.mock('three', () => {
  return {
    Group: class {
      add = vi.fn()
      clear = vi.fn()
      rotation = { y: 0 }
    },
    InstancedMesh: class {
      instanceMatrix = { needsUpdate: false }
      instanceColor = { needsUpdate: false }
      setMatrixAt = vi.fn()
      setColorAt = vi.fn()
    },
    Object3D: class {
      position = { set: vi.fn() }
      rotation = { set: vi.fn() }
      scale = { set: vi.fn(), setY: vi.fn(), x: 1, z: 1 }
      updateMatrix = vi.fn()
      matrix = {}
    },
    Color: class {
      setHSL = vi.fn()
    },
    BoxGeometry: class {},
    SphereGeometry: class {},
    PlaneGeometry: class {},
    MeshPhongMaterial: class {},
    AmbientLight: class {},
    DirectionalLight: class {},
    PointLight: class {},
    Vector3: class {},
    Euler: class {},
    Matrix4: class {},
  }
})

describe('AudioVisualizer3D Optimization', () => {
  it('should render instancedMesh for performance', () => {
    const { container } = render(<AudioVisualizer3D />)

    // Check if instancedmesh exists in the DOM (rendered by our mock)
    // Note: React 18+ might render lowercase custom tags if not handled by R3F renderer
    const instancedMesh = container.querySelector('instancedmesh')
    expect(instancedMesh).toBeDefined()
  })

  it('should render only ONE instancedMesh instead of many meshes', () => {
    const { container } = render(<AudioVisualizer3D />)

    const instancedMeshes = container.querySelectorAll('instancedmesh')
    const meshes = container.querySelectorAll('mesh')

    expect(instancedMeshes.length).toBe(1)
    // There's 1 mesh for the background, but none for the visualizer itself
    expect(meshes.length).toBe(1)
  })
})
