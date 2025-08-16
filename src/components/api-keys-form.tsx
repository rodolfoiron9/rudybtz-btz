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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ApiKeys } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

const apiKeysSchema = z.object({
  gemini: z.string().optional(),
  huggingFace: z.string().optional(),
  deepseek: z.string().optional(),
});

type ApiKeysFormValues = z.infer<typeof apiKeysSchema>;

interface ApiKeysFormProps {
  onSubmit: (data: ApiKeys) => void;
  initialData: ApiKeys;
}

export default function ApiKeysForm({ onSubmit, initialData }: ApiKeysFormProps) {
  const { toast } = useToast();
  const form = useForm<ApiKeysFormValues>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const handleFormSubmit = (data: ApiKeysFormValues) => {
    onSubmit(data as ApiKeys);
    toast({
        title: 'API Keys Updated',
        description: 'Your changes have been saved to local storage.',
    });
  };

  return (
    <Form {...form}>
       <Alert className="mb-6">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Developer Information</AlertTitle>
        <AlertDescription>
          API keys are stored in your browser's local storage and are used by Genkit flows. For production, manage these keys securely as environment variables on your server.
        </AlertDescription>
      </Alert>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          name="gemini"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Gemini API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your Gemini API key" {...field} />
              </FormControl>
              <FormDescription>Used for text generation, image generation, and chat.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="huggingFace"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hugging Face API Token</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your Hugging Face token" {...field} />
              </FormControl>
               <FormDescription>Used for accessing a wide variety of open-source models.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="deepseek"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>DeepSeek API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your DeepSeek API key" {...field} />
              </FormControl>
              <FormDescription>A specialized model for code and text generation.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
       
        <Button type="submit" className="transition-shadow duration-300 shadow-lg hover:shadow-primary/50">Save API Keys</Button>
      </form>
    </Form>
  );
}
