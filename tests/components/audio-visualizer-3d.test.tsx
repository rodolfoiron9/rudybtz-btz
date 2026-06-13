import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AudioVisualizer3D from '@/components/visualizer/audio-visualizer-3d';

// Mock react-three-fiber Canvas and other components
vi.mock('@react-three/fiber', async () => {
  return {
    Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
    useFrame: vi.fn(),
  };
});

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="perspective-camera" />,
}));

// Mock THREE.js components that are used via refs
// R3F usually handles this, but since we are mocking Canvas, we need to handle refs manually if they are accessed
// However, the error is because we are rendering <instancedMesh> which in our mock is just a tag,
// and it doesn't have the Three.js methods.

describe('AudioVisualizer3D', () => {
  it('renders without crashing', () => {
    // We need to suppress the error from setMatrixAt in tests since we're not in a real WebGL environment
    // or properly mock the ref.
    const { getByTestId } = render(<AudioVisualizer3D />);
    expect(getByTestId('canvas')).toBeDefined();
  });

  it('contains the 3D scene elements', () => {
    const { getByTestId } = render(<AudioVisualizer3D />);
    expect(getByTestId('perspective-camera')).toBeDefined();
    expect(getByTestId('orbit-controls')).toBeDefined();
  });
});
