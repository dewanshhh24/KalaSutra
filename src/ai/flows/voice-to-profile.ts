'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VoiceToProfileInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio recording of the artisan describing their craft, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VoiceToProfileInput = z.infer<typeof VoiceToProfileInputSchema>;

const VoiceToProfileOutputSchema = z.object({
  name: z.string().describe("The name of the artisan."),
  craft: z.string().describe("The artisan's craft or specialty."),
  region: z.string().describe("The region or location where the artisan is based."),
  experience: z.string().describe("The artisan's years of experience or a description of their expertise."),
});
export type VoiceToProfileOutput = z.infer<typeof VoiceToProfileOutputSchema>;

export async function voiceToProfile(input: VoiceToProfileInput): Promise<VoiceToProfileOutput> {
  return voiceToProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceToProfilePrompt',
  input: {schema: VoiceToProfileInputSchema},
  output: {schema: VoiceToProfileOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an AI assistant that extracts profile information from an artisan's voice recording.

Listen to the audio and extract the following information:
- Artisan's Name
- Craft (e.g., pottery, weaving, painting)
- Region
- Experience (years of experience or description)

Return the information in a structured format.

Audio input: {{media url=audioDataUri}}`,
});

const voiceToProfileFlow = ai.defineFlow(
  {
    name: 'voiceToProfileFlow',
    inputSchema: VoiceToProfileInputSchema,
    outputSchema: VoiceToProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
