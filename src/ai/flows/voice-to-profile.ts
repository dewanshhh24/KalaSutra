'use server';

/**
 * @fileOverview An AI agent that transcribes a voice note into a structured artisan profile.
 *
 * - voiceToProfile - A function that handles the voice note transcription and profile creation process.
 * - VoiceToProfileInput - The input type for the voiceToPcd rofile function.
 * - VoiceToProfileOutput - The return type for the voiceToProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceToProfileInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'An audio recording of the artisan describing their craft, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected description
    ),
});
export type VoiceToProfileInput = z.infer<typeof VoiceToProfileInputSchema>;

const VoiceToProfileOutputSchema = z.object({
  name: z.string().describe('The name of the artisan.'),
  craft: z.string().describe('The artisan\'s craft or specialty.'),
  region: z.string().describe('The region or location where the artisan is based.'),
  experience: z.string().describe('The artisan\'s years of experience or a description of their expertise.'),
});
export type VoiceToProfileOutput = z.infer<typeof VoiceToProfileOutputSchema>;

export async function voiceToProfile(input: VoiceToProfileInput): Promise<VoiceToProfileOutput> {
  return voiceToProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceToProfilePrompt',
  input: {schema: VoiceToProfileInputSchema},
  output: {schema: VoiceToProfileOutputSchema},
  prompt: `You are an AI assistant that extracts profile information from an artisan's voice recording.

  Listen to the audio and extract the following information:
  - Artisan's Name
  - Craft (e.g., pottery, weaving, painting)
  - Region (where they are located)
  - Experience (years of experience or a description of their expertise)

  Audio: {{media url=audioDataUri}}

  Return the information in a structured format.
  `,
});

const voiceToProfileFlow = ai.defineFlow(
  {
    name: 'voiceToProfileFlow',
    inputSchema: VoiceToProfileInputSchema,
    outputSchema: VoiceToProfileOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are an AI assistant that extracts profile information from an artisan's voice recording.
  Listen to the audio and extract the following information:
  - Artisan's Name
  - Craft (e.g., pottery, weaving, painting)
  - Region (where they are located)
  - Experience (years of experience or a description of their expertise)

  Audio: ${input.audioDataUri}

  Return the information in a structured format.
  `,
      output: {
        schema: VoiceToProfileOutputSchema,
      },
    });
    return output!;
  }
);
