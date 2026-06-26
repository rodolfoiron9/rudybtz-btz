import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import AudioVisualizer3D from '@/components/visualizer/audio-visualizer-3d';
import React from 'react';

// Mock Three.js and R3F
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  PerspectiveCamera: () => null,
}));

describe('AudioVisualizer3D', () => {
  it('renders without crashing', () => {
    const { container } = render(<AudioVisualizer3D />);
    expect(container).toBeDefined();
  });
});
