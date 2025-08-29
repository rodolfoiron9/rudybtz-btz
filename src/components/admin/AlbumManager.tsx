'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Music, 
  Plus, 
  Upload, 
  Sparkles, 
  ImageIcon, 
  Save, 
  Edit,
  Trash2,
  Loader2,
  Check
} from 'lucide-react';
import type { Album, Track } from '../../../lib/types';

interface AlbumManagerProps {
  albums?: Album[];
  onCreateAlbum?: (album: Partial<Album>) => void;
  onUpdateAlbum?: (id: string, album: Partial<Album>) => void;
  onDeleteAlbum?: (id: string) => void;
}

export function AlbumManager({ albums = [], onCreateAlbum, onUpdateAlbum, onDeleteAlbum }: AlbumManagerProps) {
  const [editingAlbum, setEditingAlbum] = useState<Partial<Album> | null>(null);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [artworkModalOpen, setArtworkModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Album>>({
    title: '',
    genre: '',
    mood: '',
    description: '',
    coverArtUrl: '',
    releaseDate: new Date()
  });

  const handleGenerateArtwork = async () => {
    setIsAIGenerating(true);
    setArtworkModalOpen(true);
    
    try {
      // Mock AI generation - replace with actual AI service call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockImages = [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=400&h=400&fit=crop'
      ];
      
      setGeneratedImages(mockImages);
    } catch (error) {
      console.error('AI artwork generation failed:', error);
    } finally {
      setIsAIGenerating(false);
    }
  };

  const handleSelectArtwork = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, coverArtUrl: imageUrl }));
    setArtworkModalOpen(false);
    setGeneratedImages([]);
  };

  const handleSave = () => {
    if (editingAlbum?.id) {
      onUpdateAlbum?.(editingAlbum.id, formData);
    } else {
      onCreateAlbum?.(formData);
    }
    setEditingAlbum(null);
    setFormData({
      title: '',
      genre: '',
      mood: '',
      description: '',
      coverArtUrl: '',
      releaseDate: new Date()
    });
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setFormData(album);
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Album Form */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingAlbum ? 'Edit Album' : 'Create New Album'}
          </CardTitle>
          <CardDescription className="text-muted">
            {editingAlbum ? 'Update album details and artwork' : 'Add a new album to your portfolio with AI-generated artwork'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Album Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter album title"
                className="dark-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select value={formData.genre ?? ''} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                <SelectTrigger className="dark-input">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="ambient">Ambient</SelectItem>
                  <SelectItem value="techno">Techno</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="experimental">Experimental</SelectItem>
                  <SelectItem value="synthwave">Synthwave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select value={formData.mood ?? ''} onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}>
                <SelectTrigger className="dark-input">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="chill">Chill</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="uplifting">Uplifting</SelectItem>
                  <SelectItem value="melancholic">Melancholic</SelectItem>
                  <SelectItem value="dreamy">Dreamy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate ? new Date(formData.releaseDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: new Date(e.target.value) }))}
                className="dark-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your album..."
              className="dark-input"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverArt">Cover Art URL</Label>
            <div className="flex gap-2">
              <Input
                id="coverArt"
                value={formData.coverArtUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, coverArtUrl: e.target.value }))}
                placeholder="Enter image URL or generate with AI"
                className="dark-input flex-1"
              />
              <Dialog open={artworkModalOpen} onOpenChange={setArtworkModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black"
                    onClick={handleGenerateArtwork}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Generate
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-gray-900 border-violet-400/30">
                  <DialogHeader>
                    <DialogTitle className="text-3d-silver-violet silver-violet">AI Generated Artwork</DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Select from AI-generated album artwork based on your album details
                    </DialogDescription>
                  </DialogHeader>
                  
                  {isAIGenerating ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
                      <span className="ml-2 text-gray-300">Generating artwork...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {generatedImages.map((imageUrl, index) => (
                        <div 
                          key={index} 
                          className="relative cursor-pointer group"
                          onClick={() => handleSelectArtwork(imageUrl)}
                        >
                          <img 
                            src={imageUrl} 
                            alt={`Generated artwork ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg border-2 border-gray-700 group-hover:border-violet-400 transition-colors"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Check className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {formData.coverArtUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <img 
                src={formData.coverArtUrl} 
                alt="Album cover preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-600"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              className="bg-violet-600 hover:bg-violet-700 text-white"
              disabled={!formData.title || !formData.genre}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingAlbum ? 'Update Album' : 'Create Album'}
            </Button>
            {editingAlbum && (
              <Button 
                onClick={() => {
                  setEditingAlbum(null);
                  setFormData({
                    title: '',
                    genre: '',
                    mood: '',
                    description: '',
                    coverArtUrl: '',
                    releaseDate: new Date()
                  });
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Albums List */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
            <Music className="w-5 h-5" />
            Your Albums
          </CardTitle>
          <CardDescription className="text-muted">
            Manage your existing albums
          </CardDescription>
        </CardHeader>
        <CardContent>
          {albums.length === 0 ? (
            <div className="text-center py-8">
              <Music className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No albums created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {albums.map((album) => (
                <div key={album.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  {album.coverArtUrl && (
                    <img 
                      src={album.coverArtUrl} 
                      alt={album.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="text-white font-semibold mb-1">{album.title}</h3>
                  <Badge variant="secondary" className="mb-2">{album.genre}</Badge>
                  {album.mood && (
                    <Badge variant="outline" className="ml-2 mb-2">{album.mood}</Badge>
                  )}
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{album.description}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(album)}
                      className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDeleteAlbum?.(album.id)}
                      className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
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