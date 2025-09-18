'use server';

/**
 * @fileOverview This file defines the AI marketing engine flow for generating social media posts,
 * WhatsApp messages, and a blog post draft to help artisans market their products.
 *
 * - generateMarketingContent - A function that triggers the generation of marketing content.
 * - GenerateMarketingContentInput - The input type for the generateMarketingContent function.
 * - GenerateMarketingContentOutput - The return type for the generateMarketingContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingContentInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  productPhotoDataUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  artisanName: z.string().describe('The name of the artisan.'),
  artisanCraft: z.string().describe('The craft of the artisan.'),
  artisanRegion: z.string().describe('The region the artisan is from.'),
});
export type GenerateMarketingContentInput = z.infer<typeof GenerateMarketingContentInputSchema>;

const GenerateMarketingContentOutputSchema = z.object({
  socialMediaPost: z.string().describe('A social media post promoting the product.'),
  whatsAppMessage: z.string().describe('A WhatsApp message promoting the product.'),
  blogPostDraft: z.string().describe('A draft of a blog post about the product.'),
});
export type GenerateMarketingContentOutput = z.infer<typeof GenerateMarketingContentOutputSchema>;

export async function generateMarketingContent(
  input: GenerateMarketingContentInput
): Promise<GenerateMarketingContentOutput> {
  return generateMarketingContentFlow(input);
}

const generateMarketingContentPrompt = ai.definePrompt({
  name: 'generateMarketingContentPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GenerateMarketingContentInputSchema},
  output: {schema: GenerateMarketingContentOutputSchema},
  prompt: [
    {text: `You are an AI marketing assistant helping artisans promote their products.

The artisan's name is {{artisanName}}, their craft is {{artisanCraft}}, and they are from {{artisanRegion}}.
The product is named {{productName}}, and here is a detailed description: {{productDescription}}.

Here is a photo of the product:
`},
    {media: {url: '{{productPhotoDataUri}}' }},
    {text: `
Generate a social media post, a WhatsApp message, and a blog post draft to promote the product. Focus on the unique aspects of the product and the artisan's story.
`}
  ],
});

const generateMarketingContentFlow = ai.defineFlow(
  {
    name: 'generateMarketingContentFlow',
    inputSchema: GenerateMarketingContentInputSchema,
    outputSchema: GenerateMarketingContentOutputSchema,
  },
  async input => {
    const {output} = await generateMarketingContentPrompt(input);
    return output!;
  }
);
