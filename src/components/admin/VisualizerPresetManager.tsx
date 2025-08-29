'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Plus, 
  Save, 
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  Settings,
  Zap,
  Star,
  Copy
} from 'lucide-react';

interface VisualizerPreset {
  id: string;
  name: string;
  description: string;
  settings: {
    // Color settings
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    
    // Animation settings
    animationSpeed: number;
    sensitivity: number;
    smoothing: number;
    
    // Style settings
    visualizerType: 'bars' | 'circular' | 'wave' | 'particles' | 'spectrum';
    barCount: number;
    particleCount: number;
    glowIntensity: number;
    
    // 3D settings
    rotationSpeed: number;
    cameraDistance: number;
    fieldOfView: number;
    
    // Effects
    bloom: boolean;
    chromatic: boolean;
    distortion: boolean;
    reverb: boolean;
  };
  tags: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface VisualizerPresetManagerProps {
  presets?: VisualizerPreset[];
  currentPreset?: VisualizerPreset;
  onCreatePreset?: (preset: Partial<VisualizerPreset>) => void;
  onUpdatePreset?: (id: string, preset: Partial<VisualizerPreset>) => void;
  onDeletePreset?: (id: string) => void;
  onLoadPreset?: (preset: VisualizerPreset) => void;
  onExportPresets?: () => void;
  onImportPresets?: (file: File) => void;
}

export function VisualizerPresetManager({
  presets = [],
  currentPreset,
  onCreatePreset,
  onUpdatePreset,
  onDeletePreset,
  onLoadPreset,
  onExportPresets,
  onImportPresets
}: VisualizerPresetManagerProps) {
  const [editingPreset, setEditingPreset] = useState<Partial<VisualizerPreset> | null>(null);
  const [formData, setFormData] = useState<Partial<VisualizerPreset>>({
    name: '',
    description: '',
    tags: [],
    isDefault: false,
    settings: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#a78bfa',
      accentColor: '#c4b5fd',
      backgroundColor: '#1f2937',
      animationSpeed: 1.0,
      sensitivity: 0.8,
      smoothing: 0.7,
      visualizerType: 'bars',
      barCount: 64,
      particleCount: 100,
      glowIntensity: 0.5,
      rotationSpeed: 0.5,
      cameraDistance: 10,
      fieldOfView: 60,
      bloom: true,
      chromatic: false,
      distortion: false,
      reverb: false
    }
  });
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleTagsChange = (value: string) => {
    setTagInput(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSettingChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings!,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    const presetData: Partial<VisualizerPreset> = {
      ...formData,
      createdAt: editingPreset?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingPreset?.id) {
      onUpdatePreset?.(editingPreset.id, presetData);
    } else {
      onCreatePreset?.(presetData);
    }
    
    handleCancel();
  };

  const handleEdit = (preset: VisualizerPreset) => {
    setEditingPreset(preset);
    setFormData(preset);
    setTagInput(preset.tags.join(', '));
  };

  const handleCancel = () => {
    setEditingPreset(null);
    setFormData({
      name: '',
      description: '',
      tags: [],
      isDefault: false,
      settings: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#a78bfa',
        accentColor: '#c4b5fd',
        backgroundColor: '#1f2937',
        animationSpeed: 1.0,
        sensitivity: 0.8,
        smoothing: 0.7,
        visualizerType: 'bars',
        barCount: 64,
        particleCount: 100,
        glowIntensity: 0.5,
        rotationSpeed: 0.5,
        cameraDistance: 10,
        fieldOfView: 60,
        bloom: true,
        chromatic: false,
        distortion: false,
        reverb: false
      }
    });
    setTagInput('');
  };

  const handleDuplicate = (preset: VisualizerPreset) => {
    const duplicatedPreset = {
      ...preset,
      name: `${preset.name} (Copy)`,
      id: undefined as unknown as string,
      createdAt: undefined as unknown as Date,
      updatedAt: undefined as unknown as Date,
      isDefault: false
    };
    setFormData(duplicatedPreset);
    setTagInput(duplicatedPreset.tags?.join(', ') || '');
  };

  const getVisualizerTypeIcon = (type: string) => {
    switch (type) {
      case 'bars':
        return <div className="w-4 h-4 border-b-2 border-current" />;
      case 'circular':
        return <div className="w-4 h-4 rounded-full border-2 border-current" />;
      case 'wave':
        return <div className="w-4 h-4 border-b-2 border-current transform rotate-12" />;
      case 'particles':
        return <div className="w-4 h-4 grid grid-cols-2 gap-px"><div className="bg-current rounded-full"></div><div className="bg-current rounded-full"></div><div className="bg-current rounded-full"></div><div className="bg-current rounded-full"></div></div>;
      case 'spectrum':
        return <Palette className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Preset */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingPreset ? 'Edit Visualizer Preset' : 'Create New Preset'}
          </CardTitle>
          <CardDescription className="text-muted">
            {editingPreset ? 'Update your visualizer preset settings' : 'Create a custom visualizer preset with your preferred settings'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Preset Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Awesome Preset"
                className="dark-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="visualizerType">Visualizer Type</Label>
              <select
                id="visualizerType"
                value={formData.settings?.visualizerType || 'bars'}
                onChange={(e) => handleSettingChange('visualizerType', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                aria-label="Select visualizer type"
              >
                <option value="bars">Audio Bars</option>
                <option value="circular">Circular</option>
                <option value="wave">Wave Form</option>
                <option value="particles">Particles</option>
                <option value="spectrum">Spectrum</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your preset..."
              className="dark-input"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="electronic, ambient, energetic, bass-heavy"
              className="dark-input"
            />
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-violet-600/20 text-violet-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Color Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-violet-300 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Settings
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="primaryColor"
                    value={formData.settings?.primaryColor || '#8b5cf6'}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="w-12 h-10 p-1 border-gray-600"
                  />
                  <Input
                    value={formData.settings?.primaryColor || '#8b5cf6'}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="dark-input flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="secondaryColor"
                    value={formData.settings?.secondaryColor || '#a78bfa'}
                    onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                    className="w-12 h-10 p-1 border-gray-600"
                  />
                  <Input
                    value={formData.settings?.secondaryColor || '#a78bfa'}
                    onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                    className="dark-input flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="accentColor"
                    value={formData.settings?.accentColor || '#c4b5fd'}
                    onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                    className="w-12 h-10 p-1 border-gray-600"
                  />
                  <Input
                    value={formData.settings?.accentColor || '#c4b5fd'}
                    onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                    className="dark-input flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="backgroundColor"
                    value={formData.settings?.backgroundColor || '#1f2937'}
                    onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                    className="w-12 h-10 p-1 border-gray-600"
                  />
                  <Input
                    value={formData.settings?.backgroundColor || '#1f2937'}
                    onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                    className="dark-input flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Animation Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Animation Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="animationSpeed">Animation Speed: {formData.settings?.animationSpeed || 1.0}</Label>
                <Input
                  type="range"
                  id="animationSpeed"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={formData.settings?.animationSpeed || 1.0}
                  onChange={(e) => handleSettingChange('animationSpeed', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sensitivity">Sensitivity: {formData.settings?.sensitivity || 0.8}</Label>
                <Input
                  type="range"
                  id="sensitivity"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={formData.settings?.sensitivity || 0.8}
                  onChange={(e) => handleSettingChange('sensitivity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smoothing">Smoothing: {formData.settings?.smoothing || 0.7}</Label>
                <Input
                  type="range"
                  id="smoothing"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={formData.settings?.smoothing || 0.7}
                  onChange={(e) => handleSettingChange('smoothing', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Effects */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-300">Effects</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['bloom', 'chromatic', 'distortion', 'reverb'].map((effect) => (
                <div key={effect} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={effect}
                    checked={Boolean(formData.settings?.[effect as keyof typeof formData.settings]) || false}
                    onChange={(e) => handleSettingChange(effect, e.target.checked)}
                    className="w-4 h-4 text-violet-600 bg-gray-800 border-gray-600 rounded focus:ring-violet-500 focus:ring-2"
                    aria-label={`Enable ${effect} effect`}
                  />
                  <Label htmlFor={effect} className="capitalize">{effect}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Default preset checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault || false}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="w-4 h-4 text-violet-600 bg-gray-800 border-gray-600 rounded focus:ring-violet-500 focus:ring-2"
              aria-label="Set as default preset"
            />
            <Label htmlFor="isDefault" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Set as default preset
            </Label>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              className="bg-violet-600 hover:bg-violet-700 text-white"
              disabled={!formData.name}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingPreset ? 'Update Preset' : 'Save Preset'}
            </Button>
            {editingPreset && (
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Presets Library */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Preset Library ({presets.length} presets)
          </CardTitle>
          <CardDescription className="text-muted">
            Manage your saved visualizer presets
          </CardDescription>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={onExportPresets}
              size="sm"
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
            >
              <Download className="w-4 h-4 mr-1" />
              Export All
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file && onImportPresets) {
                    onImportPresets(file);
                  }
                };
                input.click();
              }}
            >
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {presets.length === 0 ? (
            <div className="text-center py-8">
              <Palette className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No presets created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presets.map((preset) => (
                <div key={preset.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{preset.name}</h3>
                      {preset.isDefault && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                          <Star className="w-3 h-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {getVisualizerTypeIcon(preset.settings.visualizerType)}
                      <Badge variant="outline" className="text-xs border-violet-400/30 text-violet-300">
                        {preset.settings.visualizerType}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{preset.description}</p>
                  
                  {/* Color Preview */}
                  <div className="flex gap-1 mb-3">
                    <div 
                      className="w-4 h-4 rounded border border-gray-600 bg-violet-500"
                      title="Primary Color"
                    />
                    <div 
                      className="w-4 h-4 rounded border border-gray-600 bg-violet-400"
                      title="Secondary Color"
                    />
                    <div 
                      className="w-4 h-4 rounded border border-gray-600 bg-violet-300"
                      title="Accent Color"
                    />
                  </div>
                  
                  {preset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {preset.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-violet-400/30 text-violet-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mb-3">
                    Created: {new Date(preset.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => onLoadPreset?.(preset)}
                      className="bg-violet-600 hover:bg-violet-700 text-white flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Load
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(preset)}
                      className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDuplicate(preset)}
                      className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDeletePreset?.(preset.id)}
                      className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}