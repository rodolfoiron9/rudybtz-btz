import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import AudioVisualizer3D from '@/components/visualizer/audio-visualizer-3d'
import React from 'react'

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({
    viewport: { width: 100, height: 100 },
    mouse: { x: 0, y: 0 },
  }),
}))

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="perspective-camera" />,
}))

// Mock three
vi.mock('three', async () => {
  const actual = await vi.importActual('three')
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
    })),
  }
})

describe('AudioVisualizer3D Component', () => {
  it('should render without crashing', () => {
    const mockAudioElement = document.createElement('audio')
    const { getByTestId } = render(
      <AudioVisualizer3D audioElement={mockAudioElement} />
    )

    expect(getByTestId('canvas')).toBeInTheDocument()
  })

  it('should render with different presets', () => {
    const mockAudioElement = document.createElement('audio')
    const customPreset: any = {
      name: 'Custom',
      type: 'spheres',
      gridSize: 5,
      colorScheme: {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff'
      },
      effects: {
        rotation: true,
        scaling: true,
        pulsing: true,
        particles: false
      },
      sensitivity: {
        bass: 1,
        mid: 1,
        treble: 1
      }
    }

    const { getByTestId } = render(
      <AudioVisualizer3D audioElement={mockAudioElement} preset={customPreset} />
    )

    expect(getByTestId('canvas')).toBeInTheDocument()
  })
})
