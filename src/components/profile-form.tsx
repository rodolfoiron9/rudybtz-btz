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
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Upload } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.profileImage);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  const watchProfileImage = form.watch('profileImage');

  useEffect(() => {
    form.reset(initialData);
    setImagePreview(initialData.profileImage);
  }, [initialData, form]);

  useEffect(() => {
    setImagePreview(watchProfileImage);
  }, [watchProfileImage]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `profile-images/${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      form.setValue('profileImage', downloadURL, { shouldValidate: true });
      setImagePreview(downloadURL);

      toast({
        title: 'Image Uploaded',
        description: 'The new profile image has been uploaded and applied.',
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Could not upload the profile image. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                 <FormField
                    name="bio"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Artist Biography</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Tell the story of the artist..." rows={8} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <div className='space-y-2'>
                <FormLabel>Profile Image</FormLabel>
                <div className="relative w-full aspect-square rounded-full border border-dashed border-input flex items-center justify-center bg-background/30 overflow-hidden">
                    {imagePreview ? (
                    <Image src={imagePreview} alt="Profile image preview" layout="fill" className="object-cover" />
                    ) : (
                    <span className="text-sm text-muted-foreground">Image Preview</span>
                    )}
                </div>
                 <FormField
                    name="profileImage"
                    control={form.control}
                    render={() => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    id="profile-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="sr-only"
                                    disabled={isUploading}
                                />
                            </FormControl>
                             <Button type="button" asChild variant="outline" className="w-full" disabled={isUploading}>
                                <label htmlFor="profile-image-upload">
                                    {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
                                    {isUploading ? 'Uploading...' : 'Upload New Image'}
                                </label>
                            </Button>
                             <FormMessage>{form.formState.errors.profileImage?.message}</FormMessage>
                        </FormItem>
                    )}
                 />
            </div>
        </div>
       

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
