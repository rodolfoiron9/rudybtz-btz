'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Sparkles, Calendar, User2, Upload } from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import type { ArtistBioEntry } from '@/lib/types';

export default function ArtistBioTab() {
  const [bioEntries, setBioEntries] = useState<ArtistBioEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<ArtistBioEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    description: '',
    imageUrl: '',
    order: 0
  });

  useEffect(() => {
    loadBioEntries();
  }, []);

  const loadBioEntries = async () => {
    // Mock data for now - will connect to Firebase later
    setBioEntries([
      {
        id: '1',
        year: 2024,
        title: 'AI Music Revolution',
        description: 'Started exploring AI-powered music production and visualization technologies.',
        imageUrl: '',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2', 
        year: 2023,
        title: 'Electronic Music Journey',
        description: 'Released first electronic album featuring ambient and techno influences.',
        imageUrl: '',
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (selectedEntry) {
        // Update entry logic
        console.log('Updating entry:', formData);
      } else {
        // Create new entry logic
        console.log('Creating entry:', formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadBioEntries();
    } catch (error) {
      console.error('Error saving bio entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (entry: ArtistBioEntry) => {
    setSelectedEntry(entry);
    setFormData({
      year: entry.year,
      title: entry.title,
      description: entry.description,
      imageUrl: entry.imageUrl || '',
      order: entry.order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this bio entry?')) {
      try {
        // Delete logic
        console.log('Deleting entry:', id);
        await loadBioEntries();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedEntry(null);
    setFormData({
      year: new Date().getFullYear(),
      title: '',
      description: '',
      imageUrl: '',
      order: bioEntries.length + 1
    });
  };

  const generateWithAI = async () => {
    setIsLoading(true);
    try {
      const prompt = formData.title 
        ? `Write a compelling bio entry for the milestone "${formData.title}" in ${formData.year}. Focus on artistic growth and career significance.`
        : `Generate an inspiring artist bio entry for the year ${formData.year}. Include career milestones, artistic development, and achievements.`;
      
      const response = await aiService.generateText({
        prompt: prompt,
        type: 'bio',
        tone: 'professional',
        length: 'medium'
      });
      
      if (response.success && response.data) {
        setFormData(prev => ({
          ...prev,
          description: response.data!.text
        }));
      } else {
        throw new Error(response.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Failed to generate bio description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Artist Bio Timeline</h2>
          <p className="text-gray-400">Create your artistic journey timeline with AI assistance</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedEntry ? 'Edit Timeline Entry' : 'Create Timeline Entry'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedEntry 
                  ? 'Update your career milestone' 
                  : 'Add a new milestone to your artistic journey'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year" className="text-white">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="bg-gray-700 border-gray-600 text-white"
                    min="1900"
                    max="2030"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="order" className="text-white">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="bg-gray-700 border-gray-600 text-white"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title" className="text-white">Milestone Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., First Album Release, Major Collaboration..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                  rows={4}
                  placeholder="Describe this milestone in your artistic journey..."
                  required
                />
              </div>

              <div>
                <Label className="text-white">Milestone Image</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Image URL..."
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
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isLoading}>
                  {isLoading ? 'Saving...' : selectedEntry ? 'Update Entry' : 'Create Entry'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timeline */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Your Artistic Journey</CardTitle>
          <CardDescription className="text-gray-400">
            Timeline of career milestones and achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {bioEntries.length === 0 ? (
            <div className="text-center py-12">
              <User2 className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No timeline entries yet</h3>
              <p className="text-gray-500 mb-4">Start building your artistic journey timeline</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-violet-600 hover:bg-violet-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Entry
              </Button>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-600 to-cyan-600"></div>
              
              {bioEntries
                .sort((a, b) => b.year - a.year)
                .map((entry, index) => (
                <div key={entry.id} className="relative flex items-start space-x-6 pb-8">
                  {/* Timeline dot */}
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-violet-600 rounded-full border-2 border-gray-800"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-gray-700/50 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-600 text-white">
                            <Calendar className="w-3 h-3 mr-1" />
                            {entry.year}
                          </span>
                          <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{entry.description}</p>
                      </div>
                      
                      {/* Image */}
                      {entry.imageUrl && (
                        <div className="ml-6">
                          <img 
                            src={entry.imageUrl} 
                            alt={entry.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(entry)}
                        className="border-gray-600 text-gray-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(entry.id)}
                        className="border-red-600 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Enhancement Preview */}
      <Card className="bg-gradient-to-r from-violet-900/30 to-cyan-900/30 border-violet-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>AI Bio Enhancement</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Upcoming AI features for bio content creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2">Smart Suggestions</h4>
              <p className="text-gray-300 text-sm">AI analyzes your music to suggest timeline milestones</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-violet-400 font-semibold mb-2">Content Generation</h4>
              <p className="text-gray-300 text-sm">Generate compelling descriptions for your achievements</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">Visual Timeline</h4>
              <p className="text-gray-300 text-sm">AI creates visual representations of your journey</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}