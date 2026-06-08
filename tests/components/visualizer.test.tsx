import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AudioVisualizer3D from '../../components/visualizer/audio-visualizer-3d';

// Mock R3F and Canvas since they need WebGL
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({ size: { width: 100, height: 100 } }),
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
});
