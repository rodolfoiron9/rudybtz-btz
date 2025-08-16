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
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ThemeSettings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const themeSchema = z.object({
  background: z.object({
    type: z.enum(['color', 'particles']),
    value: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color code'),
  }),
  primary: z.string().min(1, 'Primary color is required.'),
  accent: z.string().min(1, 'Accent color is required.'),
});

type ThemeFormValues = z.infer<typeof themeSchema>;

interface ThemeFormProps {
  onSubmit: (data: ThemeSettings) => void;
  initialData: ThemeSettings;
}

export default function ThemeForm({ onSubmit, initialData }: ThemeFormProps) {
  const { toast } = useToast();
  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const handleFormSubmit = (data: ThemeFormValues) => {
    onSubmit(data);
    toast({
        title: 'Theme Updated',
        description: 'Your changes have been saved. The page will now reload.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          name="background.type"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Background Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="particles" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Particle Animation
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="color" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Solid Color
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="background.value"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormDescription>
                Used as the background if "Solid Color" is selected.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="primary"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color (HSL)</FormLabel>
                  <FormControl>
                    <Input placeholder="170 80% 50%" {...field} />
                  </FormControl>
                   <FormDescription>
                    The main highlight color for buttons and links.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="accent"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accent Color (HSL)</FormLabel>
                  <FormControl>
                    <Input placeholder="330 90% 60%" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used for secondary highlights and interactive elements.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
       
        <Button type="submit" className="transition-shadow duration-300 shadow-lg hover:shadow-primary/50">Save Theme</Button>
      </form>
    </Form>
  );
}
    