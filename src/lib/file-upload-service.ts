import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  getMetadata,
  StorageReference
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

// File upload types
export interface FileUploadOptions {
  onProgress?: (progress: number) => void;
  onComplete?: (downloadURL: string) => void;
  onError?: (error: Error) => void;
}

export interface FileValidation {
  maxSize?: number; // in bytes
  allowedTypes?: readonly string[];
  allowedExtensions?: readonly string[];
}

export interface UploadResult {
  downloadURL: string;
  fileName: string;
  size: number;
  contentType: string;
  metadata?: any;
}

// Default validations for different file types
export const FILE_VALIDATIONS = {
  audio: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/flac', 'audio/aac'],
    allowedExtensions: ['.mp3', '.wav', '.flac', '.aac', '.m4a']
  },
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    allowedExtensions: ['.mp4', '.webm', '.mov']
  },
  document: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'text/plain', 'application/json'],
    allowedExtensions: ['.pdf', '.txt', '.json', '.md']
  }
} as const;

// File upload paths
export const STORAGE_PATHS = {
  albums: 'albums',
  covers: 'album-covers',
  audio: 'audio-tracks',
  videos: 'videos',
  images: 'images',
  documents: 'documents',
  temp: 'temp'
} as const;

class FileUploadService {
  /**
   * Validate file before upload
   */
  validateFile(file: File, validation?: FileValidation): void {
    if (!validation) return;

    // Check file size
    if (validation.maxSize && file.size > validation.maxSize) {
      throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${(validation.maxSize / 1024 / 1024).toFixed(2)}MB`);
    }

    // Check file type
    if (validation.allowedTypes && !validation.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${validation.allowedTypes.join(', ')}`);
    }

    // Check file extension
    if (validation.allowedExtensions) {
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validation.allowedExtensions.includes(fileExt)) {
        throw new Error(`File extension ${fileExt} is not allowed. Allowed extensions: ${validation.allowedExtensions.join(', ')}`);
      }
    }
  }

  /**
   * Generate safe filename
   */
  generateSafeFileName(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const baseName = originalName.split('.').slice(0, -1).join('.')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .toLowerCase();
    
    const fileName = prefix 
      ? `${prefix}_${baseName}_${timestamp}_${randomId}.${extension}`
      : `${baseName}_${timestamp}_${randomId}.${extension}`;
    
    return fileName;
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile(
    file: File,
    path: string,
    fileName?: string,
    options?: FileUploadOptions
  ): Promise<UploadResult> {
    try {
      const safeFileName = fileName || this.generateSafeFileName(file.name);
      const storageRef = ref(storage, `${path}/${safeFileName}`);

      // Create upload task for progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          size: file.size.toString()
        }
      });

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            options?.onProgress?.(progress);
          },
          (error) => {
            options?.onError?.(error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const metadata = await getMetadata(uploadTask.snapshot.ref);
              
              const result: UploadResult = {
                downloadURL,
                fileName: safeFileName,
                size: file.size,
                contentType: file.type,
                metadata: metadata.customMetadata
              };

              options?.onComplete?.(downloadURL);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      options?.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Upload audio file with validation
   */
  async uploadAudio(
    file: File,
    albumId?: string,
    options?: FileUploadOptions
  ): Promise<UploadResult> {
    this.validateFile(file, FILE_VALIDATIONS.audio);
    
    const prefix = albumId ? `album_${albumId}` : 'audio';
    const fileName = this.generateSafeFileName(file.name, prefix);
    
    return this.uploadFile(file, STORAGE_PATHS.audio, fileName, options);
  }

  /**
   * Upload album cover with validation
   */
  async uploadAlbumCover(
    file: File,
    albumId?: string,
    options?: FileUploadOptions
  ): Promise<UploadResult> {
    this.validateFile(file, FILE_VALIDATIONS.image);
    
    const prefix = albumId ? `album_${albumId}_cover` : 'cover';
    const fileName = this.generateSafeFileName(file.name, prefix);
    
    return this.uploadFile(file, STORAGE_PATHS.covers, fileName, options);
  }

  /**
   * Upload video file with validation
   */
  async uploadVideo(
    file: File,
    prefix?: string,
    options?: FileUploadOptions
  ): Promise<UploadResult> {
    this.validateFile(file, FILE_VALIDATIONS.video);
    
    const fileName = this.generateSafeFileName(file.name, prefix || 'video');
    
    return this.uploadFile(file, STORAGE_PATHS.videos, fileName, options);
  }

  /**
   * Upload image with validation
   */
  async uploadImage(
    file: File,
    prefix?: string,
    options?: FileUploadOptions
  ): Promise<UploadResult> {
    this.validateFile(file, FILE_VALIDATIONS.image);
    
    const fileName = this.generateSafeFileName(file.name, prefix || 'image');
    
    return this.uploadFile(file, STORAGE_PATHS.images, fileName, options);
  }

  /**
   * Upload multiple files with progress tracking
   */
  async uploadMultipleFiles(
    files: File[],
    path: string,
    options?: {
      onFileProgress?: (fileName: string, progress: number) => void;
      onFileComplete?: (fileName: string, downloadURL: string) => void;
      onFileError?: (fileName: string, error: Error) => void;
      onAllComplete?: (results: UploadResult[]) => void;
      validation?: FileValidation;
    }
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    const uploadPromises = files.map(async (file) => {
      try {
        if (options?.validation) {
          this.validateFile(file, options.validation);
        }

        const result = await this.uploadFile(file, path, undefined, {
          onProgress: (progress) => options?.onFileProgress?.(file.name, progress),
          onComplete: (downloadURL) => options?.onFileComplete?.(file.name, downloadURL),
          onError: (error) => options?.onFileError?.(file.name, error)
        });

        results.push(result);
        return result;
      } catch (error) {
        options?.onFileError?.(file.name, error as Error);
        throw error;
      }
    });

    try {
      const allResults = await Promise.all(uploadPromises);
      options?.onAllComplete?.(allResults);
      return allResults;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(filePath: string) {
    try {
      const fileRef = ref(storage, filePath);
      return await getMetadata(fileRef);
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }

  /**
   * Get download URL for existing file
   */
  async getDownloadURL(filePath: string): Promise<string> {
    try {
      const fileRef = ref(storage, filePath);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const fileUploadService = new FileUploadService();

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileTypeCategory = (file: File): keyof typeof FILE_VALIDATIONS | 'unknown' => {
  if (FILE_VALIDATIONS.audio.allowedTypes.includes(file.type as any)) return 'audio';
  if (FILE_VALIDATIONS.image.allowedTypes.includes(file.type as any)) return 'image';
  if (FILE_VALIDATIONS.video.allowedTypes.includes(file.type as any)) return 'video';
  if (FILE_VALIDATIONS.document.allowedTypes.includes(file.type as any)) return 'document';
  return 'unknown';
};