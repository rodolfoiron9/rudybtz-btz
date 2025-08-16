'use client';

import { useState, useEffect } from 'react';
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
import { initialProfile, initialRoadmap, initialApiKeys, initialThemeSettings } from '@/lib/data';
import { getAlbums, addAlbum, updateAlbum, deleteAlbum } from '@/lib/firestore';
import type { Album, Profile, RoadmapItem, KnowledgeArticle, ApiKeys, ThemeSettings } from '@/lib/types';
import AlbumForm from './album-form';
import ProfileForm from './profile-form';
import RoadmapForm from './roadmap-form';
import ApiKeysForm from './api-keys-form';
import ThemeForm from './theme-form';
import { Home, LogOut, Music, Pencil, PlusCircle, Trash, User, Map, Loader2, BrainCircuit, Key, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getArticles } from '@/lib/knowledge-firestore';


export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useLocalStorage<Profile>('rudybtz-profile', initialProfile);
  const [roadmap, setRoadmap] = useLocalStorage<RoadmapItem[]>('rudybtz-roadmap', initialRoadmap);
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKeys>('rudybtz-apikeys', initialApiKeys);
  const [themeSettings, setThemeSettings] = useLocalStorage<ThemeSettings>('rudybtz-theme', initialThemeSettings);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);

  const [isAlbumFormOpen, setIsAlbumFormOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  const [isRoadmapFormOpen, setIsRoadmapFormOpen] = useState(false);
  const [editingRoadmapItem, setEditingRoadmapItem] = useState<RoadmapItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [albumsData, articlesData] = await Promise.all([
          getAlbums(),
          getArticles()
        ]);
        setAlbums(albumsData);
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch data from the database.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

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

  const handleDeleteAlbum = async (albumId: string) => {
    try {
      await deleteAlbum(albumId);
      setAlbums(albums.filter((album) => album.id !== albumId));
      toast({ title: 'Success', description: 'Album deleted successfully.' });
    } catch (error) {
       console.error("Error deleting album: ", error);
       toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete album.',
       });
    }
  };

  const handleAlbumFormSubmit = async (data: Album) => {
    try {
      if (editingAlbum) {
        await updateAlbum(data.id, data);
        setAlbums(albums.map((album) => (album.id === data.id ? data : album)));
        toast({ title: 'Success', description: 'Album updated successfully.' });
      } else {
        const docRef = await addAlbum(data);
        setAlbums([...albums, { ...data, id: docRef.id }]);
        toast({ title: 'Success', description: 'Album added successfully.' });
      }
      setIsAlbumFormOpen(false);
    } catch (error) {
        console.error("Error saving album: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to save album to the database.',
        });
    }
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
  
  const handleApiKeysSubmit = (data: ApiKeys) => {
    setApiKeys(data);
  };

  const handleThemeSubmit = (data: ThemeSettings) => {
    setThemeSettings(data);
    // Force a re-render of the layout to apply new theme variables
    window.location.reload();
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
    <div className="min-h-screen p-4 md:p-8">
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="albums"><Music className="mr-2 h-4 w-4"/>Manage Albums</TabsTrigger>
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Edit Profile</TabsTrigger>
            <TabsTrigger value="roadmap"><Map className="mr-2 h-4 w-4"/>Roadmap</TabsTrigger>
            <TabsTrigger value="theme"><Palette className="mr-2 h-4 w-4"/>Theme</TabsTrigger>
            <TabsTrigger value="knowledge"><BrainCircuit className="mr-2 h-4 w-4"/>Knowledge Base</TabsTrigger>
            <TabsTrigger value="apikeys"><Key className="mr-2 h-4 w-4"/>API Keys</TabsTrigger>
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto"/>
                        </TableCell>
                      </TableRow>
                    ) : albums.map((album) => (
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
          
          <TabsContent value="theme" className="p-4 mt-4 rounded-lg md:p-6 glassmorphism bg-card/50">
            <h2 className="mb-4 text-2xl font-bold font-headline">Visual Theme</h2>
            <ThemeForm onSubmit={handleThemeSubmit} initialData={themeSettings} />
          </TabsContent>

          <TabsContent value="knowledge" className="p-4 mt-4 rounded-lg md:p-6 glassmorphism bg-card/50">
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-headline">AI Knowledge Base</h2>
              <Button disabled><PlusCircle className="w-4 h-4 mr-2" />Add Article (Soon)</Button>
            </div>
             <p className="mb-4 text-sm text-muted-foreground">This section will be used to manage content for fine-tuning AI agents. You can upload text, JSON, and other formats.</p>
            <div className="border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                       <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto"/>
                        </TableCell>
                      </TableRow>
                    ) : articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell><Badge variant="outline">{article.format}</Badge></TableCell>
                        <TableCell>{new Date(article.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" disabled><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" disabled><Trash className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="apikeys" className="p-4 mt-4 rounded-lg md:p-6 glassmorphism bg-card/50">
            <h2 className="mb-4 text-2xl font-bold font-headline">API Keys</h2>
            <ApiKeysForm onSubmit={handleApiKeysSubmit} initialData={apiKeys} />
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
    