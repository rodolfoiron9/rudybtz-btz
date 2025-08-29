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
import dynamic from 'next/dynamic';

interface PresetManagerProps {
  className?: string;
}

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

// Dynamic 3D viewer component that loads only on client
const Dynamic3DViewer = dynamic(
  () => import('./dynamic-3d-component'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    )
  }
);

export default function SafePresetManager3D({ className }: PresetManagerProps) {
  const [activeTab, setActiveTab] = useState<'cubes' | 'text'>('cubes');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [customText, setCustomText] = useState('SAMPLE');
  const [audioData, setAudioData] = useState(generateMockAudioData());
  const [previewMode, setPreviewMode] = useState<'static' | 'animated'>('static');
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [presetsLoaded, setPresetsLoaded] = useState(false);
  const [presets, setPresets] = useState<any[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<any>(null);

  // Load presets dynamically
  useEffect(() => {
    const loadPresets = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const cubeModule = await import('./3d-cube-presets');
        const textModule = await import('./3d-text-presets');
        
        const cubePresets = cubeModule.cubePresets || [];
        const textPresets = textModule.textPresets || [];
        
        setPresets(activeTab === 'cubes' ? cubePresets : textPresets);
        if (cubePresets.length > 0 && activeTab === 'cubes') {
          setSelectedPreset(cubePresets[0]);
        } else if (textPresets.length > 0 && activeTab === 'text') {
          setSelectedPreset(textPresets[0]);
        }
        
        setPresetsLoaded(true);
      } catch (error) {
        console.error('Failed to load presets:', error);
        setPresetsLoaded(true);
      }
    };

    loadPresets();
  }, [activeTab]);

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

  // Filter presets based on search and category
  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         preset.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = activeTab === 'cubes' ? cubeCategories : textCategories;

  return (
    <Card className={cn('cyber-card', className)}>
      <CardHeader>
        <CardTitle className="text-xl cyber-glow flex items-center gap-2">
          <Box className="w-6 h-6" />
          3D Preset Manager
          <Badge variant="outline" className="ml-auto">
            {presetsLoaded ? `${filteredPresets.length} presets` : 'Loading...'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {!presetsLoaded ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading 3D presets...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'cubes' | 'text')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cubes" className="flex items-center gap-2">
                  <Box className="w-4 h-4" />
                  Cube Presets
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Text Presets
                </TabsTrigger>
              </TabsList>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Search Presets</Label>
                  <Input
                    placeholder="Search by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Category Filter</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-2">
                  <Button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    variant={isPlaying ? "default" : "outline"}
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Stop' : 'Preview'}
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Preview and Preset Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Preset Grid */}
                <div className="lg:col-span-2">
                  <ScrollArea className="h-96">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2">
                      {filteredPresets.map((preset, index) => (
                        <Card 
                          key={preset.id || index}
                          className={cn(
                            "cursor-pointer transition-all hover:scale-105",
                            selectedPreset?.id === preset.id && "ring-2 ring-primary"
                          )}
                          onClick={() => setSelectedPreset(preset)}
                        >
                          <CardContent className="p-3">
                            <div className="h-20 bg-black rounded-lg mb-2 overflow-hidden">
                              <div className="flex items-center justify-center h-full">
                                <p className="text-xs text-muted-foreground">Preview</p>
                              </div>
                            </div>
                            <h4 className="font-medium text-sm">{preset.name || 'Untitled'}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {preset.description || 'No description'}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Live Preview */}
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-black rounded-lg overflow-hidden">
                      {selectedPreset ? (
                        <Dynamic3DViewer 
                          preset={selectedPreset}
                          audioData={isPlaying ? audioData : null}
                          customText={activeTab === 'text' ? customText : undefined}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-sm text-muted-foreground">
                            Select a preset to preview
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {activeTab === 'text' && (
                      <div className="mt-4">
                        <Label>Custom Text</Label>
                        <Input
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          placeholder="Enter text to display..."
                          maxLength={20}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}