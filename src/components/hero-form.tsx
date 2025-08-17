'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useRef } from 'react';
import type { HeroSlide } from '@/lib/types';
import { Trash, PlusCircle, Image as ImageIcon, Video, Loader2, UploadCloud } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const slideSchema = z.object({
    id: z.string(),
    type: z.enum(['image', 'video']),
    url: z.string().url('Must be a valid URL.'),
    hint: z.string().optional(),
});

const heroFormSchema = z.object({
  slides: z.array(slideSchema),
});

type HeroFormValues = z.infer<typeof heroFormSchema>;

interface HeroFormProps {
  onSubmit: (data: HeroSlide[]) => void;
  initialData: HeroSlide[];
}

export default function HeroForm({ onSubmit, initialData }: HeroFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState<number | null>(null); // Store index of uploading item
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: { slides: initialData },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'slides',
  });

  useEffect(() => {
    form.reset({ slides: initialData });
  }, [initialData, form]);

  const handleFormSubmit = (data: HeroFormValues) => {
    onSubmit(data.slides);
    toast({
        title: 'Hero Section Updated',
        description: 'Your changes have been saved successfully.',
    });
  };

  const addSlide = () => {
    append({
        id: `slide-${Date.now()}`,
        type: 'image',
        url: 'https://placehold.co/1920x1080.png',
        hint: 'new slide'
    })
  }

  const handleFileSelect = (index: number) => {
    if (fileInputRef.current) {
        fileInputRef.current.onchange = (e) => handleFileUpload(e, index);
        fileInputRef.current.click();
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(index);

    try {
        const storageRef = ref(storage, `hero-slides/${file.name}`);
        const uploadTask = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        update(index, {
            ...fields[index],
            url: downloadURL,
        });

        toast({
            title: "Upload successful",
            description: "Slide media has been updated."
        })

    } catch (error) {
        console.error("Upload failed", error);
        toast({ variant: 'destructive', title: "Upload Failed", description: "Could not upload the file." });
    } finally {
        setIsUploading(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <input type="file" ref={fileInputRef} className="sr-only" />
        <div className="space-y-4">
          <FormLabel>Hero Slides</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2 p-3 rounded-lg bg-foreground/5">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-background">
                {form.watch(`slides.${index}.type`) === 'image' ? <ImageIcon className="w-6 h-6 text-muted-foreground"/> : <Video className="w-6 h-6 text-muted-foreground"/>}
              </div>
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
                 <FormField
                    name={`slides.${index}.type`}
                    control={form.control}
                    render={({ field: selectField }) => (
                      <FormItem>
                         <FormLabel className="text-xs">Type</FormLabel>
                         <Select onValueChange={selectField.onChange} defaultValue={selectField.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end gap-2">
                    <div className="flex-grow">
                         <FormLabel className="text-xs">Media</FormLabel>
                         <Button type="button" variant="outline" onClick={() => handleFileSelect(index)} disabled={isUploading !== null} className="w-full justify-start">
                             {isUploading === index ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <UploadCloud className="w-4 h-4 mr-2"/>}
                             <span className='truncate'>{field.url.split('/').pop()?.split('?')[0]}</span>
                         </Button>
                    </div>
                  </div>
                 <FormField
                    name={`slides.${index}.hint`}
                    control={form.control}
                    render={({ field: inputField }) => (
                      <FormItem className="md:col-span-2">
                         <FormLabel className="text-xs">AI Hint (for images)</FormLabel>
                         <FormControl><Input placeholder="e.g. 'cyberpunk city'" {...inputField} disabled={form.watch(`slides.${index}.type`) === 'video'} /></FormControl>
                      </FormItem>
                    )}
                  />
              </div>
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
           <Button type="button" variant="outline" onClick={addSlide}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Slide
           </Button>
        </div>
        <Button type="submit" className="transition-shadow duration-300 shadow-lg hover:shadow-primary/50">Save Hero Settings</Button>
      </form>
    </Form>
  );
}
