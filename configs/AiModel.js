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
