'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader, Sparkles, Trash, UploadCloud } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import type { Album, Track } from '@/lib/types';
import Image from 'next/image';
import { generateAlbumArt } from '@/ai/flows/generate-album-art-flow';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Progress } from './ui/progress';


const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  releaseYear: z.coerce.number().min(1900, 'Invalid year.').max(new Date().getFullYear() + 5),
  coverArt: z.string().url('Must be a valid URL.'),
  tracks: z.array(z.object({
      id: z.string().optional(),
      title: z.string().min(1, 'Track title cannot be empty.'),
      duration: z.string().regex(/^\d{1,2}:\d{2}$/, 'Duration must be in mm:ss format.'),
      url: z.string().url('Track must have a valid URL.'),
  })).min(1, 'Album must have at least one track.'),
});

type AlbumFormValues = z.infer<typeof formSchema>;

interface AlbumFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Album) => void;
  initialData: Album | null;
}

export default function AlbumForm({ isOpen, onOpenChange, onSubmit, initialData }: AlbumFormProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);
  const trackUploadRef = useRef<HTMLInputElement>(null);

  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      releaseYear: new Date().getFullYear(),
      coverArt: '',
      tracks: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'tracks',
  });

  const watchTitle = form.watch('title');
  const watchCoverArt = form.watch('coverArt');

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        title: '',
        releaseYear: new Date().getFullYear(),
        coverArt: '',
        tracks: [],
      });
    }
  }, [initialData, form, isOpen]);

  useEffect(() => {
      setCoverArtPreview(watchCoverArt);
  }, [watchCoverArt])
  
  const handleFormSubmit = (data: AlbumFormValues) => {
    onSubmit(data as Album);
  };
  
  const handleCoverArtFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setIsUploading(true);
         try {
            const storageRef = ref(storage, `album-covers/${file.name}-${Date.now()}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            form.setValue('coverArt', downloadURL, { shouldValidate: true });
            setCoverArtPreview(downloadURL);
            toast({ title: 'Cover art uploaded!' });
        } catch (error) {
            console.error('Upload failed', error);
            toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload cover art.' });
        } finally {
            setIsUploading(false);
        }
      }
  }

  const handleGenerateArt = async () => {
    if (!watchTitle) {
        toast({ variant: 'destructive', title: 'Title needed', description: 'Please enter an album title to generate cover art.' });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateAlbumArt(watchTitle);
        form.setValue('coverArt', result.imageUrl, { shouldValidate: true });
        setCoverArtPreview(result.imageUrl);
        toast({ title: 'Cover art generated!', description: 'A new cover has been created and applied.' });
    } catch (error) {
        console.error('AI generation failed', error);
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate AI cover art. Please try again.' });
    } finally {
        setIsGenerating(false);
    }
  }

  const handleTrackUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const fileId = `track-${Date.now()}`;
    const newTrack: Omit<Track, 'id' | 'url' | 'duration'> = { title: file.name.replace(/\.[^/.]+$/, "") };
    const tempTrackId = append({ ...newTrack, id: fileId, url: '', duration: '0:00' });
    const trackIndex = fields.length;

    try {
        const storageRef = ref(storage, `tracks/${file.name}`);
        const uploadTask = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        const audio = new Audio(downloadURL);
        audio.onloadedmetadata = () => {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
            const duration = `${minutes}:${seconds}`;
            update(trackIndex, { id: fileId, title: newTrack.title, url: downloadURL, duration: duration });
        };
        
        toast({ title: "Track uploaded", description: `${file.name} has been added.` });
    } catch (error) {
        console.error("Upload failed", error);
        remove(trackIndex);
        toast({ variant: 'destructive', title: "Upload Failed", description: "Could not upload track." });
    } finally {
        setIsUploading(false);
        setUploadProgress(0);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl glassmorphism bg-card/80">
        <DialogHeader>
          <DialogTitle className="font-headline">{initialData ? 'Edit Album' : 'Add New Album'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details for this album.' : 'Fill in the details for the new album.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto p-1 pr-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <FormField name="title" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Album Title" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="releaseYear" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Release Year</FormLabel><FormControl><Input type="number" placeholder="2023" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className='space-y-2'>
                  <FormLabel>Cover Art</FormLabel>
                   <div className="relative w-full aspect-square rounded-md border border-dashed border-input flex items-center justify-center bg-background/30">
                     {isUploading || isGenerating ? (
                        <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                            <Loader className="animate-spin w-8 h-8"/>
                            <span>{isGenerating ? 'Generating...' : 'Uploading...'}</span>
                        </div>
                     ) : coverArtPreview ? (
                        <Image src={coverArtPreview} alt="Cover art preview" layout="fill" className="object-cover rounded-md" />
                     ) : (
                        <span className="text-sm text-muted-foreground">Image Preview</span>
                     )}
                   </div>
                   <div className="flex gap-2">
                        <FormField name="coverArt" control={form.control} render={() => (
                            <FormItem className="flex-grow">
                                <FormControl>
                                    <Input id="cover-art-upload" type="file" accept="image/*" onChange={handleCoverArtFileChange} className="sr-only" disabled={isUploading || isGenerating} />
                                </FormControl>
                                <Button type="button" asChild variant="outline" className="w-full" disabled={isUploading || isGenerating}>
                                    <label htmlFor="cover-art-upload">Upload Image</label>
                                </Button>
                            </FormItem>
                        )} />
                        <Button type="button" onClick={handleGenerateArt} disabled={isGenerating || isUploading || !watchTitle}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate
                        </Button>
                   </div>
                   <FormMessage>{form.formState.errors.coverArt?.message}</FormMessage>
              </div>
            </div>

            <div>
              <FormLabel>Tracks</FormLabel>
               <div className="mt-2 space-y-2">
                {isUploading && fields.find(f => f.url === '') && <Progress value={uploadProgress} className="w-full h-2" />}
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 p-2 rounded-md bg-foreground/5">
                     <p className='flex-grow font-medium'>{field.title}</p>
                     <p className='text-sm text-muted-foreground'>{field.duration}</p>
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
              <input type="file" accept="audio/*" ref={trackUploadRef} onChange={handleTrackUpload} className="sr-only" />
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => trackUploadRef.current?.click()} disabled={isUploading}>
                <UploadCloud className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Track'}
              </Button>
              <FormMessage>{form.formState.errors.tracks?.message}</FormMessage>
            </div>

            <DialogFooter className="sticky bottom-0 !mt-8">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Album</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
