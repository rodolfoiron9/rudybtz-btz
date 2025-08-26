'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Sparkles, Eye, Settings, Play, Palette, Boxes, Monitor } from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import type { VisualizerPreset } from '@/lib/types';

export default function VisualizerTab() {
  const [presets, setPresets] = useState<VisualizerPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<VisualizerPreset | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    settings: {
      backgroundColor: '#000000',
      primaryColor: '#8B5CF6',
      secondaryColor: '#06B6D4',
      particleCount: 1000,
      sensitivity: 0.5,
      speed: 1.0,
      geometry: 'spheres',
      animation: 'wave',
      reactive: true,
      bloomEffect: true,
      postProcessing: true
    }
  });

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    // Mock data for now - will connect to Firebase later
    setPresets([
      {
        id: '1',
        name: 'Cyberpunk Sphere',
        description: 'Neon spheres with cyberpunk aesthetics and reactive audio visualization',
        settings: {
          backgroundColor: '#000814',
          primaryColor: '#8B5CF6',
          secondaryColor: '#06B6D4',
          particleCount: 1500,
          sensitivity: 0.7,
          speed: 1.2,
          geometry: 'spheres',
          animation: 'wave',
          reactive: true,
          bloomEffect: true,
          postProcessing: true
        },
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Ambient Cubes',
        description: 'Floating cubes with smooth ambient movements for atmospheric tracks',
        settings: {
          backgroundColor: '#001122',
          primaryColor: '#10B981',
          secondaryColor: '#F59E0B',
          particleCount: 800,
          sensitivity: 0.4,
          speed: 0.8,
          geometry: 'cubes',
          animation: 'orbit',
          reactive: true,
          bloomEffect: false,
          postProcessing: true
        },
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (selectedPreset) {
        // Update preset logic
        console.log('Updating preset:', formData);
      } else {
        // Create new preset logic
        console.log('Creating preset:', formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadPresets();
    } catch (error) {
      console.error('Error saving preset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (preset: VisualizerPreset) => {
    setSelectedPreset(preset);
    setFormData({
      name: preset.name,
      description: preset.description || '',
      settings: preset.settings
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this visualizer preset?')) {
      try {
        // Delete logic
        console.log('Deleting preset:', id);
        await loadPresets();
      } catch (error) {
        console.error('Error deleting preset:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedPreset(null);
    setFormData({
      name: '',
      description: '',
      settings: {
        backgroundColor: '#000000',
        primaryColor: '#8B5CF6',
        secondaryColor: '#06B6D4',
        particleCount: 1000,
        sensitivity: 0.5,
        speed: 1.0,
        geometry: 'spheres',
        animation: 'wave',
        reactive: true,
        bloomEffect: true,
        postProcessing: true
      }
    });
  };

  const generateWithAI = async () => {
    setIsLoading(true);
    try {
      const presetName = formData.name || 'AI Generated Preset';
      const description = formData.description || 'AI generated visualizer preset with optimal settings for electronic music';
      
      const response = await aiService.generateVisualizerPreset(presetName, description);
      
      if (response.success && response.data) {
        setFormData(prev => ({
          ...prev,
          ...response.data
        }));
      } else {
        throw new Error(response.error || 'Failed to generate preset');
      }
    } catch (error) {
      console.error('Failed to generate visualizer preset:', error);
      alert('Failed to generate preset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const previewPreset = (preset: VisualizerPreset) => {
    alert(`🎵 Preview Mode\n\nPreset: ${preset.name}\n\nThis will open a full-screen 3D visualizer preview with the selected settings.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">3D Audio Visualizer</h2>
          <p className="text-gray-400">Create stunning 3D visualizations that react to your music</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-cyan-400 text-cyan-400">
            <Monitor className="w-4 h-4 mr-2" />
            Preview Mode
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-violet-600 hover:bg-violet-700">
                <Plus className="w-4 h-4 mr-2" />
                New Preset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedPreset ? 'Edit Visualizer Preset' : 'Create Visualizer Preset'}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedPreset 
                    ? 'Modify your 3D visualizer settings' 
                    : 'Design a new 3D audio visualization preset'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Preset Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="e.g., Cyberpunk Sphere, Ambient Waves..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Describe the visual style and mood..."
                      required
                    />
                  </div>
                </div>

                {/* Visual Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Visual Settings</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="backgroundColor" className="text-white">Background Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={formData.settings.backgroundColor}
                          onChange={(e) => setFormData({
                            ...formData, 
                            settings: {...formData.settings, backgroundColor: e.target.value}
                          })}
                          className="w-16 h-10 bg-gray-700 border-gray-600"
                          title="Background color picker"
                        />
                        <Input
                          value={formData.settings.backgroundColor}
                          onChange={(e) => setFormData({
                            ...formData, 
                            settings: {...formData.settings, backgroundColor: e.target.value}
                          })}
                          className="flex-1 bg-gray-700 border-gray-600 text-white"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="primaryColor" className="text-white">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={formData.settings.primaryColor}
                          onChange={(e) => setFormData({
                            ...formData, 
                            settings: {...formData.settings, primaryColor: e.target.value}
                          })}
                          className="w-16 h-10 bg-gray-700 border-gray-600"
                          title="Primary color picker"
                        />
                        <Input
                          value={formData.settings.primaryColor}
                          onChange={(e) => setFormData({
                            ...formData, 
                            settings: {...formData.settings, primaryColor: e.target.value}
                          })}
                          className="flex-1 bg-gray-700 border-gray-600 text-white"
                          placeholder="#8B5CF6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="geometry" className="text-white">Geometry Type</Label>
                      <select
                        id="geometry"
                        value={formData.settings.geometry}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, geometry: e.target.value}
                        })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        title="Select geometry type for visualization"
                      >
                        <option value="spheres">Spheres</option>
                        <option value="cubes">Cubes</option>
                        <option value="particles">Particles</option>
                        <option value="waves">Waves</option>
                        <option value="rings">Rings</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="animation" className="text-white">Animation Type</Label>
                      <select
                        id="animation"
                        value={formData.settings.animation}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, animation: e.target.value}
                        })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        title="Select animation type for visualization"
                      >
                        <option value="wave">Wave</option>
                        <option value="orbit">Orbit</option>
                        <option value="pulse">Pulse</option>
                        <option value="spiral">Spiral</option>
                        <option value="random">Random</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Audio Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Audio Reactivity</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="particleCount" className="text-white">Particle Count</Label>
                      <Input
                        id="particleCount"
                        type="number"
                        value={formData.settings.particleCount}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, particleCount: parseInt(e.target.value)}
                        })}
                        className="bg-gray-700 border-gray-600 text-white"
                        min="100"
                        max="5000"
                        step="100"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sensitivity" className="text-white">Sensitivity</Label>
                      <Input
                        id="sensitivity"
                        type="number"
                        value={formData.settings.sensitivity}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, sensitivity: parseFloat(e.target.value)}
                        })}
                        className="bg-gray-700 border-gray-600 text-white"
                        min="0.1"
                        max="2.0"
                        step="0.1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="speed" className="text-white">Animation Speed</Label>
                      <Input
                        id="speed"
                        type="number"
                        value={formData.settings.speed}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, speed: parseFloat(e.target.value)}
                        })}
                        className="bg-gray-700 border-gray-600 text-white"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                {/* Effects */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Visual Effects</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="reactive"
                        checked={formData.settings.reactive}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, reactive: e.target.checked}
                        })}
                        className="w-4 h-4 text-violet-600"
                        aria-describedby="reactive-desc"
                      />
                      <Label htmlFor="reactive" className="text-white">Audio Reactive</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="bloomEffect"
                        checked={formData.settings.bloomEffect}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, bloomEffect: e.target.checked}
                        })}
                        className="w-4 h-4 text-violet-600"
                        aria-describedby="bloom-desc"
                      />
                      <Label htmlFor="bloomEffect" className="text-white">Bloom Effect</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="postProcessing"
                        checked={formData.settings.postProcessing}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, postProcessing: e.target.checked}
                        })}
                        className="w-4 h-4 text-violet-600"
                        aria-describedby="processing-desc"
                      />
                      <Label htmlFor="postProcessing" className="text-white">Post Processing</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-600 text-gray-300"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={generateWithAI}
                    className="bg-gradient-to-r from-violet-600 to-cyan-600"
                    disabled={isLoading}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                  </Button>
                  <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isLoading}>
                    {isLoading ? 'Saving...' : selectedPreset ? 'Update Preset' : 'Create Preset'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presets.map((preset) => (
          <Card key={preset.id} className="bg-gray-800/50 border-gray-700 hover:border-violet-500/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>{preset.name}</span>
                    {preset.isDefault && (
                      <Badge variant="secondary" className="bg-violet-600 text-white">Default</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {preset.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Color Preview */}
              <div className="flex space-x-2">
                <div 
                  className={`w-8 h-8 rounded border-2 border-gray-600 bg-gray-900`}
                  title={`Background: ${preset.settings.backgroundColor}`}
                />
                <div 
                  className={`w-8 h-8 rounded border-2 border-gray-600 bg-violet-600`}
                  title={`Primary: ${preset.settings.primaryColor}`}
                />
                <div 
                  className={`w-8 h-8 rounded border-2 border-gray-600 bg-cyan-600`}
                  title={`Secondary: ${preset.settings.secondaryColor}`}
                />
              </div>

              {/* Settings Preview */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Boxes className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-300 capitalize">{preset.settings.geometry}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Play className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-300 capitalize">{preset.settings.animation}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Settings className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-300">{preset.settings.particleCount} particles</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Palette className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-300">
                    {preset.settings.bloomEffect ? 'Bloom' : 'Standard'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => previewPreset(preset)}
                  className="border-cyan-400 text-cyan-400"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(preset)}
                    className="border-gray-600 text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {!preset.isDefault && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(preset.id)}
                      className="border-red-600 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Features Preview */}
      <Card className="bg-gradient-to-r from-violet-900/30 to-cyan-900/30 border-violet-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>AI Visualizer Enhancement</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Upcoming AI features for automatic visualizer creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2">Genre Analysis</h4>
              <p className="text-gray-300 text-sm">AI creates presets optimized for your music genre</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-violet-400 font-semibold mb-2">Color Extraction</h4>
              <p className="text-gray-300 text-sm">Extract color palettes from your album artwork</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">Audio Optimization</h4>
              <p className="text-gray-300 text-sm">Analyze audio frequency patterns for perfect reactivity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}