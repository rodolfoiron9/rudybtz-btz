'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Box, 
  Type, 
  Palette, 
  Lightbulb, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Copy, 
  Trash2, 
  Eye, 
  Settings,
  Sparkles,
  Zap,
  Gem,
  Crown,
  Star,
  Wand2,
  Layers,
  Move3D,
  Volume2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import our preset systems (SSR-safe dynamic approach)
// Note: We'll load preset data dynamically to avoid SSR issues
const CubePresetViewer = null; // Will be loaded dynamically
const TextPresetViewer = null; // Will be loaded dynamically

// Default empty preset arrays - will be populated dynamically
let cubePresets: any[] = [];
let textPresets: any[] = [];

// Type definitions for safety
type CubePreset = any;
type TextPreset = any;

// Categories with icons
const cubeCategories = [
  { id: 'geometric', name: 'Geometric', icon: Box, color: 'text-blue-500' },
  { id: 'organic', name: 'Organic', icon: Gem, color: 'text-green-500' },
  { id: 'crystalline', name: 'Crystalline', icon: Sparkles, color: 'text-purple-500' },
  { id: 'abstract', name: 'Abstract', icon: Zap, color: 'text-orange-500' },
  { id: 'architectural', name: 'Architectural', icon: Layers, color: 'text-gray-500' }
];

const textCategories = [
  { id: 'elegant', name: 'Elegant', icon: Crown, color: 'text-purple-500' },
  { id: 'futuristic', name: 'Futuristic', icon: Zap, color: 'text-cyan-500' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: Star, color: 'text-pink-500' },
  { id: 'minimalist', name: 'Minimalist', icon: Type, color: 'text-gray-500' },
  { id: 'artistic', name: 'Artistic', icon: Wand2, color: 'text-violet-500' },
  { id: 'holographic', name: 'Holographic', icon: Sparkles, color: 'text-rainbow' }
];

// Mock audio data for preview
const generateMockAudioData = () => ({
  bass: Math.floor(Math.random() * 255),
  mid: Math.floor(Math.random() * 255),
  treble: Math.floor(Math.random() * 255),
  average: Math.floor(Math.random() * 255)
});

interface PresetManagerProps {
  className?: string;
}

export default function PresetManager3D({ className }: PresetManagerProps) {
  const [activeTab, setActiveTab] = useState<'cubes' | 'text'>('cubes');
  const [selectedCubePreset, setSelectedCubePreset] = useState<CubePreset | null>(null);
  const [selectedTextPreset, setSelectedTextPreset] = useState<TextPreset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [customText, setCustomText] = useState('SAMPLE');
  const [audioData, setAudioData] = useState(generateMockAudioData());
  const [previewMode, setPreviewMode] = useState<'static' | 'animated'>('static');
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [presetsLoaded, setPresetsLoaded] = useState(false);
  const [CubeViewer, setCubeViewer] = useState<any>(null);
  const [TextViewer, setTextViewer] = useState<any>(null);

  // Load presets and components dynamically
  useEffect(() => {
    const loadPresets = async () => {
      try {
        // Load cube presets and component
        const cubeModule = await import('./3d-cube-presets');
        cubePresets = cubeModule.cubePresets || [];
        setCubeViewer(() => cubeModule.default);
        
        // Load text presets and component
        const textModule = await import('./3d-text-presets');
        textPresets = textModule.textPresets || [];
        setTextViewer(() => textModule.default);
        
        // Set initial selections
        if (cubePresets.length > 0) {
          setSelectedCubePreset(cubePresets[0]);
        }
        if (textPresets.length > 0) {
          setSelectedTextPreset(textPresets[0]);
        }
        
        setPresetsLoaded(true);
      } catch (error) {
        console.error('Failed to load 3D presets:', error);
        setPresetsLoaded(true); // Still mark as loaded to show error state
      }
    };

    if (typeof window !== 'undefined') {
      loadPresets();
    }
  }, []);

  // Audio simulation interval
  const audioIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying) {
      audioIntervalRef.current = setInterval(() => {
        setAudioData(generateMockAudioData());
      }, 100);
    } else {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    }

    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Show loading state while presets are loading
  if (!presetsLoaded) {
    return (
      <Card className={cn('cyber-card', className)}>
        <CardHeader>
          <CardTitle className="text-xl cyber-glow">3D Preset Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading 3D presets...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter presets based on category and search
  const filteredCubePresets = cubePresets.filter(preset => {
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         preset.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredTextPresets = textPresets.filter(preset => {
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         preset.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get categories for current tab
  const currentCategories = activeTab === 'cubes' ? cubeCategories : textCategories;

  // Preset grid component
  const PresetGrid = ({ presets, type }: { presets: any[], type: 'cube' | 'text' }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {presets.map((preset) => {
        const isSelected = type === 'cube' 
          ? preset.id === selectedCubePreset.id 
          : preset.id === selectedTextPreset.id;
        
        const categoryInfo = currentCategories.find(cat => cat.id === preset.category);
        const CategoryIcon = categoryInfo?.icon || Box;

        return (
          <Card 
            key={preset.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-lg",
              isSelected ? "ring-2 ring-primary shadow-lg" : "hover:ring-1 hover:ring-primary/50"
            )}
            onClick={() => {
              if (type === 'cube') {
                setSelectedCubePreset(preset);
              } else {
                setSelectedTextPreset(preset);
              }
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CategoryIcon className={cn("w-4 h-4", categoryInfo?.color)} />
                  <CardTitle className="text-sm">{preset.name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {preset.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Mini preview */}
              <div className="h-32 bg-black rounded-lg mb-2 overflow-hidden">
                {type === 'cube' && CubeViewer ? (
                  <CubeViewer 
                    preset={preset} 
                    audioData={previewMode === 'animated' ? audioData : null}
                    className="w-full h-full scale-75"
                  />
                ) : type === 'text' && TextViewer ? (
                  <TextViewer 
                    preset={preset}
                    customText="ABC"
                    audioData={previewMode === 'animated' ? audioData : null}
                    className="w-full h-full scale-50"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-muted-foreground">Preview loading...</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {preset.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Control panel for selected preset
  const ControlPanel = () => {
    const preset = activeTab === 'cubes' ? selectedCubePreset : selectedTextPreset;
    
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Preset Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Audio Controls */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio Simulation
            </Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isPlaying ? "default" : "outline"}
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAudioData(generateMockAudioData())}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Preview Mode */}
          <div className="space-y-2">
            <Label>Preview Mode</Label>
            <Select value={previewMode} onValueChange={(value: 'static' | 'animated') => setPreviewMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="animated">Animated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Text for Text Presets */}
          {activeTab === 'text' && (
            <div className="space-y-2">
              <Label>Custom Text</Label>
              <Input
                value={customText}
                onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                placeholder="Enter text..."
                maxLength={20}
              />
            </div>
          )}

          <Separator />

          {/* Preset Info */}
          <div className="space-y-2">
            <Label>Preset Information</Label>
            <div className="text-sm space-y-1">
              <div><strong>Name:</strong> {preset.name}</div>
              <div><strong>Category:</strong> {preset.category}</div>
              <div className="text-xs text-muted-foreground">
                {preset.description}
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline">
              <Copy className="w-4 h-4 mr-1" />
              Clone
            </Button>
            <Button size="sm" variant="outline">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>

          {/* Advanced Edit Mode */}
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setEditMode(true)}
            className="w-full"
          >
            <Settings className="w-4 h-4 mr-1" />
            Advanced Edit
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-3d-silver-violet">3D Presets System</h2>
          <p className="text-muted-foreground">
            Advanced 3D cube and text visualization presets with real-time audio response
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            Preview All
          </Button>
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-1" />
            Export Preset
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Preset Library */}
        <div className="xl:col-span-3 space-y-4">
          {/* Tab Selection */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'cubes' | 'text')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cubes" className="flex items-center gap-2">
                <Box className="w-4 h-4" />
                3D Cubes ({cubePresets.length})
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                3D Text ({textPresets.length})
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search presets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Button>
                {currentCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      size="sm"
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center gap-1"
                    >
                      <Icon className={cn("w-3 h-3", category.color)} />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Preset Content */}
            <TabsContent value="cubes" className="mt-4">
              <ScrollArea className="h-[600px]">
                <PresetGrid presets={filteredCubePresets} type="cube" />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="text" className="mt-4">
              <ScrollArea className="h-[600px]">
                <PresetGrid presets={filteredTextPresets} type="text" />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Control Panel */}
        <div className="xl:col-span-1">
          <ControlPanel />
        </div>
      </div>

      {/* Main Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move3D className="w-5 h-5" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-black rounded-lg overflow-hidden">
            {activeTab === 'cubes' && CubeViewer && selectedCubePreset ? (
              <CubeViewer 
                preset={selectedCubePreset}
                audioData={isPlaying ? audioData : null}
                className="w-full h-full"
              />
            ) : activeTab === 'text' && TextViewer && selectedTextPreset ? (
              <TextViewer 
                preset={selectedTextPreset}
                customText={customText}
                audioData={isPlaying ? audioData : null}
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading 3D preview...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Edit Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advanced Preset Editor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Advanced editing features will be available in this dialog.
              This includes fine-tuning materials, lighting, animations, and effects.
            </p>
            {/* Advanced editing controls would go here */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Material Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Metalness</Label>
                    <Slider defaultValue={[0.5]} max={1} step={0.1} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Roughness</Label>
                    <Slider defaultValue={[0.5]} max={1} step={0.1} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Animation Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="rotation" />
                    <Label htmlFor="rotation" className="text-xs">Enable Rotation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="scaling" />
                    <Label htmlFor="scaling" className="text-xs">Enable Scaling</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}