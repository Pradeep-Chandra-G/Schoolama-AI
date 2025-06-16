import { groq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req) {
    try {
        const { messages } = await req.json();
        const systemMessage = {
            role: 'system',
            content: 'You are a helpful AI assistant. Answer questions to the best of your ability and be conversational and friendly.'
        };

        const result = await streamText({
            model: groq('gemma2-9b-it'),
            messages: [systemMessage, ...messages],
            tools: {
                weather: tool({
                    description: 'Get weather information for a specific location',
                    parameters: z.object({
                        location: z.string().describe('The location to get weather for'),
                    }),
                    execute: async ({ location }) => {
                        // Mock weather - replace with real API like OpenWeatherMap
                        const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
                        const temp = Math.round(Math.random() * 30 + 5);
                        const condition = conditions[Math.floor(Math.random() * conditions.length)];

                        return {
                            location,
                            temperature: temp,
                            condition,
                            humidity: Math.round(Math.random() * 100),
                            windSpeed: Math.round(Math.random() * 20),
                            description: `It's ${condition} in ${location} with a temperature of ${temp}°C`
                        };
                    },
                }),
                calculator: tool({
                    description: 'Perform mathematical calculations',
                    parameters: z.object({
                        expression: z.string().describe('Mathematical expression to evaluate'),
                    }),
                    execute: async ({ expression }) => {
                        try {
                            // Simple eval for basic math - in production, use a proper math parser
                            const result = Function('"use strict"; return (' + expression + ')')();
                            return {
                                expression,
                                result: result.toString(),
                                formatted: `${expression} = ${result}`
                            };
                        } catch (error) {
                            return {
                                expression,
                                error: 'Invalid mathematical expression',
                                formatted: `Error: Could not calculate "${expression}"`
                            };
                        }
                    },
                }),
            },
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}