'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Plus, 
  Save, 
  Edit,
  Trash2,
  Search,
  BookOpen,
  Zap,
  RefreshCw,
  Database,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { BlogPost } from '../../../lib/types';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  source: 'manual' | 'blog' | 'ai-generated';
  createdAt: Date;
  updatedAt: Date;
  embedding?: number[];
}

interface SyncProgress {
  isRunning: boolean;
  progress: number;
  currentStep: string;
  itemsProcessed: number;
  totalItems: number;
  errors: string[];
}

interface KnowledgeBaseManagerProps {
  blogPosts?: BlogPost[];
  knowledgeItems?: KnowledgeItem[];
  onCreateKnowledge?: (item: Partial<KnowledgeItem>) => void;
  onUpdateKnowledge?: (id: string, item: Partial<KnowledgeItem>) => void;
  onDeleteKnowledge?: (id: string) => void;
  onSyncWithAI?: (includeBlogPosts: boolean) => Promise<void>;
}

export function KnowledgeBaseManager({
  blogPosts = [],
  knowledgeItems = [],
  onCreateKnowledge,
  onUpdateKnowledge,
  onDeleteKnowledge,
  onSyncWithAI
}: KnowledgeBaseManagerProps) {
  const [editingItem, setEditingItem] = useState<Partial<KnowledgeItem> | null>(null);
  const [formData, setFormData] = useState<Partial<KnowledgeItem>>({
    title: '',
    content: '',
    tags: [],
    source: 'manual'
  });
  const [tagInput, setTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncProgress, setSyncProgress] = useState<SyncProgress>({
    isRunning: false,
    progress: 0,
    currentStep: '',
    itemsProcessed: 0,
    totalItems: 0,
    errors: []
  });
  const [includeBlogPosts, setIncludeBlogPosts] = useState(true);

  const handleTagsChange = (value: string) => {
    setTagInput(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSave = () => {
    const itemData: Partial<KnowledgeItem> = {
      ...formData,
      createdAt: editingItem?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingItem?.id) {
      onUpdateKnowledge?.(editingItem.id, itemData);
    } else {
      onCreateKnowledge?.(itemData);
    }
    
    handleCancel();
  };

  const handleEdit = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormData(item);
    setTagInput(item.tags.join(', '));
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      tags: [],
      source: 'manual'
    });
    setTagInput('');
  };

  const handleSyncWithAI = async () => {
    setSyncProgress({
      isRunning: true,
      progress: 0,
      currentStep: 'Initializing sync...',
      itemsProcessed: 0,
      totalItems: knowledgeItems.length + (includeBlogPosts ? blogPosts.length : 0),
      errors: []
    });

    try {
      // Simulate AI sync process
      const steps = [
        'Analyzing existing knowledge base...',
        'Processing blog posts...',
        'Generating embeddings...',
        'Creating AI-enhanced content...',
        'Updating knowledge base...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setSyncProgress(prev => ({
          ...prev,
          currentStep: steps[i] || '',
          progress: ((i + 1) / steps.length) * 100,
          itemsProcessed: Math.floor(((i + 1) / steps.length) * prev.totalItems)
        }));

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Call the actual sync function
      if (onSyncWithAI) {
        await onSyncWithAI(includeBlogPosts);
      }

      setSyncProgress(prev => ({
        ...prev,
        isRunning: false,
        currentStep: 'Sync completed successfully!',
        progress: 100,
        itemsProcessed: prev.totalItems
      }));

    } catch (error) {
      setSyncProgress(prev => ({
        ...prev,
        isRunning: false,
        currentStep: 'Sync failed',
        errors: [...prev.errors, error instanceof Error ? error.message : 'Unknown error']
      }));
    }
  };

  const filteredItems = knowledgeItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSourceIcon = (source: KnowledgeItem['source']) => {
    switch (source) {
      case 'blog':
        return <BookOpen className="w-4 h-4" />;
      case 'ai-generated':
        return <Brain className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source: KnowledgeItem['source']) => {
    switch (source) {
      case 'blog':
        return 'bg-blue-600/20 text-blue-300';
      case 'ai-generated':
        return 'bg-purple-600/20 text-purple-300';
      default:
        return 'bg-gray-600/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Sync Section */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Knowledge Sync
          </CardTitle>
          <CardDescription className="text-muted">
            Enhance your knowledge base with AI-powered content analysis and generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeBlogPosts"
              checked={includeBlogPosts}
              onChange={(e) => setIncludeBlogPosts(e.target.checked)}
              className="w-4 h-4 text-violet-600 bg-gray-800 border-gray-600 rounded focus:ring-violet-500 focus:ring-2"
              aria-label="Include blog posts in sync"
            />
            <Label htmlFor="includeBlogPosts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Include blog posts in AI analysis ({blogPosts.length} posts)
            </Label>
          </div>

          {syncProgress.isRunning ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">{syncProgress.currentStep}</span>
              </div>
              <Progress value={syncProgress.progress} className="w-full" />
              <div className="text-xs text-gray-400">
                Processed {syncProgress.itemsProcessed} of {syncProgress.totalItems} items
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={handleSyncWithAI}
                className="bg-violet-600 hover:bg-violet-700 text-white"
                disabled={syncProgress.isRunning}
              >
                <Zap className="w-4 h-4 mr-2" />
                Sync with AI
              </Button>
              {syncProgress.currentStep && !syncProgress.isRunning && (
                <div className="flex items-center gap-2 text-sm">
                  {syncProgress.errors.length > 0 ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                  <span className={syncProgress.errors.length > 0 ? 'text-red-400' : 'text-green-400'}>
                    {syncProgress.currentStep}
                  </span>
                </div>
              )}
            </div>
          )}

          {syncProgress.errors.length > 0 && (
            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
              <h4 className="text-red-400 font-medium mb-2">Sync Errors:</h4>
              <ul className="text-sm text-red-300 space-y-1">
                {syncProgress.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Knowledge Item */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingItem ? 'Edit Knowledge Item' : 'Add Knowledge Item'}
          </CardTitle>
          <CardDescription className="text-muted">
            {editingItem ? 'Update knowledge base content' : 'Add new content to your knowledge base'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter knowledge item title"
              className="dark-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter detailed content..."
              className="dark-input"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="technique, gear, production, composition"
              className="dark-input"
            />
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-violet-600/20 text-violet-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              className="bg-violet-600 hover:bg-violet-700 text-white"
              disabled={!formData.title || !formData.content}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
            {editingItem && (
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

      {/* Search and Knowledge Items List */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
            <Database className="w-5 h-5" />
            Knowledge Base ({knowledgeItems.length} items)
          </CardTitle>
          <CardDescription className="text-muted">
            Browse and manage your knowledge base content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge items..."
              className="dark-input pl-10"
            />
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">
                {searchQuery ? 'No items match your search' : 'No knowledge items created yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold">{item.title}</h3>
                        <Badge variant="outline" className={`text-xs ${getSourceColor(item.source)}`}>
                          {getSourceIcon(item.source)}
                          <span className="ml-1 capitalize">{item.source.replace('-', ' ')}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-3">{item.content}</p>
                      
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-violet-400/30 text-violet-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Created: {new Date(item.createdAt).toLocaleDateString()}
                        {item.updatedAt && item.updatedAt !== item.createdAt && (
                          <span className="ml-4">
                            Updated: {new Date(item.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onDeleteKnowledge?.(item.id)}
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