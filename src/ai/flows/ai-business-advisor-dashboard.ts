'use server';
/**
 * @fileOverview An AI Business Advisor Dashboard flow that provides insights on poster performance,
 * demand signals, and WhatsApp engagement for artisans to make data-driven decisions.
 * This version incorporates a tool to fetch the latest market trends for better recommendations.
 * Importantly, it uses the LLM to decide whether to use a tool or not.
 *
 * - getBusinessInsights - A function that retrieves business insights.
 * - BusinessInsightsInput - The input type for the getBusinessInsights function.
 * - BusinessInsightsOutput - The return type for the getBusinessInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessInsightsInputSchema = z.object({
  posterPerformanceData: z.string().describe('Data related to the performance of promotional posters, including views, clicks, and shares.'),
  demandSignalsData: z.string().describe('Data indicating product demand, such as website traffic, search trends, and customer reviews.'),
  whatsAppEngagementData: z.string().describe('Data on customer engagement via WhatsApp, including messages sent, replies received, and conversions.'),
});
export type BusinessInsightsInput = z.infer<typeof BusinessInsightsInputSchema>;

const BusinessInsightsOutputSchema = z.object({
  summaryInsights: z.string().describe('A summary of key insights derived from the provided data.'),
  recommendations: z.string().describe('Actionable recommendations for the artisan to improve sales and marketing efforts.'),
  potentialRisks: z.string().describe('Potential risks and challenges the artisan should be aware of.'),
});
export type BusinessInsightsOutput = z.infer<typeof BusinessInsightsOutputSchema>;

const getMarketTrends = ai.defineTool(
  {
    name: 'getMarketTrends',
    description: 'Retrieves the latest market trends related to artisan crafts.',
    inputSchema: z.object({
      craft: z.string().describe('The specific craft to get market trends for.'),
      region: z.string().describe('The region the artisan is operating in.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // Placeholder implementation: return some static trends.
    return `Latest trends for ${input.craft} in ${input.region}: Increased demand for eco-friendly materials and personalized designs.`
  }
);

export async function getBusinessInsights(input: BusinessInsightsInput): Promise<BusinessInsightsOutput> {
  return businessInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'businessInsightsPrompt',
  input: {schema: BusinessInsightsInputSchema},
  output: {schema: BusinessInsightsOutputSchema},
  tools: [getMarketTrends],
  prompt: `You are an AI Business Advisor providing insights to artisans. 

  Analyze the following data to provide a summary of key insights, actionable recommendations, and potential risks. 
  If the artisan is struggling with sales or engagement, consider using the getMarketTrends tool to provide more specific recommendations.

  Poster Performance Data: {{{posterPerformanceData}}}
  Demand Signals Data: {{{demandSignalsData}}}
  WhatsApp Engagement Data: {{{whatsAppEngagementData}}}

  Provide your output in a structured format, focusing on clear and concise language that is easily understandable for an artisan with limited business knowledge. 
`, 
});

const businessInsightsFlow = ai.defineFlow(
  {
    name: 'businessInsightsFlow',
    inputSchema: BusinessInsightsInputSchema,
    outputSchema: BusinessInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
