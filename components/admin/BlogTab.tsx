'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Sparkles, Calendar, Eye, FileText, Tag } from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import type { BlogPost } from '@/lib/types';

export default function BlogTab() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    published: false,
    featuredImageUrl: ''
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    // Mock data for now - will connect to Firebase later
    setPosts([
      {
        id: '1',
        title: 'The Future of AI-Generated Music',
        slug: 'future-ai-generated-music',
        excerpt: 'Exploring how artificial intelligence is revolutionizing music production and composition.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        tags: ['AI', 'Music Production', 'Technology'],
        published: true,
        featuredImageUrl: '',
        publishedAt: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Behind the Scenes: Creating 3D Visualizers',
        slug: 'behind-scenes-3d-visualizers',
        excerpt: 'A deep dive into the technical process of creating reactive 3D audio visualizations.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        tags: ['3D Graphics', 'WebGL', 'Audio Visualization'],
        published: false,
        featuredImageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (selectedPost) {
        // Update post logic
        console.log('Updating post:', {...formData, tags: tagsArray});
      } else {
        // Create new post logic
        console.log('Creating post:', {...formData, tags: tagsArray});
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(', '),
      published: post.published,
      featuredImageUrl: post.featuredImageUrl || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        // Delete logic
        console.log('Deleting post:', id);
        await loadPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      console.log('Toggling published status:', id, !published);
      await loadPosts();
    } catch (error) {
      console.error('Error updating publish status:', error);
    }
  };

  const resetForm = () => {
    setSelectedPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      tags: '',
      published: false,
      featuredImageUrl: ''
    });
  };

  const generateWithAI = async () => {
    setIsLoading(true);
    try {
      const prompt = formData.title 
        ? `Write a compelling blog post about "${formData.title}". Include engaging introduction, detailed content, and conclusion. Focus on music production, technology, and creative process.`
        : 'Generate an engaging blog post about music production, creative technology, or artistic journey. Include compelling narrative and technical insights.';
      
      const response = await aiService.generateText({
        prompt: prompt,
        type: 'blog-post',
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
      console.error('Failed to generate blog content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const publishedPosts = posts.filter(post => post.published);
  const draftPosts = posts.filter(post => !post.published);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Blog Management</h2>
          <p className="text-gray-400">Create and manage your blog posts with AI assistance</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedPost ? 'Edit Blog Post' : 'Create Blog Post'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedPost 
                  ? 'Update your blog post content' 
                  : 'Write a new blog post for your audience'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Post Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter an engaging title..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-white">Excerpt</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Brief description for preview..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white">Content</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                  rows={12}
                  placeholder="Write your blog post content here..."
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
                  placeholder="AI, Music, Technology (comma-separated)"
                />
              </div>

              <div>
                <Label htmlFor="featuredImage" className="text-white">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImageUrl}
                  onChange={(e) => setFormData({...formData, featuredImageUrl: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="w-4 h-4 text-violet-600"
                  title="Publish this post immediately"
                />
                <Label htmlFor="published" className="text-white">Publish immediately</Label>
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
                  AI Assist
                </Button>
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isLoading}>
                  {isLoading ? 'Saving...' : selectedPost ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{publishedPosts.length}</p>
                <p className="text-gray-400">Published Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{draftPosts.length}</p>
                <p className="text-gray-400">Draft Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-600/20 rounded-lg">
                <Tag className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Array.from(new Set(posts.flatMap(post => post.tags))).length}
                </p>
                <p className="text-gray-400">Unique Tags</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {/* Published Posts */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Published Posts</CardTitle>
            <CardDescription className="text-gray-400">
              Your live blog posts visible to readers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {publishedPosts.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">No published posts yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {publishedPosts.map((post) => (
                  <div key={post.id} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                        <p className="text-gray-300 mb-3">{post.excerpt}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{post.publishedAt?.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-violet-600/20 text-violet-300">
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
                          onClick={() => togglePublished(post.id, post.published)}
                          className="border-yellow-600 text-yellow-400"
                        >
                          Unpublish
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(post)}
                          className="border-gray-600 text-gray-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(post.id)}
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

        {/* Draft Posts */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Draft Posts</CardTitle>
            <CardDescription className="text-gray-400">
              Posts in progress, not yet published
            </CardDescription>
          </CardHeader>
          <CardContent>
            {draftPosts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">No draft posts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {draftPosts.map((post) => (
                  <div key={post.id} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                        <p className="text-gray-300 mb-3">{post.excerpt}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Created {post.createdAt.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-gray-600/50 text-gray-300">
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
                          onClick={() => togglePublished(post.id, post.published)}
                          className="border-green-600 text-green-400"
                        >
                          Publish
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(post)}
                          className="border-gray-600 text-gray-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(post.id)}
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
      </div>

      {/* AI Enhancement Preview */}
      <Card className="bg-gradient-to-r from-violet-900/30 to-cyan-900/30 border-violet-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>AI Content Assistant</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Upcoming AI features for blog content creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2">Content Generation</h4>
              <p className="text-gray-300 text-sm">AI writes blog posts based on your music and style</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-violet-400 font-semibold mb-2">SEO Optimization</h4>
              <p className="text-gray-300 text-sm">Optimize titles and content for search engines</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">Smart Tagging</h4>
              <p className="text-gray-300 text-sm">Automatically suggest relevant tags and categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}