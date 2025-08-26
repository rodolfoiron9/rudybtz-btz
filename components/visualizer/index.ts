export { default as AudioVisualizer3D, type VisualizerPreset } from './audio-visualizer-3d';
export { default as VisualizerPlayer } from './visualizer-player';

// Preset collections for easy use
export const presets = {
  electronic: {
    name: 'Electronic',
    type: 'cubes' as const,
    gridSize: 10,
    colorScheme: {
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      accent: '#F59E0B'
    },
    effects: {
      rotation: true,
      scaling: true,
      pulsing: true,
      particles: false
    },
    sensitivity: {
      bass: 1.5,
      mid: 1.0,
      treble: 0.8
    }
  },
  
  ambient: {
    name: 'Ambient',
    type: 'spheres' as const,
    gridSize: 6,
    colorScheme: {
      primary: '#10B981',
      secondary: '#3B82F6',
      accent: '#8B5CF6'
    },
    effects: {
      rotation: true,
      scaling: false,
      pulsing: true,
      particles: true
    },
    sensitivity: {
      bass: 0.8,
      mid: 1.2,
      treble: 1.0
    }
  },
  
  heavy: {
    name: 'Heavy',
    type: 'cubes' as const,
    gridSize: 12,
    colorScheme: {
      primary: '#EF4444',
      secondary: '#F59E0B',
      accent: '#DC2626'
    },
    effects: {
      rotation: false,
      scaling: true,
      pulsing: false,
      particles: false
    },
    sensitivity: {
      bass: 2.0,
      mid: 1.0,
      treble: 0.5
    }
  },
  
  wave: {
    name: 'Wave',
    type: 'waves' as const,
    gridSize: 8,
    colorScheme: {
      primary: '#06B6D4',
      secondary: '#0EA5E9',
      accent: '#0284C7'
    },
    effects: {
      rotation: false,
      scaling: false,
      pulsing: true,
      particles: false
    },
    sensitivity: {
      bass: 1.0,
      mid: 1.5,
      treble: 1.2
    }
  }
};