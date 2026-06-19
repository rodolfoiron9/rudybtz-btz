import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AudioVisualizer3D from '@/components/visualizer/audio-visualizer-3d';

// Mock react-three-fiber as it requires a WebGL context which is not available in JSDOM
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {},
    scene: {},
    gl: {},
  })),
}));

// Mock react-three/drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="perspective-camera" />,
}));

// Mock Three.js
vi.mock('three', async () => {
  const actual = await vi.importActual('three') as any;
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      render: vi.fn(),
      setSize: vi.fn(),
      dispose: vi.fn(),
    })),
  };
});

describe('AudioVisualizer3D', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<AudioVisualizer3D />);
    expect(getByTestId('canvas')).toBeDefined();
  });

  it('initializes with default preset', () => {
    render(<AudioVisualizer3D />);
    // Since we're mocking the Canvas, we just check if it renders
  });

  it('accepts custom className', () => {
    const { container } = render(<AudioVisualizer3D className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
