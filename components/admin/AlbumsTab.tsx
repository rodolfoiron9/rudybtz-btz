'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlbumUploadForm, type AlbumFormData } from '@/components/forms';
import { Plus, Edit, Trash2, Music } from 'lucide-react';
import { albumsService, tracksService } from '@/lib/services';
import type { Album, Track } from '@/lib/types';

export default function AlbumsTab() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setIsLoading(true);
      const albumsData = await albumsService.getAll();
      setAlbums(albumsData);
    } catch (error) {
      console.error('Error loading albums:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTracks = async (albumId: string) => {
    try {
      const tracksData = await tracksService.getByAlbumId(albumId);
      return tracksData;
    } catch (error) {
      console.error('Error loading tracks:', error);
      return [];
    }
  };

  const handleSaveAlbum = async (albumData: any) => {
    try {
      if (selectedAlbum) {
        // Update existing album
        await albumsService.update(selectedAlbum.id, {
          title: albumData.title,
          description: albumData.description,
          releaseDate: new Date(albumData.releaseDate),
          genre: albumData.genre,
          mood: albumData.mood || '',
          coverArtUrl: albumData.coverArt?.downloadURL || '',
          trackIds: albumData.tracks.map((track: any, index: number) => `${selectedAlbum.id}_track_${index}`)
        });
      } else {
        // Create new album
        const newAlbumId = await albumsService.create({
          title: albumData.title,
          description: albumData.description,
          releaseDate: new Date(albumData.releaseDate),
          genre: albumData.genre,
          mood: albumData.mood || '',
          coverArtUrl: albumData.coverArt?.downloadURL || '',
          trackIds: albumData.tracks.map((track: any, index: number) => `new_album_track_${index}`)
        });

        // Create tracks for the new album
        for (let i = 0; i < albumData.tracks.length; i++) {
          const track = albumData.tracks[i];
          await tracksService.create({
            title: track.fileName.replace(/\.[^/.]+$/, ""), // Remove extension
            albumId: newAlbumId,
            audioUrl: track.downloadURL,
            duration: 180, // Default duration, should be calculated from actual file
            visualizationSettings: {
              presetId: 'default',
              lyricsDisplay: 'below'
            }
          });
        }
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadAlbums();
    } catch (error) {
      console.error('Error saving album:', error);
      throw error;
    }
  };

  const handleEdit = async (album: Album) => {
    setSelectedAlbum(album);
    const tracks = await loadTracks(album.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this album?')) {
      try {
        await albumsService.delete(id);
        loadAlbums();
      } catch (error) {
        console.error('Error deleting album:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedAlbum(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Music className="w-12 h-12 mx-auto mb-4 text-gray-500 animate-pulse" />
          <p className="text-gray-500">Loading albums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Albums Management</h2>
          <p className="text-gray-400">Create and manage your music albums with AI assistance</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              New Album
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedAlbum ? 'Edit Album' : 'Create New Album'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedAlbum 
                  ? 'Update your album information and manage tracks' 
                  : 'Add a new album to your collection with file uploads'
                }
              </DialogDescription>
            </DialogHeader>
            
            <AlbumUploadForm
              onSave={handleSaveAlbum}
              onCancel={() => setIsDialogOpen(false)}
              initialData={selectedAlbum ? ({
                title: selectedAlbum.title,
                description: selectedAlbum.description || '',
                releaseDate: selectedAlbum.releaseDate?.toISOString().split('T')[0] || '',
                genre: selectedAlbum.genre,
                price: '9.99',
                ...(selectedAlbum.coverArtUrl ? {
                  coverArt: {
                    downloadURL: selectedAlbum.coverArtUrl,
                    fileName: 'cover.jpg',
                    size: 0,
                    contentType: 'image/jpeg'
                  }
                } : {}),
                tracks: []
              } satisfies Partial<AlbumFormData>) : undefined}
              isEditing={!!selectedAlbum}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Albums Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Your Albums</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your music collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {albums.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No albums yet</h3>
              <p className="text-gray-500 mb-4">Create your first album to get started</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-violet-600 hover:bg-violet-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Album
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Cover</TableHead>
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300">Release Date</TableHead>
                  <TableHead className="text-gray-300">Genre</TableHead>
                  <TableHead className="text-gray-300">Tracks</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {albums.map((album) => (
                  <TableRow key={album.id} className="border-gray-700">
                    <TableCell>
                      {album.coverArtUrl ? (
                        <img 
                          src={album.coverArtUrl} 
                          alt={album.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Music className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-white font-medium">{album.title}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(album.releaseDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-300">{album.genre}</TableCell>
                    <TableCell className="text-gray-300">{album.trackIds.length} tracks</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(album)}
                          className="border-gray-600 text-gray-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(album.id)}
                          className="border-red-600 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}