'use server';
/**
 * @fileOverview A flow for generating album art using an AI model.
 *
 * - generateAlbumArt - A function that takes an album title and returns a generated image URL.
 * - GenerateAlbumArtOutput - The return type for the generateAlbumArt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAlbumArtOutputSchema = z.object({
  imageUrl: z.string().url().describe('The URL of the generated album cover image.'),
});
export type GenerateAlbumArtOutput = z.infer<typeof GenerateAlbumArtOutputSchema>;


const generateArtPrompt = ai.definePrompt({
    name: 'generateArtPrompt',
    input: { schema: z.string() },
    prompt: `You are a visionary album art designer for an electronic music artist.
    
    Create a stunning, high-quality, square album cover for an album titled: "{{{input}}}".
    
    The style should be a futuristic, neon-cyberpunk theme. Think neon-drenched cityscapes, cosmic voids, abstract digital landscapes, and glitch art elements.
    Use a dark, deep-space background with vibrant neon colors like cyan, magenta, and electric blue as primary accents.
    The final image should be visually striking, professional, and suitable for a music album cover. Do not include any text or logos.`
});


const generateAlbumArtFlow = ai.defineFlow(
  {
    name: 'generateAlbumArtFlow',
    inputSchema: z.string(),
    outputSchema: GenerateAlbumArtOutputSchema,
  },
  async (albumTitle) => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: await generateArtPrompt(albumTitle),
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          // Ensure we generate a square image suitable for album art
          imageConfig: {
            gridImages: 1,
            aspectRatio: '1:1',
          }
        },
    });

    if (!media.url) {
        throw new Error('Image generation failed to produce a URL.');
    }

    return { imageUrl: media.url };
  }
);


export async function generateAlbumArt(albumTitle: string): Promise<GenerateAlbumArtOutput> {
  return generateAlbumArtFlow(albumTitle);
}
