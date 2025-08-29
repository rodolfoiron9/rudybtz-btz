// 3D Presets System Exports (SSR-safe dynamic loading)
export { default as PresetManager3D } from './preset-manager-3d-wrapper';

// Safe exports that don't cause immediate imports during SSR
export const cubePresets: any[] = [];
export const textPresets: any[] = [];
export type CubePreset = any;
export type TextPreset = any;

// Dynamic getters for client-side use
export const getCubePresets = async () => {
  if (typeof window === 'undefined') return [];
  try {
    const mod = await import('./3d-cube-presets');
    return mod.cubePresets || [];
  } catch (error) {
    console.warn('Failed to load cube presets:', error);
    return [];
  }
};

export const getTextPresets = async () => {
  if (typeof window === 'undefined') return [];
  try {
    const mod = await import('./3d-text-presets');
    return mod.textPresets || [];
  } catch (error) {
    console.warn('Failed to load text presets:', error);
    return [];
  }
};

// Preset collections for easy use
export const allPresets = {
  getCubes: getCubePresets,
  getText: getTextPresets
};

// Category mappings
export const categories = {
  cubes: [
    { id: 'geometric', name: 'Geometric' },
    { id: 'organic', name: 'Organic' },
    { id: 'crystalline', name: 'Crystalline' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'architectural', name: 'Architectural' }
  ],
  text: [
    { id: 'elegant', name: 'Elegant' },
    { id: 'futuristic', name: 'Futuristic' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'artistic', name: 'Artistic' },
    { id: 'holographic', name: 'Holographic' }
  ]
};

// Utility functions (updated for dynamic loading)
export const getPresetById = async (type: 'cube' | 'text', id: string) => {
  const presets = type === 'cube' ? await getCubePresets() : await getTextPresets();
  return presets.find((preset: any) => preset.id === id);
};

export const getPresetsByCategory = async (type: 'cube' | 'text', category: string) => {
  const presets = type === 'cube' ? await getCubePresets() : await getTextPresets();
  return presets.filter((preset: any) => preset.category === category);
};

export const createCustomPreset = (type: 'cube' | 'text', basePreset: any, overrides: any) => {
  return {
    ...basePreset,
    ...overrides,
    id: `custom-${Date.now()}`,
    name: overrides.name || `Custom ${basePreset.name}`
  };
};