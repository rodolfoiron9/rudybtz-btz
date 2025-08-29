'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Sparkles, Image as ImageIcon, Video, Upload } from 'lucide-react';
import { aiService } from '@/lib/ai-service';

export default function HeroTab() {
  const [slides, setSlides] = useState([
    {
      id: '1',
      title: 'Epic Music Journey',
      type: 'video' as const,
      mediaUrl: 'https://example.com/video1.mp4',
      order: 1
    },
    {
      id: '2', 
      title: 'Album Cover Art',
      type: 'image' as const,
      mediaUrl: 'https://example.com/image1.jpg',
      order: 2
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'image' as 'image' | 'video',
    mediaUrl: '',
    description: ''
  });

  const generateWithAI = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title first!');
      return;
    }

    try {
      const result = await aiService.generateAlbumArt({
        prompt: `hero slide image for "${formData.title}"`,
        style: 'hero-image',
        dimensions: '16:9',
        quality: 'hd'
      });

      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          mediaUrl: result.data!.imageUrl
        }));
        alert('AI-generated hero slide created successfully!');
      } else {
        throw new Error(result.error || 'Generation failed');
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('AI generation failed. Please try again or upload media manually.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving slide:', formData);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'image',
      mediaUrl: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Hero Slides Management</h2>
          <p className="text-gray-400">Create stunning homepage slides with AI-generated content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              New Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Slide</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new slide to your homepage hero section
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Slide Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter slide title..."
                  required
                />
              </div>

              <div>
                <Label className="text-white">Media Type</Label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="image"
                      checked={formData.type === 'image'}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'image' | 'video'})}
                      className="text-violet-600"
                    />
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-white">Image</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="video"
                      checked={formData.type === 'video'}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'image' | 'video'})}
                      className="text-violet-600"
                    />
                    <Video className="w-4 h-4 text-gray-400" />
                    <span className="text-white">Video</span>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="mediaUrl" className="text-white">Media Source</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    id="mediaUrl"
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData({...formData, mediaUrl: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder={`${formData.type === 'video' ? 'Video' : 'Image'} URL...`}
                  />
                  <Button type="button" variant="outline" className="border-cyan-400 text-cyan-400">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <Button type="button" onClick={generateWithAI} className="bg-gradient-to-r from-violet-600 to-cyan-600">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                  rows={3}
                  placeholder="Slide description..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
                  Create Slide
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <Card key={slide.id} className="bg-gray-800/50 border-gray-700 overflow-hidden">
            <div className="aspect-video bg-gray-700 relative">
              {slide.type === 'video' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-12 h-12 text-gray-500" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-500" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-black/50 text-white text-xs rounded">
                  {slide.type.toUpperCase()}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-violet-600 text-white text-xs rounded">
                  #{slide.order}
                </span>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-2">{slide.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {slide.type === 'video' ? 'Video Slide' : 'Image Slide'}
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-gray-600" aria-label="Edit slide">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-600 text-red-400" aria-label="Delete slide">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Slide Card */}
        <Card className="bg-gray-800/30 border-gray-700 border-dashed cursor-pointer hover:bg-gray-800/50 transition-colors" onClick={() => setIsDialogOpen(true)}>
          <CardContent className="aspect-video flex flex-col items-center justify-center p-6">
            <Plus className="w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-gray-300 font-semibold mb-2">Add New Slide</h3>
            <p className="text-gray-500 text-sm text-center">Create or generate slides with AI</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Preview */}
      <Card className="bg-gradient-to-r from-violet-900/30 to-cyan-900/30 border-violet-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>AI Content Generation</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Upcoming AI features for automatic content creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2">Image Generation</h4>
              <p className="text-gray-300 text-sm">Generate stunning album cover art and slide backgrounds using advanced AI models</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-violet-400 font-semibold mb-2">Video Creation (Veo2/3)</h4>
              <p className="text-gray-300 text-sm">Create dynamic video content that matches your music style and aesthetic</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}