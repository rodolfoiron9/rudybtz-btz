'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Brain
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('hero');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto p-6">
        <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              RUDYBTZ Admin Dashboard
            </CardTitle>
            <CardDescription className="text-gray-300">
              Manage your portfolio content, themes, and digital presence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-7 bg-gray-800/50 border border-purple-500/30">
                <TabsTrigger value="hero" className="flex items-center gap-2 text-white">
                  <Image className="w-4 h-4" />
                  Hero
                </TabsTrigger>
                <TabsTrigger value="albums" className="flex items-center gap-2 text-white">
                  <Music className="w-4 h-4" />
                  Albums
                </TabsTrigger>
                <TabsTrigger value="bio" className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4" />
                  Bio
                </TabsTrigger>
                <TabsTrigger value="visualizer" className="flex items-center gap-2 text-white">
                  <Box className="w-4 h-4" />
                  3D
                </TabsTrigger>
                <TabsTrigger value="blog" className="flex items-center gap-2 text-white">
                  <BookOpen className="w-4 h-4" />
                  Blog
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="flex items-center gap-2 text-white">
                  <Database className="w-4 h-4" />
                  KB
                </TabsTrigger>
                <TabsTrigger value="theme" className="flex items-center gap-2 text-white">
                  <Palette className="w-4 h-4" />
                  Theme
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="hero">
                  <HeroTab />
                </TabsContent>
                
                <TabsContent value="albums">
                  <AlbumsTab />
                </TabsContent>
                
                <TabsContent value="bio">
                  <ArtistBioTab />
                </TabsContent>
                
                <TabsContent value="visualizer">
                  <VisualizerTab />
                </TabsContent>
                
                <TabsContent value="blog">
                  <BlogTab />
                </TabsContent>
                
                <TabsContent value="knowledge">
                  <KnowledgeBaseTab />
                </TabsContent>
                
                <TabsContent value="theme">
                  <ThemeUITab />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}