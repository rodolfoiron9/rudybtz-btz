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
import { Loader, Sparkles, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Album } from '@/lib/types';
import Image from 'next/image';
import { generateAlbumArt } from '@/ai/flows/generate-album-art-flow';
import { useToast } from '@/hooks/use-toast';


const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  releaseYear: z.coerce.number().min(1900, 'Invalid year.').max(new Date().getFullYear() + 5),
  coverArt: z.string().url('Must be a valid URL or data URI.'),
  tracks: z.array(z.object({
      id: z.string().optional(),
      title: z.string().min(1, 'Track title cannot be empty.'),
      duration: z.string().regex(/^\d{1,2}:\d{2}$/, 'Duration must be in mm:ss format.'),
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
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);

  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      releaseYear: new Date().getFullYear(),
      coverArt: '',
      tracks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
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
        tracks: [{ title: '', duration: '00:00' }],
      });
    }
  }, [initialData, form, isOpen]);

  useEffect(() => {
      setCoverArtPreview(watchCoverArt);
  }, [watchCoverArt])
  
  const handleFormSubmit = (data: AlbumFormValues) => {
    onSubmit(data as Album);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const dataUri = reader.result as string;
              form.setValue('coverArt', dataUri);
              setCoverArtPreview(dataUri);
          };
          reader.readAsDataURL(file);
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
        form.setValue('coverArt', result.imageUrl);
        setCoverArtPreview(result.imageUrl);
        toast({ title: 'Cover art generated!', description: 'A new cover has been created and applied.' });
    } catch (error) {
        console.error('AI generation failed', error);
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate AI cover art. Please try again.' });
    } finally {
        setIsGenerating(false);
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
                     {coverArtPreview ? (
                        <Image src={coverArtPreview} alt="Cover art preview" layout="fill" className="object-cover rounded-md" />
                     ) : (
                        <span className="text-sm text-muted-foreground">Image Preview</span>
                     )}
                   </div>
                   <div className="flex gap-2">
                        <FormField name="coverArt" control={form.control} render={() => (
                            <FormItem className="flex-grow">
                                <FormControl>
                                    <Input id="cover-art-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                                </FormControl>
                                <Button type="button" asChild variant="outline" className="w-full">
                                    <label htmlFor="cover-art-upload">Upload Image</label>
                                </Button>
                            </FormItem>
                        )} />
                        <Button type="button" onClick={handleGenerateArt} disabled={isGenerating || !watchTitle}>
                            {isGenerating ? <Loader className="animate-spin"/> : <Sparkles />}
                            Generate with AI
                        </Button>
                   </div>
                   <FormMessage>{form.formState.errors.coverArt?.message}</FormMessage>
              </div>
            </div>

            <div>
              <FormLabel>Tracks</FormLabel>
               <div className="mt-2 space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                     <FormField control={form.control} name={`tracks.${index}.title`} render={({ field }) => (
                        <FormItem className="flex-grow"><FormControl><Input placeholder="Track Title" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name={`tracks.${index}.duration`} render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="mm:ss" className="w-24" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ title: '', duration: '00:00' })}>Upload Track</Button>
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
