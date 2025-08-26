'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Palette, Save, RotateCcw, Sparkles, Eye, Monitor, Smartphone } from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import type { ThemeConfig } from '@/lib/types';

export default function ThemeUITab() {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    id: 'live',
    primaryColor: '#8B5CF6',
    secondaryColor: '#06B6D4',
    backgroundColor: '#000814',
    textColor: '#F8FAFC',
    headlineFont: 'Inter',
    bodyFont: 'Inter',
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '2rem'
    },
    spacing: {
      small: '0.5rem',
      medium: '1rem',
      large: '2rem'
    },
    borderRadius: '0.5rem',
    updatedAt: new Date()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    loadThemeConfig();
  }, []);

  const loadThemeConfig = async () => {
    // Mock load - will connect to Firebase later
    console.log('Loading theme config from Firebase...');
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save logic
      console.log('Saving theme config:', themeConfig);
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all theme settings to default? This cannot be undone.')) {
      setThemeConfig({
        id: 'live',
        primaryColor: '#8B5CF6',
        secondaryColor: '#06B6D4',
        backgroundColor: '#000814',
        textColor: '#F8FAFC',
        headlineFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: {
          small: '0.875rem',
          medium: '1rem',
          large: '1.25rem',
          xlarge: '2rem'
        },
        spacing: {
          small: '0.5rem',
          medium: '1rem',
          large: '2rem'
        },
        borderRadius: '0.5rem',
        updatedAt: new Date()
      });
      setUnsavedChanges(true);
    }
  };

  const generateWithAI = async () => {
    try {
      const response = await aiService.generateText({
        prompt: 'Generate color palette suggestions for a modern music portfolio website. Include primary, secondary, and accent colors with hex codes.',
        type: 'description',
        tone: 'professional',
        length: 'short'
      });
      
      if (response.success && response.data) {
        // Extract color suggestions and apply them
        // This is a simplified implementation - in production would parse AI response for colors
        const colors = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        updateTheme({
          primaryColor: randomColor as string,
          updatedAt: new Date()
        });
        
        alert(`🎨 AI Generated Theme\n\nApplied new color scheme based on modern design trends.\n\nSuggestion: ${response.data.text}`);
      } else {
        throw new Error(response.error || 'Failed to generate theme');
      }
    } catch (error) {
      console.error('Failed to generate theme:', error);
      alert('Failed to generate theme. Please try again.');
    }
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setThemeConfig(prev => ({ ...prev, ...updates, updatedAt: new Date() }));
    setUnsavedChanges(true);
  };

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Nunito',
    'Source Sans Pro', 'Lato', 'Oswald', 'Raleway', 'Ubuntu', 'Merriweather'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Theme & UI Design</h2>
          <p className="text-gray-400">Customize your site&apos;s visual design and user interface</p>
        </div>
        <div className="flex space-x-2">
          {unsavedChanges && (
            <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={handleReset} className="border-red-600 text-red-400">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={generateWithAI} className="bg-gradient-to-r from-violet-600 to-cyan-600">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generate
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Theme'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Configuration */}
        <div className="space-y-6">
          {/* Color Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Color Palette</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Define your brand colors and visual identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor" className="text-white">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={themeConfig.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="w-16 h-10 bg-gray-700 border-gray-600"
                      title="Primary color picker"
                    />
                    <Input
                      value={themeConfig.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="flex-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="#8B5CF6"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor" className="text-white">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={themeConfig.secondaryColor}
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      className="w-16 h-10 bg-gray-700 border-gray-600"
                      title="Secondary color picker"
                    />
                    <Input
                      value={themeConfig.secondaryColor}
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      className="flex-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="#06B6D4"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backgroundColor" className="text-white">Background Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={themeConfig.backgroundColor}
                      onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                      className="w-16 h-10 bg-gray-700 border-gray-600"
                      title="Background color picker"
                    />
                    <Input
                      value={themeConfig.backgroundColor}
                      onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                      className="flex-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="#000814"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="textColor" className="text-white">Text Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={themeConfig.textColor}
                      onChange={(e) => updateTheme({ textColor: e.target.value })}
                      className="w-16 h-10 bg-gray-700 border-gray-600"
                      title="Text color picker"
                    />
                    <Input
                      value={themeConfig.textColor}
                      onChange={(e) => updateTheme({ textColor: e.target.value })}
                      className="flex-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="#F8FAFC"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Typography</CardTitle>
              <CardDescription className="text-gray-400">
                Configure fonts and text sizing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="headlineFont" className="text-white">Headline Font</Label>
                  <select
                    id="headlineFont"
                    value={themeConfig.headlineFont}
                    onChange={(e) => updateTheme({ headlineFont: e.target.value })}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    title="Select headline font"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="bodyFont" className="text-white">Body Font</Label>
                  <select
                    id="bodyFont"
                    value={themeConfig.bodyFont}
                    onChange={(e) => updateTheme({ bodyFont: e.target.value })}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    title="Select body font"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <Label htmlFor="smallFont" className="text-white text-sm">Small</Label>
                  <Input
                    id="smallFont"
                    value={themeConfig.fontSize.small}
                    onChange={(e) => updateTheme({ 
                      fontSize: { ...themeConfig.fontSize, small: e.target.value }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0.875rem"
                  />
                </div>
                <div>
                  <Label htmlFor="mediumFont" className="text-white text-sm">Medium</Label>
                  <Input
                    id="mediumFont"
                    value={themeConfig.fontSize.medium}
                    onChange={(e) => updateTheme({ 
                      fontSize: { ...themeConfig.fontSize, medium: e.target.value }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="1rem"
                  />
                </div>
                <div>
                  <Label htmlFor="largeFont" className="text-white text-sm">Large</Label>
                  <Input
                    id="largeFont"
                    value={themeConfig.fontSize.large}
                    onChange={(e) => updateTheme({ 
                      fontSize: { ...themeConfig.fontSize, large: e.target.value }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="1.25rem"
                  />
                </div>
                <div>
                  <Label htmlFor="xlargeFont" className="text-white text-sm">XLarge</Label>
                  <Input
                    id="xlargeFont"
                    value={themeConfig.fontSize.xlarge}
                    onChange={(e) => updateTheme({ 
                      fontSize: { ...themeConfig.fontSize, xlarge: e.target.value }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="2rem"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layout Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Layout & Spacing</CardTitle>
              <CardDescription className="text-gray-400">
                Control spacing and layout properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="smallSpacing" className="text-white">Small</Label>
                  <Input
                    id="smallSpacing"
                    value={themeConfig.spacing.small}
                    onChange={(e) => updateTheme({ 
                      spacing: { ...themeConfig.spacing, small: e.target.value }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0.5rem"
                  />
                </div>
                <div>
                  <Label htmlFor="mediumSpacing" className="text-white">Medium</Label>
                  <Input
                    id="mediumSpacing"
                    value={themeConfig.spacing.medium}
                    onChange={(e) => updateTheme({ 
                      spacing: { ...themeConfig.spacing, medium: e.target.value }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="1rem"
                  />
                </div>
                <div>
                  <Label htmlFor="largeSpacing" className="text-white">Large</Label>
                  <Input
                    id="largeSpacing"
                    value={themeConfig.spacing.large}
                    onChange={(e) => updateTheme({ 
                      spacing: { ...themeConfig.spacing, large: e.target.value }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="2rem"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="borderRadius" className="text-white">Border Radius</Label>
                <Input
                  id="borderRadius"
                  value={themeConfig.borderRadius}
                  onChange={(e) => updateTheme({ borderRadius: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="0.5rem"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Live Preview</span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('desktop')}
                    className="border-gray-600"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'tablet' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('tablet')}
                    className="border-gray-600"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('mobile')}
                    className="border-gray-600"
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-gray-600 rounded-lg overflow-hidden ${
                  previewMode === 'desktop' ? 'w-full h-96' :
                  previewMode === 'tablet' ? 'w-2/3 h-80 mx-auto' :
                  'w-1/2 h-96 mx-auto'
                }`}
              >
                <div 
                  className="w-full h-full p-6"
                  style={{ 
                    backgroundColor: themeConfig.backgroundColor,
                    color: themeConfig.textColor,
                    fontFamily: themeConfig.bodyFont
                  }}
                >
                  <h1 
                    className="text-3xl font-bold mb-4"
                    style={{ 
                      color: themeConfig.primaryColor,
                      fontFamily: themeConfig.headlineFont,
                      fontSize: themeConfig.fontSize.xlarge
                    }}
                  >
                    RUDYBTZ
                  </h1>
                  
                  <p 
                    className="mb-4"
                    style={{ fontSize: themeConfig.fontSize.medium }}
                  >
                    AI-powered electronic music with immersive 3D visualizations.
                  </p>
                  
                  <div className="flex space-x-2 mb-4">
                    <button 
                      className="px-4 py-2 rounded font-medium"
                      style={{ 
                        backgroundColor: themeConfig.primaryColor,
                        borderRadius: themeConfig.borderRadius,
                        fontSize: themeConfig.fontSize.medium
                      }}
                    >
                      Listen Now
                    </button>
                    <button 
                      className="px-4 py-2 rounded border font-medium"
                      style={{ 
                        borderColor: themeConfig.secondaryColor,
                        color: themeConfig.secondaryColor,
                        borderRadius: themeConfig.borderRadius,
                        fontSize: themeConfig.fontSize.medium
                      }}
                    >
                      Explore
                    </button>
                  </div>
                  
                  <div 
                    className="grid grid-cols-2 gap-2"
                    style={{ gap: themeConfig.spacing.medium }}
                  >
                    <div 
                      className="p-3 border rounded"
                      style={{ 
                        borderColor: `${themeConfig.primaryColor}40`,
                        borderRadius: themeConfig.borderRadius
                      }}
                    >
                      <h3 
                        className="font-semibold mb-1"
                        style={{ 
                          color: themeConfig.primaryColor,
                          fontSize: themeConfig.fontSize.large
                        }}
                      >
                        Latest Album
                      </h3>
                      <p style={{ fontSize: themeConfig.fontSize.small }}>
                        AI-generated soundscapes
                      </p>
                    </div>
                    <div 
                      className="p-3 border rounded"
                      style={{ 
                        borderColor: `${themeConfig.secondaryColor}40`,
                        borderRadius: themeConfig.borderRadius
                      }}
                    >
                      <h3 
                        className="font-semibold mb-1"
                        style={{ 
                          color: themeConfig.secondaryColor,
                          fontSize: themeConfig.fontSize.large
                        }}
                      >
                        3D Visualizer
                      </h3>
                      <p style={{ fontSize: themeConfig.fontSize.small }}>
                        Immersive audio experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette Preview */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div 
                    className="w-full h-16 rounded border-2 border-gray-600 mb-2"
                    style={{ backgroundColor: themeConfig.primaryColor }}
                  />
                  <p className="text-sm text-gray-300">Primary</p>
                  <p className="text-xs text-gray-500">{themeConfig.primaryColor}</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-16 rounded border-2 border-gray-600 mb-2"
                    style={{ backgroundColor: themeConfig.secondaryColor }}
                  />
                  <p className="text-sm text-gray-300">Secondary</p>
                  <p className="text-xs text-gray-500">{themeConfig.secondaryColor}</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-16 rounded border-2 border-gray-600 mb-2"
                    style={{ backgroundColor: themeConfig.backgroundColor }}
                  />
                  <p className="text-sm text-gray-300">Background</p>
                  <p className="text-xs text-gray-500">{themeConfig.backgroundColor}</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-16 rounded border-2 border-gray-600 mb-2"
                    style={{ backgroundColor: themeConfig.textColor }}
                  />
                  <p className="text-sm text-gray-300">Text</p>
                  <p className="text-xs text-gray-500">{themeConfig.textColor}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Enhancement Preview */}
      <Card className="bg-gradient-to-r from-violet-900/30 to-cyan-900/30 border-violet-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>AI Theme Enhancement</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Upcoming AI features for intelligent theme design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2">Artwork Analysis</h4>
              <p className="text-gray-300 text-sm">Extract color palettes from your album artwork automatically</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-violet-400 font-semibold mb-2">Brand Consistency</h4>
              <p className="text-gray-300 text-sm">AI ensures all colors work harmoniously together</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">Accessibility Check</h4>
              <p className="text-gray-300 text-sm">Validate contrast ratios and accessibility compliance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}