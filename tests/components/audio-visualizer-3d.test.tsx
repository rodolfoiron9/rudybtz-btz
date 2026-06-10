import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AudioVisualizer3D from '@/components/visualizer/audio-visualizer-3d';
import React from 'react';

// Mock R3F Canvas since it needs WebGL
vi.mock('@react-three/fiber', async () => {
  const actual = await vi.importActual('@react-three/fiber');
  return {
    ...actual,
    Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
    useFrame: vi.fn(),
  };
});

// Mock Drei components
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="perspective-camera" />,
}));

describe('AudioVisualizer3D', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<AudioVisualizer3D />);
    expect(getByTestId('canvas')).toBeDefined();
  });
});
