'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Type, 
  Layout, 
  Settings, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Download, 
  Upload, 
  Save, 
  RotateCcw, 
  Eye, 
  Layers,
  Sliders,
  Grid,
  Box,
  Paintbrush,
  Image,
  Zap,
  Globe,
  FileCode,
  Copy,
  Check
} from 'lucide-react';

interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

interface TypographySettings {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing: string;
}

interface LayoutSettings {
  containerWidth: string;
  spacing: string;
  borderRadius: string;
  gridColumns: number;
  sidebar: boolean;
}

interface PageCustomization {
  pageId: string;
  pageName: string;
  enabled: boolean;
  colorPalette?: ColorPalette;
  typography?: TypographySettings;
  layout?: LayoutSettings;
  customCSS?: string;
}

const CustomizationManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('colors');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Global Settings
  const [globalColors, setGlobalColors] = useState<ColorPalette>({
    id: 'global',
    name: 'Global Palette',
    primary: '#8B5CF6',
    secondary: '#A855F7',
    accent: '#C084FC',
    background: '#0F0F23',
    foreground: '#FFFFFF',
    muted: '#6B7280',
    border: '#374151'
  });

  const [globalTypography, setGlobalTypography] = useState<TypographySettings>({
    fontFamily: 'Inter',
    fontSize: '16px',
    lineHeight: '1.6',
    fontWeight: '400',
    letterSpacing: '0'
  });

  const [globalLayout, setGlobalLayout] = useState<LayoutSettings>({
    containerWidth: '1200px',
    spacing: '1rem',
    borderRadius: '8px',
    gridColumns: 12,
    sidebar: true
  });

  // Page-specific customizations
  const [pageCustomizations, setPageCustomizations] = useState<PageCustomization[]>([
    {
      pageId: 'home',
      pageName: 'Homepage',
      enabled: false
    },
    {
      pageId: 'about',
      pageName: 'About Page',
      enabled: false
    },
    {
      pageId: 'projects',
      pageName: 'Projects',
      enabled: false
    },
    {
      pageId: 'blog',
      pageName: 'Blog',
      enabled: false
    },
    {
      pageId: 'contact',
      pageName: 'Contact',
      enabled: false
    }
  ]);

  const [selectedPage, setSelectedPage] = useState<string>('global');
  const [customCSS, setCustomCSS] = useState('');

  // Predefined color palettes
  const colorPalettes: ColorPalette[] = [
    {
      id: 'silver-violet',
      name: 'Silver Violet (Current)',
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#C084FC',
      background: '#0F0F23',
      foreground: '#FFFFFF',
      muted: '#6B7280',
      border: '#374151'
    },
    {
      id: 'ocean-breeze',
      name: 'Ocean Breeze',
      primary: '#0EA5E9',
      secondary: '#0284C7',
      accent: '#38BDF8',
      background: '#0C1222',
      foreground: '#FFFFFF',
      muted: '#64748B',
      border: '#334155'
    },
    {
      id: 'sunset-glow',
      name: 'Sunset Glow',
      primary: '#F59E0B',
      secondary: '#EAB308',
      accent: '#FDE047',
      background: '#1C1917',
      foreground: '#FFFFFF',
      muted: '#78716C',
      border: '#44403C'
    },
    {
      id: 'forest-dark',
      name: 'Forest Dark',
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      background: '#0F1419',
      foreground: '#FFFFFF',
      muted: '#6B7280',
      border: '#374151'
    },
    {
      id: 'crimson-night',
      name: 'Crimson Night',
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F87171',
      background: '#1F1315',
      foreground: '#FFFFFF',
      muted: '#6B7280',
      border: '#374151'
    }
  ];

  // Font options
  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
    'Poppins', 'Source Sans Pro', 'Ubuntu', 'Nunito', 'Raleway',
    'JetBrains Mono', 'Fira Code', 'Source Code Pro'
  ];

  // Generate CSS from current settings
  const generateCSS = () => {
    const palette = selectedPage === 'global' ? globalColors : 
                   pageCustomizations.find(p => p.pageId === selectedPage)?.colorPalette || globalColors;
    
    const typography = selectedPage === 'global' ? globalTypography : 
                      pageCustomizations.find(p => p.pageId === selectedPage)?.typography || globalTypography;
    
    const layout = selectedPage === 'global' ? globalLayout : 
                  pageCustomizations.find(p => p.pageId === selectedPage)?.layout || globalLayout;

    return `
/* Generated CSS - ${selectedPage === 'global' ? 'Global' : selectedPage} Settings */
:root {
  /* Colors */
  --primary: ${palette.primary};
  --secondary: ${palette.secondary};
  --accent: ${palette.accent};
  --background: ${palette.background};
  --foreground: ${palette.foreground};
  --muted: ${palette.muted};
  --border: ${palette.border};
  
  /* Typography */
  --font-family: ${typography.fontFamily}, sans-serif;
  --font-size: ${typography.fontSize};
  --line-height: ${typography.lineHeight};
  --font-weight: ${typography.fontWeight};
  --letter-spacing: ${typography.letterSpacing};
  
  /* Layout */
  --container-width: ${layout.containerWidth};
  --spacing: ${layout.spacing};
  --border-radius: ${layout.borderRadius};
  --grid-columns: ${layout.gridColumns};
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: var(--line-height);
  font-weight: var(--font-weight);
  letter-spacing: var(--letter-spacing);
  background-color: var(--background);
  color: var(--foreground);
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: var(--spacing);
}

.grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: var(--spacing);
}

/* Custom CSS */
${customCSS}
    `.trim();
  };

  // Copy CSS to clipboard
  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy CSS:', err);
    }
  };

  // Apply palette
  const applyPalette = (palette: ColorPalette) => {
    if (selectedPage === 'global') {
      setGlobalColors(palette);
    } else {
      setPageCustomizations(prev => 
        prev.map(page => 
          page.pageId === selectedPage 
            ? { ...page, colorPalette: palette, enabled: true }
            : page
        )
      );
    }
  };

  // Save configuration
  const saveConfiguration = () => {
    const config = {
      global: {
        colors: globalColors,
        typography: globalTypography,
        layout: globalLayout
      },
      pages: pageCustomizations,
      customCSS
    };
    
    // In a real app, this would save to a backend
    localStorage.setItem('customization-config', JSON.stringify(config));
    console.log('Configuration saved:', config);
  };

  // Load configuration
  const loadConfiguration = () => {
    const saved = localStorage.getItem('customization-config');
    if (saved) {
      const config = JSON.parse(saved);
      setGlobalColors(config.global.colors);
      setGlobalTypography(config.global.typography);
      setGlobalLayout(config.global.layout);
      setPageCustomizations(config.pages || []);
      setCustomCSS(config.customCSS || '');
    }
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  const getCurrentPalette = () => {
    if (selectedPage === 'global') return globalColors;
    return pageCustomizations.find(p => p.pageId === selectedPage)?.colorPalette || globalColors;
  };

  const getCurrentTypography = () => {
    if (selectedPage === 'global') return globalTypography;
    return pageCustomizations.find(p => p.pageId === selectedPage)?.typography || globalTypography;
  };

  const getCurrentLayout = () => {
    if (selectedPage === 'global') return globalLayout;
    return pageCustomizations.find(p => p.pageId === selectedPage)?.layout || globalLayout;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-3d-silver-violet silver-violet">Customization Studio</h2>
          <p className="text-muted mt-1">Complete UI customization with global and page-specific settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="cyber-button-secondary"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewMode ? 'Exit Preview' : 'Preview Mode'}
          </Button>
          <Button onClick={saveConfiguration} className="cyber-button-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Page Selector */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Customization Scope
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedPage === 'global' ? 'default' : 'outline'}
              onClick={() => setSelectedPage('global')}
              className="cyber-button-primary"
            >
              <Settings className="w-4 h-4 mr-2" />
              Global Settings
            </Button>
            {pageCustomizations.map((page) => (
              <Button
                key={page.pageId}
                variant={selectedPage === page.pageId ? 'default' : 'outline'}
                onClick={() => setSelectedPage(page.pageId)}
                className={page.enabled ? 'cyber-button-primary' : 'cyber-button-secondary'}
              >
                {page.enabled && <Zap className="w-4 h-4 mr-1" />}
                {page.pageName}
              </Button>
            ))}
          </div>
          {selectedPage !== 'global' && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Page-Specific Customization</h4>
                  <p className="text-sm text-muted">
                    Override global settings for this page only
                  </p>
                </div>
                <Switch
                  checked={pageCustomizations.find(p => p.pageId === selectedPage)?.enabled || false}
                  onCheckedChange={(checked) => 
                    setPageCustomizations(prev => 
                      prev.map(page => 
                        page.pageId === selectedPage 
                          ? { ...page, enabled: checked }
                          : page
                      )
                    )
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Controls */}
      {isPreviewMode && (
        <Card className="cyber-card border-blue-500/50 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-500 text-white">Preview Mode</Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted">
                Previewing: {selectedPage === 'global' ? 'Global Settings' : 
                          pageCustomizations.find(p => p.pageId === selectedPage)?.pageName}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Controls */}
        <div className="col-span-8">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>Customization Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-6">
                  {/* Color Palettes */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Predefined Palettes</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {colorPalettes.map((palette) => (
                        <div
                          key={palette.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-gray-600 ${
                            getCurrentPalette().id === palette.id 
                              ? 'border-blue-500 bg-blue-500/10' 
                              : 'border-gray-700 bg-gray-800/50'
                          }`}
                          onClick={() => applyPalette(palette)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-white">{palette.name}</h4>
                              <div className="flex gap-2 mt-2">
                                <div 
                                  className="w-6 h-6 rounded border border-gray-600"
                                  style={{ backgroundColor: palette.primary }}
                                />
                                <div 
                                  className="w-6 h-6 rounded border border-gray-600"
                                  style={{ backgroundColor: palette.secondary }}
                                />
                                <div 
                                  className="w-6 h-6 rounded border border-gray-600"
                                  style={{ backgroundColor: palette.accent }}
                                />
                                <div 
                                  className="w-6 h-6 rounded border border-gray-600"
                                  style={{ backgroundColor: palette.background }}
                                />
                              </div>
                            </div>
                            {getCurrentPalette().id === palette.id && (
                              <Check className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Custom Colors</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(getCurrentPalette()).map(([key, value]) => {
                        if (key === 'id' || key === 'name') return null;
                        return (
                          <div key={key}>
                            <Label className="capitalize">{key}</Label>
                            <div className="flex gap-2 mt-1">
                              <div 
                                className="w-10 h-10 rounded border border-gray-600"
                                style={{ backgroundColor: value }}
                              />
                              <Input
                                type="color"
                                value={value}
                                onChange={(e) => {
                                  const newPalette = { ...getCurrentPalette(), [key]: e.target.value };
                                  applyPalette(newPalette);
                                }}
                                className="w-20"
                              />
                              <Input
                                value={value}
                                onChange={(e) => {
                                  const newPalette = { ...getCurrentPalette(), [key]: e.target.value };
                                  applyPalette(newPalette);
                                }}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <Select 
                        value={getCurrentTypography().fontFamily}
                        onValueChange={(value) => {
                          const newTypography = { ...getCurrentTypography(), fontFamily: value };
                          if (selectedPage === 'global') {
                            setGlobalTypography(newTypography);
                          } else {
                            setPageCustomizations(prev => 
                              prev.map(page => 
                                page.pageId === selectedPage 
                                  ? { ...page, typography: newTypography, enabled: true }
                                  : page
                              )
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map(font => (
                            <SelectItem key={font} value={font}>{font}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select 
                        value={getCurrentTypography().fontSize}
                        onValueChange={(value) => {
                          const newTypography = { ...getCurrentTypography(), fontSize: value };
                          if (selectedPage === 'global') {
                            setGlobalTypography(newTypography);
                          } else {
                            setPageCustomizations(prev => 
                              prev.map(page => 
                                page.pageId === selectedPage 
                                  ? { ...page, typography: newTypography, enabled: true }
                                  : page
                              )
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12px">12px</SelectItem>
                          <SelectItem value="14px">14px</SelectItem>
                          <SelectItem value="16px">16px</SelectItem>
                          <SelectItem value="18px">18px</SelectItem>
                          <SelectItem value="20px">20px</SelectItem>
                          <SelectItem value="24px">24px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="lineHeight">Line Height</Label>
                      <Select 
                        value={getCurrentTypography().lineHeight}
                        onValueChange={(value) => {
                          const newTypography = { ...getCurrentTypography(), lineHeight: value };
                          if (selectedPage === 'global') {
                            setGlobalTypography(newTypography);
                          } else {
                            setPageCustomizations(prev => 
                              prev.map(page => 
                                page.pageId === selectedPage 
                                  ? { ...page, typography: newTypography, enabled: true }
                                  : page
                              )
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.2">1.2</SelectItem>
                          <SelectItem value="1.4">1.4</SelectItem>
                          <SelectItem value="1.6">1.6</SelectItem>
                          <SelectItem value="1.8">1.8</SelectItem>
                          <SelectItem value="2.0">2.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="fontWeight">Font Weight</Label>
                      <Select 
                        value={getCurrentTypography().fontWeight}
                        onValueChange={(value) => {
                          const newTypography = { ...getCurrentTypography(), fontWeight: value };
                          if (selectedPage === 'global') {
                            setGlobalTypography(newTypography);
                          } else {
                            setPageCustomizations(prev => 
                              prev.map(page => 
                                page.pageId === selectedPage 
                                  ? { ...page, typography: newTypography, enabled: true }
                                  : page
                              )
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">Light (300)</SelectItem>
                          <SelectItem value="400">Normal (400)</SelectItem>
                          <SelectItem value="500">Medium (500)</SelectItem>
                          <SelectItem value="600">Semibold (600)</SelectItem>
                          <SelectItem value="700">Bold (700)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Typography Preview */}
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle>Typography Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        style={{
                          fontFamily: getCurrentTypography().fontFamily,
                          fontSize: getCurrentTypography().fontSize,
                          lineHeight: getCurrentTypography().lineHeight,
                          fontWeight: getCurrentTypography().fontWeight,
                          letterSpacing: getCurrentTypography().letterSpacing
                        }}
                      >
                        <h1 className="text-3xl font-bold mb-4">Heading 1 Example</h1>
                        <h2 className="text-2xl font-semibold mb-3">Heading 2 Example</h2>
                        <p className="mb-4">
                          This is a paragraph example to show how your typography settings will look. 
                          The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, 
                          consectetur adipiscing elit.
                        </p>
                        <p className="text-sm text-muted">
                          Small text example for captions and metadata.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="layout" className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="containerWidth">Container Width</Label>
                      <Select 
                        value={getCurrentLayout().containerWidth}
                        onValueChange={(value) => {
                          const newLayout = { ...getCurrentLayout(), containerWidth: value };
                          if (selectedPage === 'global') {
                            setGlobalLayout(newLayout);
                          } else {
                            setPageCustomizations(prev => 
                              prev.map(page => 
                                page.pageId === selectedPage 
                                  ? { ...page, layout: newLayout, enabled: true }
                                  : page
                              )
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1024px">1024px</SelectItem>
                          <SelectItem value="1200px">1200px</SelectItem>
                          <SelectItem value="1400px">1400px</SelectItem>
                          <SelectItem value="100%">Full Width</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="spacing">Base Spacing</Label>
                      <Select 
                        value={getCurrentLayout().spacing}
                        onValueChange={(value) => {
                          const newLayout = { ...getCurrentLayout(), spacing: value };
                          if (selectedPage === 'global') {
                            setGlobalLayout(newLayout);
                          } else {
                            setPageCustomizations(prev => 
                              prev.map(page => 
                                page.pageId === selectedPage 
                                  ? { ...page, layout: newLayout, enabled: true }
                                  : page
                              )
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5rem">0.5rem</SelectItem>
                          <SelectItem value="1rem">1rem</SelectItem>
                          <SelectItem value="1.5rem">1.5rem</SelectItem>
                          <SelectItem value="2rem">2rem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="borderRadius">Border Radius</Label>
                      <Select 
                        value={getCurrentLayout().borderRadius}
                        onValueChange={(value) => {
                          const newLayout = { ...getCurrentLayout(), borderRadius: value };
                          if (selectedPage === 'global') {
                            setGlobalLayout(newLayout);
                          } else {
                            setPageCustomizations(prev => 
                              prev.map(page => 
                                page.pageId === selectedPage 
                                  ? { ...page, layout: newLayout, enabled: true }
                                  : page
                              )
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0px">0px (Square)</SelectItem>
                          <SelectItem value="4px">4px</SelectItem>
                          <SelectItem value="8px">8px</SelectItem>
                          <SelectItem value="12px">12px</SelectItem>
                          <SelectItem value="16px">16px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="gridColumns">Grid Columns</Label>
                      <Select 
                        value={getCurrentLayout().gridColumns.toString()}
                        onValueChange={(value) => {
                          const newLayout = { ...getCurrentLayout(), gridColumns: parseInt(value) };
                          if (selectedPage === 'global') {
                            setGlobalLayout(newLayout);
                          } else {
                            setPageCustomizations(prev => 
                              prev.map(page => 
                                page.pageId === selectedPage 
                                  ? { ...page, layout: newLayout, enabled: true }
                                  : page
                              )
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">8 Columns</SelectItem>
                          <SelectItem value="12">12 Columns</SelectItem>
                          <SelectItem value="16">16 Columns</SelectItem>
                          <SelectItem value="24">24 Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <Label>Enable Sidebar</Label>
                      <p className="text-sm text-muted">Show sidebar navigation</p>
                    </div>
                    <Switch
                      checked={getCurrentLayout().sidebar}
                      onCheckedChange={(checked) => {
                        const newLayout = { ...getCurrentLayout(), sidebar: checked };
                        if (selectedPage === 'global') {
                          setGlobalLayout(newLayout);
                        } else {
                          setPageCustomizations(prev => 
                            prev.map(page => 
                              page.pageId === selectedPage 
                                ? { ...page, layout: newLayout, enabled: true }
                                : page
                            )
                          );
                        }
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                  <div>
                    <Label htmlFor="customCSS">Custom CSS</Label>
                    <Textarea
                      id="customCSS"
                      value={customCSS}
                      onChange={(e) => setCustomCSS(e.target.value)}
                      placeholder="/* Add your custom CSS here */&#10;.custom-class {&#10;  color: var(--primary);&#10;}"
                      rows={15}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted mt-1">
                      Use CSS custom properties like var(--primary) to reference your color palette
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCustomCSS('')}
                      className="cyber-button-secondary"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear CSS
                    </Button>
                    <Button
                      variant="outline"
                      onClick={copyCSS}
                      className="cyber-button-secondary"
                    >
                      {copySuccess ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copySuccess ? 'Copied!' : 'Copy CSS'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="export" className="space-y-6">
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileCode className="w-5 h-5" />
                        Generated CSS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={generateCSS()}
                        readOnly
                        rows={20}
                        className="font-mono text-sm"
                      />
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={copyCSS}
                          className="cyber-button-primary"
                        >
                          {copySuccess ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          {copySuccess ? 'Copied!' : 'Copy CSS'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const blob = new Blob([generateCSS()], { type: 'text/css' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${selectedPage}-styles.css`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="cyber-button-secondary"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download CSS
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="col-span-4">
          <Card className="cyber-card sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`border border-gray-600 rounded-lg overflow-hidden transition-all ${
                  previewMode === 'mobile' ? 'max-w-xs mx-auto' :
                  previewMode === 'tablet' ? 'max-w-md mx-auto' :
                  'w-full'
                }`}
                style={{
                  backgroundColor: getCurrentPalette().background,
                  color: getCurrentPalette().foreground,
                  fontFamily: getCurrentTypography().fontFamily,
                  fontSize: '12px', // Scaled down for preview
                  lineHeight: getCurrentTypography().lineHeight
                }}
              >
                {/* Preview Header */}
                <div 
                  className="p-3 border-b"
                  style={{ 
                    borderColor: getCurrentPalette().border,
                    backgroundColor: getCurrentPalette().background 
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: getCurrentPalette().primary }}
                    />
                    <span className="font-medium">Your Website</span>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-3 space-y-3">
                  <div>
                    <h3 
                      className="font-bold text-lg"
                      style={{ color: getCurrentPalette().primary }}
                    >
                      Sample Heading
                    </h3>
                    <p style={{ color: getCurrentPalette().muted }}>
                      This is how your content will look with the current settings.
                    </p>
                  </div>

                  <div 
                    className="p-2 rounded"
                    style={{ 
                      backgroundColor: getCurrentPalette().accent + '20',
                      border: `1px solid ${getCurrentPalette().accent}50`
                    }}
                  >
                    <div 
                      className="text-xs font-medium mb-1"
                      style={{ color: getCurrentPalette().accent }}
                    >
                      Card Component
                    </div>
                    <div className="text-xs">Sample card content</div>
                  </div>

                  <div className="flex gap-2">
                    <div 
                      className="px-2 py-1 rounded text-xs"
                      style={{ 
                        backgroundColor: getCurrentPalette().primary,
                        color: getCurrentPalette().background 
                      }}
                    >
                      Primary Button
                    </div>
                    <div 
                      className="px-2 py-1 rounded text-xs border"
                      style={{ 
                        borderColor: getCurrentPalette().border,
                        color: getCurrentPalette().foreground 
                      }}
                    >
                      Secondary Button
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Scope:</span>
                  <span className="text-white">
                    {selectedPage === 'global' ? 'Global' : 
                     pageCustomizations.find(p => p.pageId === selectedPage)?.pageName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Preview:</span>
                  <span className="text-white capitalize">{previewMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Font:</span>
                  <span className="text-white">{getCurrentTypography().fontFamily}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomizationManager;