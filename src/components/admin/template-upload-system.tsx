'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Package, 
  File, 
  Folder, 
  Code, 
  Palette, 
  Download, 
  Trash2, 
  Eye, 
  Copy, 
  Check, 
  X, 
  Archive,
  FileText,
  Image,
  Settings,
  Zap,
  Layers,
  Cpu,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Search,
  Filter,
  Star,
  Clock,
  Tag,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content?: string | ArrayBuffer;
  path: string;
}

interface ExtractedTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  uploadDate: string;
  fileCount: number;
  totalSize: number;
  framework: string;
  components: ExtractedComponent[];
  styles: ExtractedStyle[];
  assets: ExtractedAsset[];
  packageJson?: any;
  readme?: string;
  preview?: string;
  isApplied: boolean;
  tags: string[];
}

interface ExtractedComponent {
  name: string;
  path: string;
  content: string;
  type: 'component' | 'page' | 'layout' | 'hook' | 'util';
  dependencies: string[];
  exports: string[];
  imports: string[];
  size: number;
}

interface ExtractedStyle {
  name: string;
  path: string;
  content: string;
  type: 'css' | 'scss' | 'tailwind' | 'styled-components';
  variables: string[];
  classes: string[];
  size: number;
}

interface ExtractedAsset {
  name: string;
  path: string;
  type: 'image' | 'font' | 'icon' | 'other';
  size: number;
  url?: string;
}

interface AnalysisResult {
  progress: number;
  currentFile: string;
  filesProcessed: number;
  totalFiles: number;
  errors: string[];
  warnings: string[];
}

const TemplateUploadSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    progress: 0,
    currentFile: '',
    filesProcessed: 0,
    totalFiles: 0,
    errors: [],
    warnings: []
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [extractedTemplates, setExtractedTemplates] = useState<ExtractedTemplate[]>([
    {
      id: 'template_1',
      name: 'Modern Portfolio Template',
      description: 'A sleek, responsive portfolio template with dark theme and animations',
      version: '1.0.0',
      author: 'Template Author',
      uploadDate: '2024-08-28',
      fileCount: 45,
      totalSize: 2.5 * 1024 * 1024, // 2.5MB
      framework: 'Next.js 14',
      components: [],
      styles: [],
      assets: [],
      packageJson: {
        name: 'modern-portfolio',
        version: '1.0.0',
        dependencies: {
          'react': '^18.0.0',
          'next': '^14.0.0',
          'tailwindcss': '^3.0.0'
        }
      },
      readme: 'A modern portfolio template with dark theme...',
      isApplied: false,
      tags: ['portfolio', 'dark-theme', 'responsive', 'animations']
    }
  ]);
  
  const [selectedTemplate, setSelectedTemplate] = useState<ExtractedTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [filterFramework, setFilterFramework] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated JSZip functionality for demonstration
  const analyzeZipFile = useCallback(async (file: File): Promise<ExtractedTemplate> => {
    setIsAnalyzing(true);
    setAnalysisResult({
      progress: 0,
      currentFile: '',
      filesProcessed: 0,
      totalFiles: 0,
      errors: [],
      warnings: []
    });

    // Simulate analysis progress
    const simulateAnalysis = async () => {
      const totalSteps = 10;
      for (let i = 0; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setAnalysisResult(prev => ({
          ...prev,
          progress: (i / totalSteps) * 100,
          currentFile: `Analyzing ${Math.random() > 0.5 ? 'components' : 'styles'}...`,
          filesProcessed: Math.floor((i / totalSteps) * 45),
          totalFiles: 45
        }));
      }
    };

    await simulateAnalysis();

    const template: ExtractedTemplate = {
      id: `template_${Date.now()}`,
      name: file.name.replace('.zip', ''),
      description: 'Extracted from uploaded ZIP file',
      version: '1.0.0',
      author: 'Unknown',
      uploadDate: new Date().toISOString().split('T')[0],
      fileCount: Math.floor(Math.random() * 100) + 20,
      totalSize: file.size,
      framework: 'React',
      components: [
        {
          name: 'Header',
          path: '/components/Header.tsx',
          content: 'import React from "react";\n\nexport const Header = () => {\n  return <header>Header Content</header>;\n};',
          type: 'component',
          dependencies: ['react'],
          exports: ['Header'],
          imports: ['React'],
          size: 1024
        },
        {
          name: 'Footer',
          path: '/components/Footer.tsx',
          content: 'import React from "react";\n\nexport const Footer = () => {\n  return <footer>Footer Content</footer>;\n};',
          type: 'component',
          dependencies: ['react'],
          exports: ['Footer'],
          imports: ['React'],
          size: 896
        }
      ],
      styles: [
        {
          name: 'globals.css',
          path: '/styles/globals.css',
          content: 'body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }',
          type: 'css',
          variables: ['--primary-color', '--secondary-color'],
          classes: ['.container', '.header', '.footer'],
          size: 2048
        }
      ],
      assets: [
        {
          name: 'logo.png',
          path: '/public/logo.png',
          type: 'image',
          size: 15360
        }
      ],
      packageJson: {
        name: file.name.replace('.zip', ''),
        version: '1.0.0',
        dependencies: {
          'react': '^18.0.0',
          'next': '^14.0.0'
        }
      },
      readme: 'Project extracted from ZIP file',
      isApplied: false,
      tags: ['extracted', 'zip', 'template']
    };

    setIsAnalyzing(false);
    return template;
  }, []);

  const handleFileUpload = useCallback(async (files: FileList) => {
    const zipFiles = Array.from(files).filter(file => 
      file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')
    );

    if (zipFiles.length === 0) {
      setAnalysisResult(prev => ({
        ...prev,
        errors: ['Please upload ZIP files only']
      }));
      return;
    }

    for (const file of zipFiles) {
      try {
        const template = await analyzeZipFile(file);
        setExtractedTemplates(prev => [...prev, template]);
        
        const fileData: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          path: `uploads/${file.name}`
        };
        setUploadedFiles(prev => [...prev, fileData]);
      } catch (error) {
        setAnalysisResult(prev => ({
          ...prev,
          errors: [...prev.errors, `Failed to analyze ${file.name}: ${error}`]
        }));
      }
    }
  }, [analyzeZipFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  }, [handleFileUpload]);

  const applyTemplate = useCallback((templateId: string) => {
    setExtractedTemplates(prev => prev.map(template => ({
      ...template,
      isApplied: template.id === templateId ? !template.isApplied : false
    })));
  }, []);

  const deleteTemplate = useCallback((templateId: string) => {
    setExtractedTemplates(prev => prev.filter(template => template.id !== templateId));
  }, []);

  const exportTemplate = useCallback((template: ExtractedTemplate) => {
    const templateData = {
      ...template,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFrameworkIcon = (framework: string) => {
    if (framework.toLowerCase().includes('next')) return <Package className="w-4 h-4" />;
    if (framework.toLowerCase().includes('react')) return <Code className="w-4 h-4" />;
    if (framework.toLowerCase().includes('vue')) return <Layers className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const filteredTemplates = extractedTemplates.filter(template => {
    const matchesFramework = filterFramework === 'all' || 
      template.framework.toLowerCase().includes(filterFramework.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFramework && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-3d-silver-violet silver-violet">Template Upload System</h2>
          <p className="text-muted mt-1">Upload and analyze ZIP files to extract design templates and components</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="cyber-button-primary"
            disabled={isAnalyzing}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload ZIP
          </Button>
          <Button variant="outline" className="cyber-button-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Analyzing ZIP File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{analysisResult.currentFile}</span>
                <span>{analysisResult.filesProcessed}/{analysisResult.totalFiles} files</span>
              </div>
              <Progress value={analysisResult.progress} className="h-2" />
              <div className="text-xs text-muted text-center">
                {Math.round(analysisResult.progress)}% complete
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error/Warning Messages */}
      {(analysisResult.errors.length > 0 || analysisResult.warnings.length > 0) && (
        <div className="space-y-2">
          {analysisResult.errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          ))}
          {analysisResult.warnings.map((warning, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm">{warning}</span>
            </div>
          ))}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="templates">Templates ({extractedTemplates.length})</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Upload Area */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Upload Project ZIP Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Drop ZIP files here or click to browse
                </h3>
                <p className="text-muted mb-6">
                  Upload React/Next.js project ZIP files to extract components, styles, and assets
                </p>
                
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="cyber-button-primary"
                  disabled={isAnalyzing}
                >
                  <File className="w-4 h-4 mr-2" />
                  Select Files
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".zip"
                  className="hidden"
                  onChange={handleFileInputChange}
                  aria-label="Upload ZIP files for template extraction"
                />
              </div>

              {/* Supported Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="cyber-card p-4 text-center">
                  <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">Project Analysis</div>
                  <div className="text-xs text-muted">Extract components & structure</div>
                </div>
                
                <div className="cyber-card p-4 text-center">
                  <Palette className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">Design Extraction</div>
                  <div className="text-xs text-muted">Colors, fonts, and themes</div>
                </div>
                
                <div className="cyber-card p-4 text-center">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">Live Application</div>
                  <div className="text-xs text-muted">Apply extracted templates</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Uploads */}
          {uploadedFiles.length > 0 && (
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Archive className="w-5 h-5 text-blue-400" />
                        <div>
                          <div className="font-medium text-white">{file.name}</div>
                          <div className="text-sm text-muted">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Processed
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Search and Filter */}
          <Card className="cyber-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted" />
                  <select
                    value={filterFramework}
                    onChange={(e) => setFilterFramework(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                    aria-label="Filter templates by framework"
                  >
                    <option value="all">All Frameworks</option>
                    <option value="next">Next.js</option>
                    <option value="react">React</option>
                    <option value="vue">Vue.js</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="cyber-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {getFrameworkIcon(template.framework)}
                        <span className="text-sm text-muted">{template.framework}</span>
                        <Badge variant="outline" className="text-xs">
                          v{template.version}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {template.isApplied && (
                        <Badge className="text-green-400 border-green-400">
                          <Check className="w-3 h-3 mr-1" />
                          Applied
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted">{template.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted">Files:</span>
                      <span className="text-white ml-2">{template.fileCount}</span>
                    </div>
                    <div>
                      <span className="text-muted">Size:</span>
                      <span className="text-white ml-2">{formatFileSize(template.totalSize)}</span>
                    </div>
                    <div>
                      <span className="text-muted">Components:</span>
                      <span className="text-white ml-2">{template.components.length}</span>
                    </div>
                    <div>
                      <span className="text-muted">Styles:</span>
                      <span className="text-white ml-2">{template.styles.length}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => applyTemplate(template.id)}
                      className={`cyber-button-primary ${template.isApplied ? 'bg-green-600' : ''}`}
                    >
                      {template.isApplied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Applied
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Apply
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTemplate(template)}
                      className="cyber-button-secondary"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportTemplate(template)}
                      className="cyber-button-secondary"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card className="cyber-card">
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted" />
                <h3 className="text-xl font-semibold text-white mb-2">No Templates Found</h3>
                <p className="text-muted">
                  {searchQuery || filterFramework !== 'all' 
                    ? 'No templates match your search criteria' 
                    : 'Upload some ZIP files to get started'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          {selectedTemplate ? (
            <div className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Components from {selectedTemplate.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewMode('desktop')}
                        className={previewMode === 'desktop' ? 'bg-primary' : ''}
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewMode('tablet')}
                        className={previewMode === 'tablet' ? 'bg-primary' : ''}
                      >
                        <Tablet className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewMode('mobile')}
                        className={previewMode === 'mobile' ? 'bg-primary' : ''}
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {selectedTemplate.components.map((component, index) => (
                      <Card key={index} className="cyber-card">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{component.name}</CardTitle>
                            <Badge variant="outline">{component.type}</Badge>
                          </div>
                          <p className="text-sm text-muted">{component.path}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-sm">
                            <span className="text-muted">Size:</span>
                            <span className="text-white ml-2">{formatFileSize(component.size)}</span>
                          </div>
                          
                          <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                            <pre className="text-xs text-gray-300">
                              <code>{component.content.substring(0, 200)}...</code>
                            </pre>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="cyber-button-secondary">
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                            <Button size="sm" variant="outline" className="cyber-button-secondary">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Full
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="cyber-card">
              <CardContent className="p-8 text-center">
                <Code className="w-16 h-16 mx-auto mb-4 text-muted" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Template</h3>
                <p className="text-muted">Choose a template from the Templates tab to view its components</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Processing Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted">Total Templates</span>
                  <span className="text-white font-medium">{extractedTemplates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Components</span>
                  <span className="text-white font-medium">
                    {extractedTemplates.reduce((sum, t) => sum + t.components.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Files</span>
                  <span className="text-white font-medium">
                    {extractedTemplates.reduce((sum, t) => sum + t.fileCount, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Size</span>
                  <span className="text-white font-medium">
                    {formatFileSize(extractedTemplates.reduce((sum, t) => sum + t.totalSize, 0))}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-analyze uploads</Label>
                    <p className="text-sm text-muted">Automatically analyze ZIP files on upload</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Extract preview images</Label>
                    <p className="text-sm text-muted">Generate component previews</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cache analysis results</Label>
                    <p className="text-sm text-muted">Store analysis for faster access</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Analysis Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <div className="flex-1">
                    <div className="text-sm text-white">Modern Portfolio Template processed successfully</div>
                    <div className="text-xs text-muted">45 files • 2.5MB • 8 components extracted</div>
                  </div>
                  <div className="text-xs text-muted">2 min ago</div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <Info className="w-4 h-4 text-blue-400" />
                  <div className="flex-1">
                    <div className="text-sm text-white">Template system initialized</div>
                    <div className="text-xs text-muted">Ready for ZIP file uploads</div>
                  </div>
                  <div className="text-xs text-muted">5 min ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateUploadSystem;