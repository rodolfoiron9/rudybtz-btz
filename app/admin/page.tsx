'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AudioPlayer } from '@/components/audio-analysis';
import { AlbumManager } from '@/components/admin/AlbumManager';
import { BlogManager } from '@/components/admin/BlogManager';
import { KnowledgeBaseManager } from '@/components/admin/KnowledgeBaseManager';
import { CustomizationManager } from '@/components/forms';
import { EnhancedBlogManager } from '@/components/forms';
import Simple3DPresetManager from '@/components/visualizer/simple-3d-preset-manager';
import HeroSlidesManager from '@/components/admin/hero-slides-manager';
import ArtistBioManager from '@/components/admin/artist-bio-manager';
import TemplateUploadSystem from '@/components/admin/template-upload-system';
import SystemMonitoring from '@/components/admin/system-monitoring';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/components/hooks/use-auth';
import {
  Image,
  Music,
  User,
  Box,
  BookOpen,
  Database,
  Palette,
  Settings,
  Upload,
  Package,
  Zap,
  Activity,
  Star,
  FileText,
  Brain,
  Volume2,
  LogOut,
  Shield
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState('audio');
  const { user, logout, isAdmin } = useAuth();

  const tabs = [
    {
      id: 'audio',
      label: 'Audio Engine',
      icon: Music,
      description: 'Real-time audio analysis and visualization'
    },
    {
      id: 'albums',
      label: 'Albums',
      icon: Box,
      description: 'Create and manage music albums with AI artwork'
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: FileText,
      description: 'Write and manage blog posts with rich media'
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      icon: Brain,
      description: 'AI-enhanced knowledge management'
    },
    {
      id: 'visualizer',
      label: '3D Presets',
      icon: Volume2,
      description: 'Advanced 3D cube and text visualization presets'
    },
    {
      id: 'customization',
      label: 'Customization',
      icon: Palette,
      description: 'Customize UI, fonts, colors, and page layouts'
    },
    {
      id: 'hero',
      label: 'Hero Slides',
      icon: Image,
      description: 'Manage homepage hero slideshow'
    },
    {
      id: 'bio',
      label: 'Artist Bio',
      icon: User,
      description: 'Update artist profile and bio'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: Database,
      description: 'ZIP project analysis and design extraction'
    },
    {
      id: 'system',
      label: 'System',
      icon: Settings,
      description: 'System monitoring and configuration'
    }
  ];

  return (
    <div className="min-h-screen bg-background-color">
      {/* Header */}
      <header className="border-b border-gray-800 cyber-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-3d-silver-violet silver-violet">
                AI Coordinator Pro
              </h1>
              <p className="text-muted text-lg mt-1">
                Audio Engine • Albums with AI • Enhanced Blog • Knowledge Base • 3D Presets • Customization Studio • Templates
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="status-badge status-active">SYSTEM OPTIMAL</Badge>
              <div className="w-3 h-3 rounded-full animate-pulse-glow bg-success-color" />
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{user?.email}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {isAdmin ? 'Admin' : 'User'}
                  </p>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
              <div className="w-10 h-10 cyber-gradient rounded-full flex items-center justify-center">
                <span className="text-black font-bold">RB</span>
              </div>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-10 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-xs text-muted">Audio Engine</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-muted">Albums</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-muted">Blog Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-muted">Knowledge</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-muted">Presets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-xs text-muted">Custom</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-muted">Hero Slides</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-xs text-muted">Artist Bio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-muted">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-xs text-muted">System Health</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid grid-cols-10 gap-1 h-auto p-2 cyber-card">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center space-y-2 py-3 px-1 data-[state=active]:cyber-gradient data-[state=active]:text-black transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          <div className="mt-8">
            <TabsContent value="audio" className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Audio Analysis Engine
                  </CardTitle>
                  <CardDescription className="text-muted">
                    Real-time audio processing with Web Audio API, waveform visualization, spectrum analysis, and beat detection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AudioPlayer 
                    showVisualizers={true}
                    showControls={true}
                    autoPlay={false}
                  />
                </CardContent>
              </Card>

              {/* Audio Engine Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cyber-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">64</div>
                    <div className="text-sm text-muted">Frequency Bands</div>
                  </CardContent>
                </Card>
                
                <Card className="cyber-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-success">60fps</div>
                    <div className="text-sm text-muted">Render Rate</div>
                  </CardContent>
                </Card>
                
                <Card className="cyber-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-warning">3</div>
                    <div className="text-sm text-muted">Visualizers</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hero" className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Hero Slides Management
                  </CardTitle>
                  <CardDescription className="text-muted">
                    Create and manage homepage hero slideshow with images, videos, and animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HeroSlidesManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="albums" className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Album Management with AI
                  </CardTitle>
                  <CardDescription className="text-muted">
                    Create and manage your music albums with AI-powered artwork generation and track management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlbumManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Enhanced Blog Management
                  </CardTitle>
                  <CardDescription className="text-muted">
                    Write and manage blog posts with rich media support, image attachments, and AI assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EnhancedBlogManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Knowledge Base
                  </CardTitle>
                  <CardDescription className="text-muted">
                    Manage your knowledge base with AI-enhanced sync from blog posts and manual content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KnowledgeBaseManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visualizer" className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    3D Visualization Presets
                  </CardTitle>
                  <CardDescription className="text-muted">
                    Configure advanced 3D cube and text presets with silver-violet gradients and real-time audio response
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Simple3DPresetManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customization" className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Customization Studio
                  </CardTitle>
                  <CardDescription className="text-muted">
                    Complete UI customization with global and page-specific settings for colors, fonts, layouts, and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomizationManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bio" className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Artist Biography
                  </CardTitle>
                  <CardDescription className="text-muted">
                    Manage your artist profile, social media links, career timeline, and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ArtistBioManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Template Analysis System
                  </CardTitle>
                  <CardDescription className="text-muted">
                    Upload ZIP files containing React/Next.js projects to extract design templates, components, and features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TemplateUploadSystem />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    System Monitoring
                  </CardTitle>
                  <CardDescription className="text-muted">
                    Real-time performance metrics, health monitoring, and system administration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SystemMonitoring />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}