// lib/groqClient.js

import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, // Set this in your .env
  baseURL: "https://api.groq.com/openai/v1", // Pointing to Groq endpoint
});

const defaultParams = {
  model: "llama3-70b-8192",
  temperature: 0.7,
};

export const chatWithGroq = async (messages, retries = 3) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        ...defaultParams,
        messages,
      });
      return response;
    } catch (error) {
      if (
        error.code === "rate_limit_exceeded" &&
        error.status === 429 &&
        attempt < retries
      ) {
        const retryAfter =
          error.headers?.get?.("retry-after") ||
          error.response?.headers?.get?.("retry-after") ||
          20; // fallback to 20s

        const waitTime = parseFloat(retryAfter) * 1000;

        console.warn(
          `Rate limit hit. Retrying in ${waitTime / 1000}s (Attempt ${
            attempt + 1
          }/${retries})`
        );
        await new Promise((r) => setTimeout(r, waitTime));
        continue;
      }

      // For other errors or max retries exceeded
      console.error("Groq API Error:", error);
      throw error;
    }
  }
};
