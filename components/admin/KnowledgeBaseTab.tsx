'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Sparkles, Search, BookOpen, Tag, Brain, Upload } from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import type { KnowledgeBaseEntry } from '@/lib/types';

export default function KnowledgeBaseTab() {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeBaseEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    priority: 'medium'
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'music-production', label: 'Music Production' },
    { value: 'ai-tools', label: 'AI Tools' },
    { value: 'performance', label: 'Performance' },
    { value: 'technical', label: 'Technical' },
    { value: 'business', label: 'Business' },
    { value: 'inspiration', label: 'Inspiration' }
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    // Mock data for now - will connect to Firebase later
    setEntries([
      {
        id: '1',
        title: 'Setting Up Audio Visualization Pipeline',
        content: 'Complete guide on setting up real-time audio analysis for 3D visualizations including FFT processing, frequency binning, and WebGL rendering optimization.',
        category: 'technical',
        tags: ['WebGL', 'Audio Processing', 'FFT'],
        priority: 'high',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'AI Music Generation Workflow',
        content: 'Step-by-step process for integrating AI music generation tools into the creative workflow, including prompt engineering and quality control.',
        category: 'ai-tools',
        tags: ['AI', 'Music Generation', 'Workflow'],
        priority: 'high',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Performance Optimization Tips',
        content: 'Collection of performance optimization techniques for web-based music applications including lazy loading, caching strategies, and resource management.',
        category: 'performance',
        tags: ['Performance', 'Optimization', 'Web Development'],
        priority: 'medium',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date()
      },
      {
        id: '4',
        title: 'Creative Inspiration Sources',
        content: 'Curated list of inspiration sources for electronic music production including artists, techniques, and experimental approaches.',
        category: 'inspiration',
        tags: ['Inspiration', 'Creativity', 'Electronic Music'],
        priority: 'low',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (selectedEntry) {
        // Update entry logic
        console.log('Updating entry:', {...formData, tags: tagsArray});
      } else {
        // Create new entry logic
        console.log('Creating entry:', {...formData, tags: tagsArray});
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (entry: KnowledgeBaseEntry) => {
    setSelectedEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      category: entry.category,
      tags: entry.tags.join(', '),
      priority: entry.priority
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this knowledge base entry?')) {
      try {
        // Delete logic
        console.log('Deleting entry:', id);
        await loadEntries();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedEntry(null);
    setFormData({
      title: '',
      content: '',
      category: 'general',
      tags: '',
      priority: 'medium'
    });
  };

  const generateWithAI = async () => {
    setIsLoading(true);
    try {
      const prompt = formData.title 
        ? `Create comprehensive documentation for "${formData.title}". Include detailed explanations, best practices, troubleshooting tips, and practical examples.`
        : 'Generate comprehensive knowledge base content about music production, technology tools, creative workflows, or technical documentation.';
      
      const response = await aiService.generateText({
        prompt: prompt,
        type: 'description',
        tone: 'professional',
        length: 'long'
      });
      
      if (response.success && response.data) {
        setFormData(prev => ({
          ...prev,
          content: response.data!.text
        }));
      } else {
        throw new Error(response.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Failed to generate knowledge content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const importFromFiles = () => {
    alert('📁 File Import\n\nSupported formats:\n• Markdown files (.md)\n• Text files (.txt)\n• JSON exports\n• PDF documents (with OCR)\n\nDrag and drop files or click to browse.');
  };

  // Filter entries based on search and category
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const categoryCounts = categories.slice(1).reduce((acc, cat) => {
    acc[cat.value] = entries.filter(entry => entry.category === cat.value).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
          <p className="text-gray-400">Organize and manage your creative knowledge with AI assistance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={importFromFiles} className="border-cyan-400 text-cyan-400">
            <Upload className="w-4 h-4 mr-2" />
            Import Files
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-violet-600 hover:bg-violet-700">
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedEntry ? 'Edit Knowledge Entry' : 'Create Knowledge Entry'}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedEntry 
                    ? 'Update your knowledge base entry' 
                    : 'Add new information to your knowledge base'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Entry Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter a descriptive title..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-white">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      title="Select entry category"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority" className="text-white">Priority</Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      title="Select entry priority"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content" className="text-white">Content</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                    rows={10}
                    placeholder="Enter your knowledge content here..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags" className="text-white">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="AI, Music, Technical (comma-separated)"
                  />
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
                  <Button 
                    type="button" 
                    onClick={generateWithAI}
                    className="bg-gradient-to-r from-violet-600 to-cyan-600"
                    disabled={isLoading}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Enhance
                  </Button>
                  <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isLoading}>
                    {isLoading ? 'Saving...' : selectedEntry ? 'Update Entry' : 'Create Entry'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                  placeholder="Search knowledge base..."
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                title="Filter by category"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} {cat.value !== 'all' ? `(${categoryCounts[cat.value] || 0})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.slice(1).map(cat => (
          <Card key={cat.value} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{categoryCounts[cat.value] || 0}</p>
                <p className="text-gray-400 text-sm">{cat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Knowledge Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-12">
              <div className="text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  {searchQuery || selectedCategory !== 'all' ? 'No matching entries' : 'No knowledge entries yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Start building your knowledge base'
                  }
                </p>
                {!searchQuery && selectedCategory === 'all' && (
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-violet-600 hover:bg-violet-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Entry
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="bg-gray-800/50 border-gray-700 hover:border-violet-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                      <Badge className={`${getPriorityColor(entry.priority)} capitalize`}>
                        {entry.priority}
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-600/50 text-gray-300 capitalize">
                        {categories.find(cat => cat.value === entry.category)?.label}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-300 mb-3 line-clamp-2">{entry.content}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Created {entry.createdAt.toLocaleDateString()}</span>
                      <div className="flex items-center space-x-2">
                        {entry.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="border-violet-400/30 text-violet-300 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
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
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* AI Enhancement Preview */}
      <Card className="bg-gradient-to-r from-violet-900/30 to-cyan-900/30 border-violet-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Brain className="w-6 h-6 text-cyan-400" />
            <span>AI Knowledge Enhancement</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Upcoming AI features for intelligent knowledge management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2">Smart Organization</h4>
              <p className="text-gray-300 text-sm">AI automatically categorizes and tags your content</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-violet-400 font-semibold mb-2">Knowledge Graphs</h4>
              <p className="text-gray-300 text-sm">Visualize connections between different concepts</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">Content Generation</h4>
              <p className="text-gray-300 text-sm">Generate comprehensive documentation from notes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}