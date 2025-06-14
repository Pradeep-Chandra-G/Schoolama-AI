const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro-preview-05-06",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json"
};

const generationConfig2 = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain"
};


export const courseOutlineAIModel = model.startChat({
    generationConfig,
    // history: [
    //     {
    //         role: "user",
    //         parts: [
    //             { text: "Generate a " }
    //         ]
    //     }
    // ]
});

export const generateNotesAIModel = model.startChat({
    generationConfig,
});

export const generateQuizAIModel = model.startChat({
    generationConfig,
});


export const generateStudyTypeContentAIModel = model.startChat({
    generationConfig,
});



