import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import AudioVisualizer3D from '@/components/visualizer/audio-visualizer-3d'
import React from 'react'

// Mock R3F Canvas to avoid WebGL errors in JSDOM
vi.mock('@react-three/fiber', async () => {
  const actual = await vi.importActual('@react-three/fiber')
  return {
    ...actual,
    Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
    useFrame: vi.fn(),
    useThree: () => ({
      camera: {},
      scene: { add: vi.fn(), remove: vi.fn() },
      gl: {},
    }),
  }
})

// Mock R3F Drei components
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="perspective-camera" />,
}))

describe('AudioVisualizer3D Component', () => {
  it('should render without crashing', () => {
    const { getByTestId } = render(<AudioVisualizer3D />)
    expect(getByTestId('canvas')).toBeInTheDocument()
  })

  it('should initialize audio when audioElement is provided', () => {
    const audioElement = document.createElement('audio')
    render(<AudioVisualizer3D audioElement={audioElement} />)

    // Check if AudioContext was called (it's mocked in setup.ts)
    expect(window.AudioContext).toHaveBeenCalled()
  })
})
