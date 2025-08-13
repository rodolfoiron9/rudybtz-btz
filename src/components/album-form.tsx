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
import { Trash } from 'lucide-react';
import { useEffect } from 'react';
import type { Album } from '@/lib/types';


const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  releaseYear: z.coerce.number().min(1900, 'Invalid year.').max(new Date().getFullYear() + 5),
  coverArt: z.string().url('Must be a valid URL.'),
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
  }, [initialData, form]);
  
  const handleFormSubmit = (data: AlbumFormValues) => {
    onSubmit(data as Album);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] glassmorphism bg-background/80">
        <DialogHeader>
          <DialogTitle className="font-headline">{initialData ? 'Edit Album' : 'Add New Album'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details for this album.' : 'Fill in the details for the new album.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <FormField name="title" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Album Title" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="releaseYear" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Release Year</FormLabel><FormControl><Input type="number" placeholder="2023" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
             <FormField name="coverArt" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Cover Art URL</FormLabel><FormControl><Input placeholder="https://placehold.co/500x500.png" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

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
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ title: '', duration: '00:00' })}>Add Track</Button>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Album</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
