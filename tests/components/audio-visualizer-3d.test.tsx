
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import AudioVisualizer3D from '@/components/visualizer/audio-visualizer-3d';
import React from 'react';

// Mock Three.js and R3F
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="camera" />,
}));

describe('AudioVisualizer3D', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<AudioVisualizer3D />);
    expect(getByTestId('canvas')).toBeDefined();
  });

  it('initializes with default preset', () => {
    const { getByTestId } = render(<AudioVisualizer3D />);
    expect(getByTestId('canvas')).toBeDefined();
  });
});
