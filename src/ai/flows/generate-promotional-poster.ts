'use server';
/**
 * @fileOverview Generates promotional posters in traditional and modern styles from a product photo using AI.
 *
 * - generatePromotionalPoster - A function that generates promotional posters.
 * - GeneratePromotionalPosterInput - The input type for the generatePromotionalPoster function.
 * - GeneratePromotionalPosterOutput - The return type for the generatePromotionalPoster function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePromotionalPosterInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  style: z.enum(['traditional', 'modern']).describe('The style of the poster.'),
});
export type GeneratePromotionalPosterInput = z.infer<typeof GeneratePromotionalPosterInputSchema>;

const GeneratePromotionalPosterOutputSchema = z.object({
  posterDataUri: z
    .string()
    .describe(
      'The generated promotional poster, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type GeneratePromotionalPosterOutput = z.infer<typeof GeneratePromotionalPosterOutputSchema>;

export async function generatePromotionalPoster(input: GeneratePromotionalPosterInput): Promise<GeneratePromotionalPosterOutput> {
  return generatePromotionalPosterFlow(input);
}

const generatePromotionalPosterFlow = ai.defineFlow(
  {
    name: 'generatePromotionalPosterFlow',
    inputSchema: GeneratePromotionalPosterInputSchema,
    outputSchema: GeneratePromotionalPosterOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: [
        {text: `Generate a ${input.style} promotional poster for the product in the image.`},
        {media: {url: input.photoDataUri}},
      ],
      config: {
          responseModalities: ['IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed');
    }

    return {posterDataUri: media.url};
  }
);
