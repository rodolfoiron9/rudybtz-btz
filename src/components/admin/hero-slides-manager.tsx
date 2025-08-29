'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Image as ImageIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download, 
  Save, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Eye,
  Settings,
  Move,
  Layers,
  Clock,
  Zap,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUp,
  ArrowDown,
  X,
  Video,
  FileImage,
  Palette
} from 'lucide-react';

import { HeroSlide } from '@/lib/types';

interface HeroSettings {
  autoPlay: boolean;
  loopSlides: boolean;
  transitionDuration: number;
  showDots: boolean;
  showArrows: boolean;
  pauseOnHover: boolean;
  fullHeight: boolean;
  overlayColor: string;
}

const HeroSlidesManager: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([
    {
      id: 'slide_1',
      title: 'Welcome to Rudy Albums',
      subtitle: 'AI-Powered Music Portfolio',
      description: 'Experience the future of music with cutting-edge AI visualization and real-time audio analysis.',
      type: 'image',
      mediaUrl: '/hero-bg-1.jpg',
      overlayOpacity: 0.4,
      textPosition: 'center',
      animation: 'fade',
      duration: 5000,
      isActive: true,
      order: 1,
      callToAction: {
        text: 'Explore Music',
        url: '/albums',
        style: 'primary'
      }
    }
  ]);

  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [currentPreviewSlide, setCurrentPreviewSlide] = useState(0);
  
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    autoPlay: true,
    loopSlides: true,
    transitionDuration: 800,
    showDots: true,
    showArrows: true,
    pauseOnHover: true,
    fullHeight: true,
    overlayColor: '#000000'
  });

  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for editing
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    type: 'image' as 'image' | 'video',
    mediaUrl: '',
    overlayOpacity: 0.4,
    textPosition: 'center' as 'left' | 'center' | 'right',
    animation: 'fade' as 'fade' | 'slide' | 'zoom' | 'parallax',
    duration: 5000,
    ctaText: undefined as string | undefined,
    ctaUrl: undefined as string | undefined,
    ctaStyle: undefined as 'primary' | 'secondary' | 'outline' | undefined,
    customCSS: ''
  });

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
    if (files.length > 0 && files[0]) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      alert('Please upload an image or video file');
      return;
    }

    const url = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      mediaUrl: url,
      type: isVideo ? 'video' : 'image'
    }));
  };

  // Slide management
  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide_${Date.now()}`,
      title: formData.title || 'New Slide',
      subtitle: formData.subtitle || '',
      description: formData.description || '',
      type: formData.type,
      mediaUrl: formData.mediaUrl,
      overlayOpacity: formData.overlayOpacity,
      textPosition: formData.textPosition,
      animation: formData.animation,
      duration: formData.duration,
      isActive: true,
      order: slides.length + 1,
      callToAction: formData.ctaText && formData.ctaUrl && formData.ctaStyle ? {
        text: formData.ctaText,
        url: formData.ctaUrl,
        style: formData.ctaStyle
      } : undefined,
      customCSS: formData.customCSS || ''
    };

    setSlides(prev => [...prev, newSlide]);
    resetForm();
    setIsEditing(false);
  };

  const updateSlide = () => {
    if (!selectedSlide) return;

    const updatedSlide: HeroSlide = {
      ...selectedSlide,
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      type: formData.type,
      mediaUrl: formData.mediaUrl,
      overlayOpacity: formData.overlayOpacity,
      textPosition: formData.textPosition,
      animation: formData.animation,
      duration: formData.duration,
      callToAction: formData.ctaText ? {
        text: formData.ctaText,
        url: formData.ctaUrl,
        style: formData.ctaStyle
      } : undefined,
      customCSS: formData.customCSS
    };

    setSlides(prev => prev.map(slide => 
      slide.id === selectedSlide.id ? updatedSlide : slide
    ));

    setIsEditing(false);
    setSelectedSlide(updatedSlide);
  };

  const deleteSlide = (slideId: string) => {
    setSlides(prev => prev.filter(slide => slide.id !== slideId));
    if (selectedSlide?.id === slideId) {
      setSelectedSlide(null);
      setIsEditing(false);
    }
  };

  const editSlide = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      type: slide.type,
      mediaUrl: slide.mediaUrl,
      overlayOpacity: slide.overlayOpacity,
      textPosition: slide.textPosition,
      animation: slide.animation,
      duration: slide.duration,
      ctaText: slide.callToAction?.text,
      ctaUrl: slide.callToAction?.url,
      ctaStyle: slide.callToAction?.style,
      customCSS: slide.customCSS || ''
    });
    setIsEditing(true);
  };

  const moveSlide = (slideId: string, direction: 'up' | 'down') => {
    setSlides(prev => {
      const slideIndex = prev.findIndex(s => s.id === slideId);
      if (slideIndex === -1) return prev;

      const newSlides = [...prev];
      const targetIndex = direction === 'up' ? slideIndex - 1 : slideIndex + 1;

      if (targetIndex < 0 || targetIndex >= newSlides.length) return prev;

      // Swap slides
      [newSlides[slideIndex], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[slideIndex]];
      
      // Update order numbers
      newSlides.forEach((slide, index) => {
        slide.order = index + 1;
      });

      return newSlides;
    });
  };

  const toggleSlideActive = (slideId: string) => {
    setSlides(prev => prev.map(slide => 
      slide.id === slideId ? { ...slide, isActive: !slide.isActive } : slide
    ));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      type: 'image',
      mediaUrl: '',
      overlayOpacity: 0.4,
      textPosition: 'center',
      animation: 'fade',
      duration: 5000,
      ctaText: '',
      ctaUrl: '',
      ctaStyle: 'primary',
      customCSS: ''
    });
  };

  // Preview controls
  const startPreview = () => {
    setIsPreviewPlaying(true);
    if (heroSettings.autoPlay) {
      // Auto-advance slides in preview
      const interval = setInterval(() => {
        setCurrentPreviewSlide(prev => {
          const activeSlides = slides.filter(s => s.isActive);
          const nextIndex = (prev + 1) % activeSlides.length;
          return nextIndex;
        });
      }, slides[currentPreviewSlide]?.duration || 5000);

      return () => clearInterval(interval);
    }
  };

  const stopPreview = () => {
    setIsPreviewPlaying(false);
  };

  const nextSlide = () => {
    const activeSlides = slides.filter(s => s.isActive);
    setCurrentPreviewSlide(prev => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    const activeSlides = slides.filter(s => s.isActive);
    setCurrentPreviewSlide(prev => prev === 0 ? activeSlides.length - 1 : prev - 1);
  };

  const activeSlides = slides.filter(s => s.isActive);
  const currentSlide = activeSlides[currentPreviewSlide];

  const getPreviewSize = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'w-full';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-3d-silver-violet silver-violet">Hero Slides Manager</h2>
          <p className="text-muted mt-1">Create and manage homepage hero slideshow with images, videos, and animations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              resetForm();
              setIsEditing(true);
              setSelectedSlide(null);
            }}
            className="cyber-button-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Slide
          </Button>
          <Button variant="outline" className="cyber-button-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-muted">Total Slides</p>
                <p className="text-2xl font-bold text-white">{slides.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-muted">Active</p>
                <p className="text-2xl font-bold text-white">{activeSlides.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-muted">Avg Duration</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(slides.reduce((acc, s) => acc + s.duration, 0) / slides.length / 1000) || 0}s
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-muted">Auto Play</p>
                <p className="text-2xl font-bold text-white">{heroSettings.autoPlay ? 'ON' : 'OFF'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Slides List & Editor */}
        <div className="col-span-5">
          {/* Slides List */}
          <Card className="cyber-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Slides ({slides.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                      selectedSlide?.id === slide.id ? 'bg-gray-800' : ''
                    }`}
                    onClick={() => setSelectedSlide(slide)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {slide.type === 'video' ? (
                            <Video className="w-8 h-8 text-blue-400" />
                          ) : (
                            <FileImage className="w-8 h-8 text-green-400" />
                          )}
                          {!slide.isActive && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">{slide.title}</h4>
                          <p className="text-sm text-muted truncate">{slide.subtitle}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {slide.animation}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {slide.duration / 1000}s
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSlide(slide.id, 'up');
                          }}
                          disabled={index === 0}
                          aria-label="Move slide up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSlide(slide.id, 'down');
                          }}
                          disabled={index === slides.length - 1}
                          aria-label="Move slide down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            editSlide(slide);
                          }}
                          aria-label="Edit slide"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSlideActive(slide.id);
                          }}
                          aria-label="Toggle slide active"
                        >
                          <Eye className={`w-3 h-3 ${slide.isActive ? 'text-green-400' : 'text-gray-500'}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSlide(slide.id);
                          }}
                          aria-label="Delete slide"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {slides.length === 0 && (
                  <div className="p-8 text-center text-muted">
                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No slides created yet</p>
                    <p className="text-sm mt-1">Add your first hero slide to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Editor */}
          {isEditing && (
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedSlide ? 'Edit Slide' : 'Create New Slide'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      resetForm();
                    }}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Slide title..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Slide subtitle..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Slide description..."
                    rows={3}
                  />
                </div>

                {/* Media Upload */}
                <div>
                  <Label>Background Media</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      dragOver 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted" />
                    <p className="text-sm text-muted mb-2">
                      Drag & drop an image or video, or click to browse
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="cyber-button-secondary"
                    >
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      aria-label="Upload media file"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                  {formData.mediaUrl && (
                    <div className="mt-2 p-2 bg-gray-800 rounded">
                      <p className="text-xs text-green-400">
                        ✓ Media uploaded: {formData.type}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label id="text-position-label" htmlFor="textPosition">Text Position</Label>
                    <Select 
                      value={formData.textPosition}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, textPosition: value }))}
                    >
                      <SelectTrigger aria-labelledby="text-position-label">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label id="animation-label" htmlFor="animation">Animation</Label>
                    <Select 
                      value={formData.animation}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, animation: value }))}
                    >
                      <SelectTrigger aria-labelledby="animation-label">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fade">Fade</SelectItem>
                        <SelectItem value="slide">Slide</SelectItem>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="parallax">Parallax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (ms)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      min={1000}
                      step={500}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="overlayOpacity">Overlay Opacity: {formData.overlayOpacity}</Label>
                  <input
                    id="overlayOpacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.overlayOpacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
                    className="w-full mt-1"
                  />
                </div>

                {/* Call to Action */}
                <div className="space-y-3">
                  <Label>Call to Action (Optional)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ctaText">Button Text</Label>
                      <Input
                        id="ctaText"
                        placeholder="Button text"
                        value={formData.ctaText}
                        onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ctaUrl">Button URL</Label>
                      <Input
                        id="ctaUrl"
                        placeholder="Button URL"
                        value={formData.ctaUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, ctaUrl: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={selectedSlide ? updateSlide : addSlide}
                    className="cyber-button-primary flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {selectedSlide ? 'Update Slide' : 'Add Slide'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      resetForm();
                    }}
                    className="cyber-button-secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview & Settings */}
        <div className="col-span-7">
          {/* Preview Controls */}
          <Card className="cyber-card mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                    aria-label="Desktop preview"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('tablet')}
                    aria-label="Tablet preview"
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                    aria-label="Mobile preview"
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  disabled={activeSlides.length === 0}
                  aria-label="Previous slide"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isPreviewPlaying ? stopPreview : startPreview}
                  disabled={activeSlides.length === 0}
                  aria-label={isPreviewPlaying ? 'Pause' : 'Play'}
                >
                  {isPreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  disabled={activeSlides.length === 0}
                  aria-label="Next slide"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                <div className="text-sm text-muted ml-4">
                  {activeSlides.length > 0 ? `${currentPreviewSlide + 1} / ${activeSlides.length}` : 'No active slides'}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`mx-auto ${getPreviewSize()}`}>
                <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
                  {currentSlide ? (
                    <>
                      {/* Background Media */}
                      {currentSlide.type === 'image' ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${currentSlide.mediaUrl})`,
                            filter: `brightness(${1 - currentSlide.overlayOpacity})`
                          }}
                        />
                      ) : (
                        <video 
                          className="absolute inset-0 w-full h-full object-cover"
                          src={currentSlide.mediaUrl}
                          muted
                          loop
                          style={{ filter: `brightness(${1 - currentSlide.overlayOpacity})` }}
                        />
                      )}
                      
                      {/* Overlay */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundColor: heroSettings.overlayColor,
                          opacity: currentSlide.overlayOpacity
                        }}
                      />
                      
                      {/* Content */}
                      <div className={`absolute inset-0 flex items-center ${
                        currentSlide.textPosition === 'left' ? 'justify-start pl-8' :
                        currentSlide.textPosition === 'right' ? 'justify-end pr-8' :
                        'justify-center'
                      }`}>
                        <div className={`text-center ${currentSlide.textPosition !== 'center' ? 'text-left' : ''} max-w-md`}>
                          <h1 className="text-2xl font-bold text-white mb-2">{currentSlide.title}</h1>
                          {currentSlide.subtitle && (
                            <h2 className="text-lg text-gray-300 mb-3">{currentSlide.subtitle}</h2>
                          )}
                          {currentSlide.description && (
                            <p className="text-gray-400 mb-4 text-sm">{currentSlide.description}</p>
                          )}
                          {currentSlide.callToAction && (
                            <Button 
                              className={`cyber-button-${currentSlide.callToAction.style}`}
                              size="sm"
                            >
                              {currentSlide.callToAction.text}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Slide Indicators */}
                      {heroSettings.showDots && activeSlides.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {activeSlides.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentPreviewSlide ? 'bg-white' : 'bg-white/50'
                              }`}
                              onClick={() => setCurrentPreviewSlide(index)}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted" />
                        <p className="text-muted">No active slides to preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Slideshow Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Play</Label>
                      <p className="text-sm text-muted">Automatically advance slides</p>
                    </div>
                    <Switch
                      checked={heroSettings.autoPlay}
                      onCheckedChange={(checked) => 
                        setHeroSettings(prev => ({ ...prev, autoPlay: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Loop Slides</Label>
                      <p className="text-sm text-muted">Return to first slide after last</p>
                    </div>
                    <Switch
                      checked={heroSettings.loopSlides}
                      onCheckedChange={(checked) => 
                        setHeroSettings(prev => ({ ...prev, loopSlides: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Dots</Label>
                      <p className="text-sm text-muted">Display slide indicators</p>
                    </div>
                    <Switch
                      checked={heroSettings.showDots}
                      onCheckedChange={(checked) => 
                        setHeroSettings(prev => ({ ...prev, showDots: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Arrows</Label>
                      <p className="text-sm text-muted">Display navigation arrows</p>
                    </div>
                    <Switch
                      checked={heroSettings.showArrows}
                      onCheckedChange={(checked) => 
                        setHeroSettings(prev => ({ ...prev, showArrows: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Pause on Hover</Label>
                      <p className="text-sm text-muted">Pause autoplay when hovering</p>
                    </div>
                    <Switch
                      checked={heroSettings.pauseOnHover}
                      onCheckedChange={(checked) => 
                        setHeroSettings(prev => ({ ...prev, pauseOnHover: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Full Height</Label>
                      <p className="text-sm text-muted">Use full viewport height</p>
                    </div>
                    <Switch
                      checked={heroSettings.fullHeight}
                      onCheckedChange={(checked) => 
                        setHeroSettings(prev => ({ ...prev, fullHeight: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transitionDuration">Transition Duration (ms)</Label>
                  <Input
                    id="transitionDuration"
                    type="number"
                    value={heroSettings.transitionDuration}
                    onChange={(e) => setHeroSettings(prev => ({ 
                      ...prev, 
                      transitionDuration: parseInt(e.target.value) 
                    }))}
                    min={200}
                    step={100}
                  />
                </div>
                <div>
                  <Label htmlFor="overlayColor">Default Overlay Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="overlayColor"
                      type="color"
                      value={heroSettings.overlayColor}
                      onChange={(e) => setHeroSettings(prev => ({ 
                        ...prev, 
                        overlayColor: e.target.value 
                      }))}
                      className="w-16"
                    />
                    <Input
                      value={heroSettings.overlayColor}
                      onChange={(e) => setHeroSettings(prev => ({ 
                        ...prev, 
                        overlayColor: e.target.value 
                      }))}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="cyber-button-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
                <Button variant="outline" className="cyber-button-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Export Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSlidesManager;