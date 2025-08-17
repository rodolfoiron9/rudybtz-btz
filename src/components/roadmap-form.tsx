'use client';

import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';
import type { RoadmapItem } from '@/lib/types';


const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  status: z.enum(['Planned', 'In Progress', 'Completed']),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
});

type RoadmapFormValues = z.infer<typeof formSchema>;

interface RoadmapFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RoadmapItem) => void;
  initialData: RoadmapItem | null;
}

export default function RoadmapForm({ isOpen, onOpenChange, onSubmit, initialData }: RoadmapFormProps) {
  const form = useForm<RoadmapFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'Planned',
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      form.reset({
        title: '',
        description: '',
        status: 'Planned',
        dueDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, form, isOpen]);
  
  const handleFormSubmit = (data: RoadmapFormValues) => {
    onSubmit(data as RoadmapItem);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] glassmorphism bg-background/80">
        <DialogHeader>
          <DialogTitle className="font-headline">{initialData ? 'Edit Roadmap Item' : 'Add New Roadmap Item'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details for this roadmap item.' : 'Fill in the details for the new roadmap item.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
             <FormField name="title" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Feature Title" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the feature..." {...field} /></FormControl><FormMessage /></FormItem>
             )} />
            <div className="grid grid-cols-2 gap-4">
               <FormField name="status" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Planned">Planned</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage /></FormItem>
              )} />
              <FormField name="dueDate" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Due Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Item</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
