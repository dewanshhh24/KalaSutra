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

const prompt = ai.definePrompt({
  name: 'generatePromotionalPosterPrompt',
  input: {schema: GeneratePromotionalPosterInputSchema},
  output: {schema: GeneratePromotionalPosterOutputSchema},
  prompt: `You are an expert graphic designer specializing in creating promotional posters.

You will use the provided product photo and style to generate a promotional poster.

Product Photo: {{media url=photoDataUri}}
Style: {{{style}}}

Generate a promotional poster in the specified style. The poster should be visually appealing and suitable for use on social media and other marketing channels.

Ensure the generated image is high quality.
`,
});

const generatePromotionalPosterFlow = ai.defineFlow(
  {
    name: 'generatePromotionalPosterFlow',
    inputSchema: GeneratePromotionalPosterInputSchema,
    outputSchema: GeneratePromotionalPosterOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: `generate a {{{style}}} promotional poster of this product`},
      ],
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    return {posterDataUri: media!.url!};
  }
);
