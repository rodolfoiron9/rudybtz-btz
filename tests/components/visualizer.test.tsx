import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import AudioVisualizer3D from '@/components/visualizer/audio-visualizer-3d';
import React from 'react';

// Mock Three.js
vi.mock('three', async () => {
  const actual = await vi.importActual('three') as any;
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
    })),
  };
});

// Mock R3F
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({
    size: { width: 100, height: 100 },
    viewport: { width: 100, height: 100, factor: 1 },
  }),
}));

// Mock Drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="perspective-camera" />,
}));

describe('AudioVisualizer3D', () => {
  it('should render without crashing', () => {
    const { getByTestId } = render(<AudioVisualizer3D />);
    expect(getByTestId('canvas')).toBeInTheDocument();
  });
});
