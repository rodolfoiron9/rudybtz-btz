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
import { useEffect } from 'react';
import type { HeroSlide } from '@/lib/types';
import { Trash, PlusCircle, Image as ImageIcon, Video } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormLabel>Hero Slides</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2 p-3 rounded-lg bg-foreground/5">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-background">
                {form.watch(`slides.${index}.type`) === 'image' ? <ImageIcon className="w-6 h-6 text-muted-foreground"/> : <Video className="w-6 h-6 text-muted-foreground"/>}
              </div>
              <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-2">
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
                 <FormField
                    name={`slides.${index}.url`}
                    control={form.control}
                    render={({ field: inputField }) => (
                      <FormItem>
                         <FormLabel className="text-xs">URL</FormLabel>
                         <FormControl><Input placeholder="https://..." {...inputField} /></FormControl>
                         <FormMessage/>
                      </FormItem>
                    )}
                  />
                 <FormField
                    name={`slides.${index}.hint`}
                    control={form.control}
                    render={({ field: inputField }) => (
                      <FormItem>
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
