import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AudioUpload, ImageUpload } from '@/components/ui/file-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Music, 
  ImageIcon, 
  Save, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3
} from 'lucide-react';
import { UploadResult, STORAGE_PATHS } from '@/lib/file-upload-service';

export interface AlbumFormData {
  title: string;
  description: string;
  releaseDate: string;
  genre: string;
  price: string;
  coverArt: UploadResult | undefined;
  tracks: UploadResult[];
}

interface AlbumUploadFormProps {
  onSave?: (album: AlbumFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<AlbumFormData> | undefined;
  isEditing?: boolean;
}

export function AlbumUploadForm({ 
  onSave, 
  onCancel, 
  initialData,
  isEditing = false 
}: AlbumUploadFormProps) {
  const [formData, setFormData] = useState<AlbumFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    releaseDate: initialData?.releaseDate || '',
    genre: initialData?.genre || '',
    price: initialData?.price || '',
    coverArt: initialData?.coverArt || undefined,
    tracks: initialData?.tracks || []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleInputChange = (field: keyof AlbumFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCoverUpload = (results: UploadResult[]) => {
    if (results.length > 0) {
      setFormData(prev => ({ ...prev, coverArt: results[0] }));
    }
  };

  const handleTracksUpload = (results: UploadResult[]) => {
    setFormData(prev => ({ 
      ...prev, 
      tracks: [...prev.tracks, ...results] 
    }));
  };

  const removeTrack = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tracks: prev.tracks.filter((_, i) => i !== index)
    }));
  };

  const removeCoverArt = () => {
    setFormData(prev => ({ ...prev, coverArt: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Album title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Album description is required';
    }

    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Release date is required';
    }

    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a valid number';
    }

    if (formData.tracks.length === 0) {
      newErrors.tracks = 'At least one audio track is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave?.(formData);
    } catch (error) {
      console.error('Error saving album:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalProgress = () => {
    const progressValues = Object.values(uploadProgress);
    if (progressValues.length === 0) return 0;
    return progressValues.reduce((sum, progress) => sum + progress, 0) / progressValues.length;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Album Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Music className="w-5 h-5" />
            <span>Album Information</span>
          </CardTitle>
          <CardDescription>
            Basic information about your album
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Album Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter album title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                placeholder="e.g., Electronic, Hip Hop, Jazz"
                className={errors.genre ? 'border-red-500' : ''}
              />
              {errors.genre && (
                <p className="text-sm text-red-500">{errors.genre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">Release Date *</Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                className={errors.releaseDate ? 'border-red-500' : ''}
              />
              {errors.releaseDate && (
                <p className="text-sm text-red-500">{errors.releaseDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="9.99"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your album, its inspiration, and what makes it special..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Album Cover */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Album Cover</span>
          </CardTitle>
          <CardDescription>
            Upload a high-quality cover image for your album
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formData.coverArt ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={formData.coverArt.downloadURL}
                    alt="Album cover"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium">{formData.coverArt.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {(formData.coverArt.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeCoverArt}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <ImageUpload
              path={STORAGE_PATHS.covers}
              onUploadComplete={handleCoverUpload}
              onUploadError={(error) => {
                console.error('Cover upload error:', error);
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Audio Tracks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Music className="w-5 h-5" />
            <span>Audio Tracks</span>
            {formData.tracks.length > 0 && (
              <Badge variant="secondary">{formData.tracks.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Upload the audio tracks for your album
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Tracks */}
          {formData.tracks.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Tracks</Label>
              <div className="space-y-2">
                {formData.tracks.map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Music className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="font-medium">{track.fileName}</p>
                        <p className="text-sm text-gray-500">
                          {(track.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTrack(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload More Tracks */}
          <div>
            <AudioUpload
              path={STORAGE_PATHS.audio}
              multiple={true}
              onUploadComplete={handleTracksUpload}
              onUploadError={(error) => {
                console.error('Track upload error:', error);
              }}
            />
          </div>

          {errors.tracks && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.tracks}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update Album' : 'Create Album'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}