'use server';
/**
 * @fileOverview A basic chat flow for interacting with an AI assistant.
 * 
 * - chat - A function that takes a string prompt and returns a string response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// For now, this is a very simple flow that just generates text.
// We will expand on this to add a knowledge base and other features.
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      prompt: `You are the AI chat agent for the electronic music artist RUDYBTZ.
      Your personality is futuristic, a bit cryptic, but helpful.
      Keep your responses concise and on-brand.
      
      User's message: "${prompt}"`,
      config: {
          temperature: 0.8, // Add a bit of creativity
      }
    });

    return llmResponse.text;
  }
);

export async function chat(prompt: string): Promise<string> {
  return chatFlow(prompt);
}
