'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { initialAlbums, initialProfile, initialRoadmap } from '@/lib/data';
import type { Album, Profile, RoadmapItem } from '@/lib/types';
import AlbumForm from './album-form';
import ProfileForm from './profile-form';
import RoadmapForm from './roadmap-form';
import { Home, LogOut, Music, Pencil, PlusCircle, Trash, User, Map } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [albums, setAlbums] = useLocalStorage<Album[]>('rudybtz-albums', initialAlbums);
  const [profile, setProfile] = useLocalStorage<Profile>('rudybtz-profile', initialProfile);
  const [roadmap, setRoadmap] = useLocalStorage<RoadmapItem[]>('rudybtz-roadmap', initialRoadmap);

  const [isAlbumFormOpen, setIsAlbumFormOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  const [isRoadmapFormOpen, setIsRoadmapFormOpen] = useState(false);
  const [editingRoadmapItem, setEditingRoadmapItem] = useState<RoadmapItem | null>(null);

  const handleLogout = () => {
    window.localStorage.removeItem('rudybtz-admin-auth');
    router.push('/');
  };

  const handleAddNewAlbum = () => {
    setEditingAlbum(null);
    setIsAlbumFormOpen(true);
  };

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setIsAlbumFormOpen(true);
  };

  const handleDeleteAlbum = (albumId: string) => {
    setAlbums(albums.filter((album) => album.id !== albumId));
  };

  const handleAlbumFormSubmit = (data: Album) => {
    if (editingAlbum) {
      setAlbums(albums.map((album) => (album.id === data.id ? data : album)));
    } else {
      setAlbums([...albums, { ...data, id: `album-${Date.now()}` }]);
    }
    setIsAlbumFormOpen(false);
  };
  
  const handleAddNewRoadmapItem = () => {
    setEditingRoadmapItem(null);
    setIsRoadmapFormOpen(true);
  };

  const handleEditRoadmapItem = (item: RoadmapItem) => {
    setEditingRoadmapItem(item);
    setIsRoadmapFormOpen(true);
  };

  const handleDeleteRoadmapItem = (itemId: string) => {
    setRoadmap(roadmap.filter((item) => item.id !== itemId));
  };
  
  const handleRoadmapFormSubmit = (data: RoadmapItem) => {
    if (editingRoadmapItem) {
      setRoadmap(roadmap.map((item) => (item.id === data.id ? data : item)));
    } else {
      setRoadmap([...roadmap, { ...data, id: `roadmap-${Date.now()}` }]);
    }
    setIsRoadmapFormOpen(false);
  };


  const handleProfileSubmit = (data: Profile) => {
    setProfile(data);
  };

  const getStatusBadgeVariant = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Planned': return 'outline';
      default: return 'outline';
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-grid-pattern">
      <div className="max-w-6xl mx-auto">
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="albums"><Music className="mr-2 h-4 w-4"/>Manage Albums</TabsTrigger>
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Edit Profile</TabsTrigger>
            <TabsTrigger value="roadmap"><Map className="mr-2 h-4 w-4"/>Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="albums" className="p-4 mt-4 rounded-lg md:p-6 glassmorphism bg-card/50">
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-headline">Albums</h2>
              <Button onClick={handleAddNewAlbum}><PlusCircle className="w-4 h-4 mr-2" />Add New Album</Button>
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
                        <Button variant="ghost" size="icon" onClick={() => handleEditAlbum(album)}><Pencil className="w-4 h-4" /></Button>
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
                                <AlertDialogAction onClick={() => handleDeleteAlbum(album.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
          
          <TabsContent value="profile" className="p-4 mt-4 rounded-lg md:p-6 glassmorphism bg-card/50">
            <h2 className="mb-4 text-2xl font-bold font-headline">Artist Profile</h2>
            <ProfileForm onSubmit={handleProfileSubmit} initialData={profile} />
          </TabsContent>

          <TabsContent value="roadmap" className="p-4 mt-4 rounded-lg md:p-6 glassmorphism bg-card/50">
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-headline">Development Roadmap</h2>
              <Button onClick={handleAddNewRoadmapItem}><PlusCircle className="w-4 h-4 mr-2" />Add Roadmap Item</Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roadmap.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell><Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge></TableCell>
                        <TableCell>{item.dueDate}</TableCell>
                        <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRoadmapItem(item)}><Pencil className="w-4 h-4" /></Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon" className="text-destructive"><Trash className="w-4 h-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className='glassmorphism bg-background/80'>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the roadmap item
                                    "{item.title}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRoadmapItem(item.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
        </Tabs>

        <AlbumForm 
          isOpen={isAlbumFormOpen} 
          onOpenChange={setIsAlbumFormOpen}
          onSubmit={handleAlbumFormSubmit}
          initialData={editingAlbum}
        />
        <RoadmapForm
            isOpen={isRoadmapFormOpen}
            onOpenChange={setIsRoadmapFormOpen}
            onSubmit={handleRoadmapFormSubmit}
            initialData={editingRoadmapItem}
        />
      </div>
    </div>
  );
}
