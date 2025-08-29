'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Save, 
  Edit,
  Trash2,
  Tag,
  Eye,
  EyeOff,
  Calendar
} from 'lucide-react';
import type { BlogPost } from '../../../lib/types';

interface BlogManagerProps {
  posts?: BlogPost[];
  onCreatePost?: (post: Partial<BlogPost>) => void;
  onUpdatePost?: (id: string, post: Partial<BlogPost>) => void;
  onDeletePost?: (id: string) => void;
}

export function BlogManager({ posts = [], onCreatePost, onUpdatePost, onDeletePost }: BlogManagerProps) {
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImageUrl: '',
    tags: [],
    published: false
  });
  const [tagInput, setTagInput] = useState('');

  const handleTagsChange = (value: string) => {
    setTagInput(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ 
      ...prev, 
      title,
      slug: (prev.slug === '' || prev.slug === generateSlug(prev.title || '')) ? generateSlug(title) : (prev.slug || '')
    }));
  };

  const handleSave = () => {
    const postData: Partial<BlogPost> = {
      ...formData,
      createdAt: editingPost?.createdAt || new Date(),
      updatedAt: new Date()
    };

    // Only add publishedAt if the post is published
    if (formData.published) {
      postData.publishedAt = new Date();
    }

    if (editingPost?.id) {
      onUpdatePost?.(editingPost.id, postData);
    } else {
      onCreatePost?.(postData);
    }
    
    handleCancel();
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setTagInput(post.tags.join(', '));
  };

  const handleCancel = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImageUrl: '',
      tags: [],
      published: false
    });
    setTagInput('');
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Post Form */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          </CardTitle>
          <CardDescription className="text-muted">
            {editingPost ? 'Update your blog post content and metadata' : 'Write a new blog post with tags and rich content'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
                className="dark-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-friendly-slug"
                className="dark-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief description of your post..."
              className="dark-input"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={formData.featuredImageUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, featuredImageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="dark-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="production, tips, ai, music, tutorials"
              className="dark-input"
            />
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-violet-600/20 text-violet-300">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your blog post content here..."
              className="dark-input"
              rows={8}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published || false}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="w-4 h-4 text-violet-600 bg-gray-800 border-gray-600 rounded focus:ring-violet-500 focus:ring-2"
              aria-label="Publish post"
            />
            <Label htmlFor="published" className="flex items-center gap-2">
              {formData.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {formData.published ? 'Published' : 'Draft'}
            </Label>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              className="bg-violet-600 hover:bg-violet-700 text-white"
              disabled={!formData.title || !formData.content}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingPost ? 'Update Post' : 'Create Post'}
            </Button>
            {editingPost && (
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Your Blog Posts
          </CardTitle>
          <CardDescription className="text-muted">
            Manage your published posts and drafts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No blog posts created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold">{post.title}</h3>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                          {post.published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                      
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-violet-400/30 text-violet-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            Published: {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(post)}
                        className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onDeletePost?.(post.id)}
                        className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
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
  );
}