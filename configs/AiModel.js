// const {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } = require("@google/generative-ai");

// const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "llama-4-scout-17b-16e-instruct",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "application/json",
// };

// const generationConfig2 = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// export const courseOutlineAIModel = model.startChat({
//   generationConfig,
// });

// export const generateNotesAIModel = model.startChat({
//   generationConfig,
// });

// export const generateQuizAIModel = model.startChat({
//   generationConfig,
// });

// export const generateStudyTypeContentAIModel = model.startChat({
//   generationConfig,
// });

import { chatWithGroq } from "../lib/groqClient";

export const courseOutlineAIModel = async (userPrompt) => {
  return await chatWithGroq([
    { role: "system", content: "You are a helpful educational assistant." },
    { role: "user", content: userPrompt },
  ]);
};

export const generateNotesAIModel = async (userPrompt) => {
  return await chatWithGroq([
    {
      role: "system",
      content:
        "You are an AI that generates concise, topic-focused study notes. Respond with valid JSON format only!,  No additional wrapper text only valid JSON Object",
    },
    { role: "user", content: userPrompt },
  ]);
};

export const generateQuizAIModel = async (userPrompt) => {
  return await chatWithGroq([
    {
      role: "system",
      content:
        "You generate multiple-choice quizzes based on educational topics. Respond with valid JSON format only! No additional wrapper text only valid JSON Object",
    },
    { role: "user", content: userPrompt },
  ]);
};

export const generateStudyTypeContentAIModel = async (userPrompt) => {
  return await chatWithGroq([
    {
      role: "system",
      content:
        "You generate study material based on the given type (e.g., flashcards, summaries). Respond with valid JSON format only!,  No additional wrapper text only valid JSON Object",
    },
    { role: "user", content: userPrompt },
  ]);
};
