'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth';
import AlbumsTab from '@/components/admin/AlbumsTab';
import HeroTab from '@/components/admin/HeroTab';
import ArtistBioTab from '@/components/admin/ArtistBioTab';
import VisualizerTab from '@/components/admin/VisualizerTab';
import BlogTab from '@/components/admin/BlogTab';
import KnowledgeBaseTab from '@/components/admin/KnowledgeBaseTab';
import ThemeUITab from '@/components/admin/ThemeUITab';
import { 
  Image, 
  Music, 
  User, 
  Box, 
  BookOpen, 
  Database, 
  Palette,
  Settings
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState('hero');

  const tabs = [
    {
      id: 'hero',
      label: 'Hero',
      icon: Image,
      description: 'Manage homepage slides and hero content'
    },
    {
      id: 'albums',
      label: 'Albums',
      icon: Music,
      description: 'Create and manage music albums'
    },
    {
      id: 'bio',
      label: 'Artist Bio',
      icon: User,
      description: 'Timeline of your artistic journey'
    },
    {
      id: 'visualizer',
      label: '3D Visualizer',
      icon: Box,
      description: 'Configure audio visualization presets'
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: BookOpen,
      description: 'Write about music production and tech'
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      icon: Database,
      description: 'Manage datasets and AI knowledge'
    },
    {
      id: 'theme',
      label: 'Theme UI',
      icon: Palette,
      description: 'Customize site appearance'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-cyan-400">RUDYBTZ Admin</h1>
              <p className="text-gray-400">AI-Powered Content Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Settings className="w-5 h-5 text-gray-400" />
              <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">RB</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid grid-cols-7 gap-2 h-auto p-2 bg-gray-800/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center space-y-2 py-4 px-2 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          <div className="mt-8">
            <TabsContent value="hero" className="space-y-6">
              <HeroTab />
            </TabsContent>

            <TabsContent value="albums" className="space-y-6">
              <AlbumsTab />
            </TabsContent>

            {tabs.slice(2).map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                {tab.id === 'bio' && <ArtistBioTab />}
                {tab.id === 'visualizer' && <VisualizerTab />}
                {tab.id === 'blog' && <BlogTab />}
                {tab.id === 'knowledge' && <KnowledgeBaseTab />}
                {tab.id === 'theme' && <ThemeUITab />}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}