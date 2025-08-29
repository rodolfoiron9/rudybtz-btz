'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  Video, 
  File, 
  Link, 
  Wand2, 
  Eye, 
  Save, 
  Calendar, 
  Tag, 
  Globe, 
  Lock,
  X,
  Folder,
  Camera,
  Music,
  FileVideo,
  Type,
  Layout,
  Palette,
  Settings,
  Sparkles
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  attachments: MediaAttachment[];
  readTime: number;
  views: number;
  likes: number;
}

interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
  alt?: string;
  caption?: string;
}

interface AIAssistant {
  isGenerating: boolean;
  suggestions: string[];
  selectedTemplate: string;
}

const EnhancedBlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  
  // Media handling
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // AI Assistant
  const [aiAssistant, setAiAssistant] = useState<AIAssistant>({
    isGenerating: false,
    suggestions: [],
    selectedTemplate: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    publishDate: '',
    seoTitle: '',
    seoDescription: '',
    featuredImage: '',
    attachments: [] as MediaAttachment[]
  });

  const categories = [
    'Technology', 'Music Production', 'AI & Machine Learning', 
    'Web Development', 'Design', 'Business', 'Personal', 'Tutorials'
  ];

  const contentTemplates = [
    { id: 'tutorial', name: 'Tutorial/How-to', description: 'Step-by-step guide format' },
    { id: 'review', name: 'Product Review', description: 'Detailed product analysis' },
    { id: 'opinion', name: 'Opinion Piece', description: 'Personal perspective article' },
    { id: 'news', name: 'News Update', description: 'Current events and announcements' },
    { id: 'case-study', name: 'Case Study', description: 'In-depth project analysis' },
    { id: 'interview', name: 'Interview', description: 'Q&A format content' }
  ];

  // File upload handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
      const attachment: MediaAttachment = {
        id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: getFileType(file.type),
        name: file.name,
        url: URL.createObjectURL(file), // In real app, upload to cloud storage
        size: file.size,
        uploadedAt: new Date().toISOString(),
        alt: '',
        caption: ''
      };

      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, attachment]
      }));
    }
  };

  const getFileType = (mimeType: string): MediaAttachment['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const removeAttachment = (attachmentId: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachmentId)
    }));
  };

  // AI Content Generation
  const generateContent = async (type: 'title' | 'excerpt' | 'content' | 'tags') => {
    setAiAssistant(prev => ({ ...prev, isGenerating: true }));
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    switch (type) {
      case 'title':
        setFormData(prev => ({ 
          ...prev, 
          title: `AI-Generated: ${prev.category || 'Untitled'} - A Deep Dive` 
        }));
        break;
      case 'excerpt':
        setFormData(prev => ({ 
          ...prev, 
          excerpt: 'This AI-generated excerpt provides a compelling overview of the main topics covered in this comprehensive blog post...' 
        }));
        break;
      case 'content':
        setFormData(prev => ({ 
          ...prev, 
          content: `# ${prev.title}\n\n## Introduction\n\nThis AI-generated content provides a comprehensive overview...\n\n## Main Content\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit...\n\n## Conclusion\n\nIn summary, we've explored...` 
        }));
        break;
      case 'tags':
        setFormData(prev => ({ 
          ...prev, 
          tags: 'ai-generated, technology, innovation, future, automation' 
        }));
        break;
    }
    
    setAiAssistant(prev => ({ ...prev, isGenerating: false }));
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Calculate read time
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Save post
  const savePost = () => {
    const post: BlogPost = {
      id: selectedPost?.id || `post_${Date.now()}`,
      ...formData,
      slug: formData.slug || generateSlug(formData.title),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      author: 'Rudy Benzies', // Current user
      createdAt: selectedPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: calculateReadTime(formData.content),
      views: selectedPost?.views || 0,
      likes: selectedPost?.likes || 0
    };

    if (selectedPost) {
      setPosts(prev => prev.map(p => p.id === post.id ? post : p));
    } else {
      setPosts(prev => [...prev, post]);
    }

    setIsEditing(false);
    setSelectedPost(post);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      status: 'draft',
      publishDate: '',
      seoTitle: '',
      seoDescription: '',
      featuredImage: '',
      attachments: []
    });
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
      setIsEditing(false);
    }
  };

  const editPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags.join(', '),
      status: post.status,
      publishDate: post.publishDate,
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      featuredImage: post.featuredImage || '',
      attachments: post.attachments
    });
    setIsEditing(true);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: BlogPost['status']) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getMediaIcon = (type: MediaAttachment['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <FileVideo className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-3d-silver-violet silver-violet">Enhanced Blog Manager</h2>
          <p className="text-muted mt-1">Create and manage blog posts with rich media and AI assistance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              resetForm();
              setIsEditing(true);
              setSelectedPost(null);
            }}
            className="cyber-button-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
          <Button variant="outline" className="cyber-button-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-muted">Total Posts</p>
                <p className="text-2xl font-bold text-white">{posts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-muted">Published</p>
                <p className="text-2xl font-bold text-white">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-muted">Drafts</p>
                <p className="text-2xl font-bold text-white">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-muted">Scheduled</p>
                <p className="text-2xl font-bold text-white">
                  {posts.filter(p => p.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Posts List */}
        <div className="col-span-4">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Blog Posts</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                      selectedPost?.id === post.id ? 'bg-gray-800' : ''
                    }`}
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{post.title}</h3>
                        <p className="text-sm text-muted mt-1 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(post.status)} text-white text-xs`}
                          >
                            {post.status}
                          </Badge>
                          {post.category && (
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            editPost(post);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePost(post.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPosts.length === 0 && (
                  <div className="p-8 text-center text-muted">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No posts found</p>
                    <p className="text-sm mt-1">Create your first blog post to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="col-span-8">
          {isEditing ? (
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {selectedPost ? 'Edit Post' : 'Create New Post'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowPreview(!showPreview)}
                      className="cyber-button-secondary"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? 'Hide Preview' : 'Preview'}
                    </Button>
                    <Button onClick={savePost} className="cyber-button-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Post
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        resetForm();
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <div className="flex gap-2">
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                title: e.target.value,
                                slug: generateSlug(e.target.value)
                              }));
                            }}
                            placeholder="Enter post title..."
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateContent('title')}
                            disabled={aiAssistant.isGenerating}
                          >
                            <Wand2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="post-url-slug"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                          placeholder="Brief description of the post..."
                          rows={3}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateContent('excerpt')}
                          disabled={aiAssistant.isGenerating}
                        >
                          <Wand2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Write your blog post content using Markdown..."
                          rows={15}
                          className="flex-1 font-mono"
                        />
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateContent('content')}
                            disabled={aiAssistant.isGenerating}
                          >
                            <Wand2 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Type className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Layout className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags</Label>
                        <div className="flex gap-2">
                          <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="tag1, tag2, tag3"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateContent('tags')}
                            disabled={aiAssistant.isGenerating}
                          >
                            <Wand2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4">
                    {/* File Upload Zone */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragOver 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted" />
                      <h3 className="text-lg font-medium text-white mb-2">Upload Media Files</h3>
                      <p className="text-muted mb-4">
                        Drag and drop files here, or click to browse
                      </p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="cyber-button-primary"
                      >
                        <Folder className="w-4 h-4 mr-2" />
                        Browse Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                        className="hidden"
                        aria-label="Upload media files"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleFileUpload(Array.from(e.target.files));
                          }
                        }}
                      />
                    </div>

                    {/* Attachments List */}
                    {formData.attachments.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Attachments</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {formData.attachments.map((attachment) => (
                            <Card key={attachment.id} className="cyber-card">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded bg-gray-700">
                                    {getMediaIcon(attachment.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-white truncate">
                                      {attachment.name}
                                    </h4>
                                    <p className="text-sm text-muted">
                                      {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    {attachment.type === 'image' && (
                                      <div className="mt-2">
                                        <img
                                          src={attachment.url}
                                          alt={attachment.alt || attachment.name}
                                          className="w-full h-20 object-cover rounded"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAttachment(attachment.id)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-4">
                    <div>
                      <Label htmlFor="seoTitle">SEO Title</Label>
                      <Input
                        id="seoTitle"
                        value={formData.seoTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                        placeholder="SEO optimized title (60 chars max)"
                        maxLength={60}
                      />
                      <p className="text-xs text-muted mt-1">
                        {formData.seoTitle.length}/60 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="seoDescription">SEO Description</Label>
                      <Textarea
                        id="seoDescription"
                        value={formData.seoDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                        placeholder="SEO meta description (160 chars max)"
                        maxLength={160}
                        rows={3}
                      />
                      <p className="text-xs text-muted mt-1">
                        {formData.seoDescription.length}/160 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="featuredImage">Featured Image URL</Label>
                      <Input
                        id="featuredImage"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Post Status</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="publishDate">Publish Date</Label>
                        <Input
                          id="publishDate"
                          type="datetime-local"
                          value={formData.publishDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Allow Comments</Label>
                          <p className="text-sm text-muted">Enable comments for this post</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Featured Post</Label>
                          <p className="text-sm text-muted">Mark as featured on homepage</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable Social Sharing</Label>
                          <p className="text-sm text-muted">Show social sharing buttons</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-4">
                    <Card className="cyber-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          AI Content Assistant
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Content Templates</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {contentTemplates.map((template) => (
                              <Button
                                key={template.id}
                                variant="outline"
                                className="h-auto p-3 text-left"
                                onClick={() => setAiAssistant(prev => ({ 
                                  ...prev, 
                                  selectedTemplate: template.id 
                                }))}
                              >
                                <div>
                                  <div className="font-medium">{template.name}</div>
                                  <div className="text-xs text-muted">{template.description}</div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Quick Actions</Label>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateContent('title')}
                              disabled={aiAssistant.isGenerating}
                            >
                              <Wand2 className="w-4 h-4 mr-2" />
                              Generate Title
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateContent('excerpt')}
                              disabled={aiAssistant.isGenerating}
                            >
                              <Wand2 className="w-4 h-4 mr-2" />
                              Generate Excerpt
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateContent('content')}
                              disabled={aiAssistant.isGenerating}
                            >
                              <Wand2 className="w-4 h-4 mr-2" />
                              Generate Content
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateContent('tags')}
                              disabled={aiAssistant.isGenerating}
                            >
                              <Wand2 className="w-4 h-4 mr-2" />
                              Suggest Tags
                            </Button>
                          </div>
                        </div>

                        {aiAssistant.isGenerating && (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            <p className="text-sm text-muted">AI is generating content...</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : selectedPost ? (
            /* Post Preview */
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedPost.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${getStatusColor(selectedPost.status)} text-white`}>
                        {selectedPost.status}
                      </Badge>
                      <Badge variant="outline">{selectedPost.category}</Badge>
                      <span className="text-sm text-muted">
                        {selectedPost.readTime} min read
                      </span>
                      <span className="text-sm text-muted">
                        {selectedPost.views} views
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => editPost(selectedPost)}
                    className="cyber-button-primary"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-300 mb-6">{selectedPost.excerpt}</p>
                  <div className="whitespace-pre-wrap">{selectedPost.content}</div>
                </div>
                
                {selectedPost.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">Attachments</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedPost.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 p-2 rounded bg-gray-800">
                          {getMediaIcon(attachment.type)}
                          <span className="text-sm truncate">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Welcome State */
            <Card className="cyber-card">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-6 text-muted" />
                <h3 className="text-2xl font-bold text-white mb-2">Enhanced Blog Manager</h3>
                <p className="text-lg text-muted mb-6">
                  Create engaging blog posts with rich media, AI assistance, and advanced customization
                </p>
                <div className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-8">
                  <div className="flex items-start gap-3">
                    <ImageIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Rich Media Support</h4>
                      <p className="text-sm text-muted">Upload images, videos, and documents with drag-and-drop</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wand2 className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">AI Content Generation</h4>
                      <p className="text-sm text-muted">Generate titles, excerpts, and full content with AI</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Search className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">SEO Optimization</h4>
                      <p className="text-sm text-muted">Built-in SEO tools and meta tag management</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Publishing Control</h4>
                      <p className="text-sm text-muted">Draft, schedule, and publish with advanced settings</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsEditing(true);
                    setSelectedPost(null);
                  }}
                  className="cyber-button-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedBlogManager;