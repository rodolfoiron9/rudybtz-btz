'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useLocalStorage from '@/hooks/use-local-storage';
import { initialAlbums, initialProfile } from '@/lib/data';
import type { Album, Profile } from '@/lib/types';
import AlbumForm from './album-form';
import ProfileForm from './profile-form';
import { Home, LogOut, Music, Pencil, PlusCircle, Trash, User } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [albums, setAlbums] = useLocalStorage<Album[]>('rudybtz-albums', initialAlbums);
  const [profile, setProfile] = useLocalStorage<Profile>('rudybtz-profile', initialProfile);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  const handleLogout = () => {
    window.localStorage.removeItem('rudybtz-admin-auth');
    router.push('/');
  };

  const handleAddNew = () => {
    setEditingAlbum(null);
    setIsFormOpen(true);
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setIsFormOpen(true);
  };

  const handleDelete = (albumId: string) => {
    setAlbums(albums.filter((album) => album.id !== albumId));
  };

  const handleFormSubmit = (data: Album) => {
    if (editingAlbum) {
      setAlbums(albums.map((album) => (album.id === data.id ? data : album)));
    } else {
      setAlbums([...albums, { ...data, id: `album-${Date.now()}` }]);
    }
    setIsFormOpen(false);
  };

  const handleProfileSubmit = (data: Profile) => {
    setProfile(data);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-grid-pattern-dark">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
          <h1 className="text-3xl font-black tracking-wider text-center uppercase md:text-4xl font-headline">
            Admin Panel
          </h1>
          <div className='flex items-center gap-2'>
            <Button variant="outline" size="sm" onClick={() => router.push('/')}><Home className="mr-2 h-4 w-4"/>Go Home</Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
          </div>
        </header>

        <Tabs defaultValue="albums" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="albums"><Music className="mr-2 h-4 w-4"/>Manage Albums</TabsTrigger>
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="albums" className="p-4 mt-4 rounded-lg md:p-6 glassmorphism bg-background/50">
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-headline">Albums</h2>
              <Button onClick={handleAddNew}><PlusCircle className="w-4 h-4 mr-2" />Add New Album</Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {albums.map((album) => (
                    <TableRow key={album.id}>
                        <TableCell><img src={album.coverArt} alt={album.title} className="w-12 h-12 rounded-md object-cover" /></TableCell>
                        <TableCell className="font-medium">{album.title}</TableCell>
                        <TableCell>{album.releaseYear}</TableCell>
                        <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(album)}><Pencil className="w-4 h-4" /></Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon" className="text-destructive"><Trash className="w-4 h-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className='glassmorphism bg-background/80'>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the album
                                    "{album.title}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(album.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="p-4 mt-4 rounded-lg md:p-6 glassmorphism bg-background/50">
            <h2 className="mb-4 text-2xl font-bold font-headline">Artist Profile</h2>
            <ProfileForm onSubmit={handleProfileSubmit} initialData={profile} />
          </TabsContent>
        </Tabs>

        <AlbumForm 
          isOpen={isFormOpen} 
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          initialData={editingAlbum}
        />
      </div>
    </div>
  );
}
