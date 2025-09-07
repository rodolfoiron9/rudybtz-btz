import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  X, 
  FileAudio, 
  FileImage, 
  FileVideo, 
  File,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  fileUploadService, 
  FileValidation, 
  UploadResult,
  formatFileSize,
  getFileTypeCategory,
  FILE_VALIDATIONS
} from '@/lib/file-upload-service';

interface FileUploadProps {
  path: string;
  accept?: string;
  multiple?: boolean;
  validation?: FileValidation;
  onUploadComplete?: (results: UploadResult[]) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

interface FileUploadState {
  files: File[];
  uploading: boolean;
  progress: Record<string, number>;
  completed: Record<string, UploadResult>;
  errors: Record<string, string>;
}

export function FileUpload({
  path,
  accept,
  multiple = false,
  validation,
  onUploadComplete,
  onUploadError,
  className = '',
  children
}: FileUploadProps) {
  const [state, setState] = useState<FileUploadState>({
    files: [],
    uploading: false,
    progress: {},
    completed: {},
    errors: {}
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    
    // Validate files
    const validFiles: File[] = [];
    const newErrors: Record<string, string> = {};

    newFiles.forEach(file => {
      try {
        if (validation) {
          fileUploadService.validateFile(file, validation);
        }
        validFiles.push(file);
      } catch (error) {
        newErrors[file.name] = (error as Error).message;
      }
    });

    setState(prev => ({
      ...prev,
      files: multiple ? [...prev.files, ...validFiles] : validFiles,
      errors: { ...prev.errors, ...newErrors }
    }));
  }, [validation, multiple]);

  const removeFile = useCallback((fileName: string) => {
    setState(prev => {
      const newProgress = { ...prev.progress };
      const newCompleted = { ...prev.completed };
      const newErrors = { ...prev.errors };
      
      delete newProgress[fileName];
      delete newCompleted[fileName];
      delete newErrors[fileName];
      
      return {
        ...prev,
        files: prev.files.filter(f => f.name !== fileName),
        progress: newProgress,
        completed: newCompleted,
        errors: newErrors
      };
    });
  }, []);

  const uploadFiles = useCallback(async () => {
    if (state.files.length === 0) return;

    setState(prev => ({ ...prev, uploading: true }));

    try {
      const results = await fileUploadService.uploadMultipleFiles(
        state.files,
        path,
        {
          onFileProgress: (fileName: string, progress: number) => {
            setState(prev => ({
              ...prev,
              progress: { ...prev.progress, [fileName]: progress }
            }));
          },
          onFileComplete: (fileName: string, downloadURL: string) => {
            const file = state.files.find(f => f.name === fileName);
            if (file) {
              const result: UploadResult = {
                downloadURL,
                fileName,
                size: file.size,
                contentType: file.type
              };
              setState(prev => ({
                ...prev,
                completed: { ...prev.completed, [fileName]: result }
              }));
            }
          },
          onFileError: (fileName: string, error: Error) => {
            setState(prev => ({
              ...prev,
              errors: { ...prev.errors, [fileName]: error.message }
            }));
            onUploadError?.(error);
          },
          ...(validation && { validation })
        }
      );

      onUploadComplete?.(results);
    } catch (error) {
      onUploadError?.(error as Error);
    } finally {
      setState(prev => ({ ...prev, uploading: false }));
    }
  }, [state.files, path, validation, onUploadComplete, onUploadError]);

  const getFileIcon = (file: File) => {
    const category = getFileTypeCategory(file);
    switch (category) {
      case 'audio': return <FileAudio className="w-4 h-4" />;
      case 'image': return <FileImage className="w-4 h-4" />;
      case 'video': return <FileVideo className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getTotalProgress = () => {
    if (state.files.length === 0) return 0;
    const totalProgress = Object.values(state.progress).reduce((sum, progress) => sum + (progress || 0), 0);
    return totalProgress / state.files.length;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('border-cyan-400');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-cyan-400');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-cyan-400');
          handleFileSelect(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          aria-label={multiple ? "Select files to upload" : "Select file to upload"}
        />
        
        {children || (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                {multiple ? 'Drop files here or click to browse' : 'Drop a file here or click to browse'}
              </p>
              <p className="text-xs text-gray-500">
                {validation ? (
                  <>
                    Max size: {formatFileSize(validation.maxSize || 0)} | 
                    Types: {validation.allowedExtensions?.join(', ')}
                  </>
                ) : 'All file types accepted'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Files */}
      {state.files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Selected Files ({state.files.length})
            </h4>
            <Button
              onClick={uploadFiles}
              disabled={state.uploading}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {state.uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>

          {/* Overall Progress */}
          {state.uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Overall Progress</span>
                <span>{getTotalProgress().toFixed(0)}%</span>
              </div>
              <Progress value={getTotalProgress()} className="h-2" />
            </div>
          )}

          {/* File List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {state.files.map((file) => {
              const progress = state.progress[file.name] || 0;
              const completed = state.completed[file.name];
              const error = state.errors[file.name];

              return (
                <div
                  key={file.name}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  {getFileIcon(file)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2">
                        {completed && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        {error && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.name)}
                          disabled={state.uploading}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    
                    {state.uploading && !completed && !error && (
                      <div className="mt-1">
                        <Progress value={progress} className="h-1" />
                      </div>
                    )}
                    
                    {error && (
                      <p className="text-xs text-red-500 mt-1">{error}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Errors */}
      {Object.keys(state.errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some files couldn&apos;t be uploaded. Check individual file errors above.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Specialized upload components
export function AudioUpload(props: Omit<FileUploadProps, 'validation' | 'accept'>) {
  return (
    <FileUpload
      {...props}
      accept="audio/*"
      validation={FILE_VALIDATIONS.audio}
    />
  );
}

export function ImageUpload(props: Omit<FileUploadProps, 'validation' | 'accept'>) {
  return (
    <FileUpload
      {...props}
      accept="image/*"
      validation={FILE_VALIDATIONS.image}
    />
  );
}

export function VideoUpload(props: Omit<FileUploadProps, 'validation' | 'accept'>) {
  return (
    <FileUpload
      {...props}
      accept="video/*"
      validation={FILE_VALIDATIONS.video}
    />
  );
}