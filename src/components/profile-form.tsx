'use client';

import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import type { Profile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const profileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters.'),
  profileImage: z.string().url('Must be a valid URL.'),
  socials: z.object({
    twitter: z.string().url().or(z.literal('')),
    instagram: z.string().url().or(z.literal('')),
    youtube: z.string().url().or(z.literal('')),
    soundcloud: z.string().url().or(z.literal('')),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onSubmit: (data: Profile) => void;
  initialData: Profile;
}

export default function ProfileForm({ onSubmit, initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const handleFormSubmit = (data: ProfileFormValues) => {
    onSubmit(data);
    toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          name="bio"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artist Biography</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell the story of the artist..." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="profileImage"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/300x300.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Social Links</h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField name="socials.twitter" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Twitter</FormLabel><FormControl><Input placeholder="https://twitter.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="socials.instagram" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Instagram</FormLabel><FormControl><Input placeholder="https://instagram.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="socials.youtube" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>YouTube</FormLabel><FormControl><Input placeholder="https://youtube.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="socials.soundcloud" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>SoundCloud</FormLabel><FormControl><Input placeholder="https://soundcloud.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>

        <Button type="submit" className="transition-shadow duration-300 shadow-lg hover:shadow-primary/50">Save Changes</Button>
      </form>
    </Form>
  );
}
