// import { db } from '@/configs/db';
// import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT, USER_TABLE } from '@/configs/schema';
// import { eq } from 'drizzle-orm';
// import { inngest } from "./client";
// import { generateNotesAIModel, generateStudyTypeContentAIModel, generateQuizAIModel } from '@/configs/AiModel';

// export const CreateNewUser = inngest.createFunction(
//   { id: "create-user" },
//   { event: 'user.create' },
//   async ({ event, step }) => {
//     const { user } = event.data;
//     //GET EVENT DATA
//     const result = await step.run('Check User and create new User if not in DB', async () => {
//       //Check if user exists
//       const result = await db.select().from(USER_TABLE)
//         .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));
//       //If not, then add to DB
//       if (result?.length == 0) {
//         const userResp = await db.insert(USER_TABLE).values({
//           userName: user?.firstName,
//           email: user?.primaryEmailAddress?.emailAddress
//         }).returning({ id: USER_TABLE.id });
//         return userResp;
//       }
//       return result;
//     })
//     return "Success";
//   }

//   //Step to send welcome mail notification

//   //Step to send email notification after 3 days from joining
// )

// // export const GenerateNotes = inngest.createFunction(
// //   { id: 'generate-course' },
// //   { event: 'notes.generate' },
// //   async ({ event, step }) => {
// //     const { course } = event.data;

// //     const notesResult = await step.run('Generate Chapter Notes', async () => {
// //       const Chapters = course?.courseLayout.list_of_chapters;

// //       await Promise.all(Chapters.map(async (chapter, index) => {
// //         const PROMPT = `
// //           You are a JSON content generator AI.

// //           Only return a single valid JSON object with exactly the following three fields and nothing else:

// //           - "title": A short chapter title
// //           - "summary": A concise summary (~100 words)
// //           - "markdownContent": Detailed study notes formatted in Markdown with good structure (headings, bullet points, etc.). The content should look like a beautifully written chapter.

// //           Do not wrap your response in any other format (like "candidates", "parts", "text", etc.).

// //           Do not include any explanations.

// //           Input chapter:
// //           ${JSON.stringify(chapter)}
// //           Return only:
// //           {
// //             "title": "...",
// //             "summary": "...",
// //             "markdownContent": "..."
// //           }
// //           `;
// //         const result = await generateNotesAIModel.sendMessage(PROMPT);
// //         const aiText = await result.response.text();
// //         const aiResp = JSON.parse(aiText);

// //         await db.insert(CHAPTER_NOTES_TABLE).values({
// //           chapterId: index,
// //           courseId: course?.courseId,
// //           notes: aiResp,
// //         });
// //       }));

// //       return 'Completed';
// //     });

// //     const updateCourseStatusResult = await step.run('Update Course Status to Ready', async () => {
// //       await db.update(STUDY_MATERIAL_TABLE).set({
// //         status: 'Ready'
// //       }).where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
// //       return 'Success';
// //     });
// //   }
// // );

// // Used to generate Flashcard, Quiz, Question/Answer
// // export const GenerateStudyTypeContent = inngest.createFunction(
// //   { id: 'Generate Study Type Content' },
// //   { event: 'studyType.content' },

// //   async ({ event, step }) => {
// //     const { studyType, prompt, recordId, courseId } = event.data;

// //     const FlashcardAiResult = await step.run('Generating Flashcard using AI', async () => {
// //       const result = await generateStudyTypeContentAIModel.sendMessage(prompt);
// //       const AiResult = JSON.parse(result.response.text());
// //       return AiResult;
// //     })

// //     // Save the Result
// //     const DbResult = await step.run('Save result to DB', async () => {
// //       const result = await db.update(STUDY_TYPE_CONTENT)
// //         .set({
// //           status: "Ready",
// //           content: FlashcardAiResult
// //         }).where(eq(STUDY_TYPE_CONTENT.id, recordId));

// //       return 'Inserted successfully'
// //     })
// //   }
// // )

// export const GenerateNotes = inngest.createFunction(
//   {
//     id: 'generate-course',
//     retries: 0 // Handle retries manually
//   },
//   { event: 'notes.generate' },
//   async ({ event, step }) => {
//     const { course, retryAttempt = 0 } = event.data;

//     // Step 1: Identify which chapters need to be processed
//     const chaptersToProcess = await step.run('Identify Missing Chapters', async () => {
//       const Chapters = course?.courseLayout.list_of_chapters;

//       const existingNotes = await db
//         .select()
//         .from(CHAPTER_NOTES_TABLE)
//         .where(eq(CHAPTER_NOTES_TABLE.courseId, course?.courseId));

//       const existingChapterIds = new Set(existingNotes.map(note => note.chapterId));

//       const missingChapters = Chapters
//         .map((chapter, index) => ({ chapter, index }))
//         .filter(({ index }) => !existingChapterIds.has(index));

//       console.log(`Attempt ${retryAttempt + 1}: Found ${missingChapters.length} chapters to process`);

//       return missingChapters;
//     });

//     // Step 2: Generate notes for missing chapters with individual retry logic
//     const notesResult = await step.run('Generate Missing Chapter Notes', async () => {
//       if (chaptersToProcess.length === 0) {
//         return { processed: 0, successful: 0, failed: 0, failedChapters: [] };
//       }

//       // Process chapters with individual error handling
//       const results = [];
//       for (const { chapter, index } of chaptersToProcess) {
//         try {
//           const result = await generateChapterWithRetry(chapter, index, course?.courseId);
//           results.push({ success: true, chapterId: index });
//         } catch (error) {
//           console.error(`Failed to generate chapter ${index} after retries:`, error.message);
//           results.push({ success: false, chapterId: index, error: error.message });
//         }
//       }

//       const successful = results.filter(r => r.success);
//       const failed = results.filter(r => !r.success);

//       return {
//         processed: chaptersToProcess.length,
//         successful: successful.length,
//         failed: failed.length,
//         failedChapters: failed.map(f => f.chapterId)
//       };
//     });

//     // Step 3: Handle completion or retry logic
//     const finalResult = await step.run('Handle Completion or Retry', async () => {
//       const totalChapters = course?.courseLayout.list_of_chapters.length;

//       const allNotes = await db
//         .select()
//         .from(CHAPTER_NOTES_TABLE)
//         .where(eq(CHAPTER_NOTES_TABLE.courseId, course?.courseId));

//       const isComplete = allNotes.length === totalChapters;

//       if (isComplete) {
//         // All chapters complete - mark as ready
//         await db.update(STUDY_MATERIAL_TABLE).set({
//           status: 'Ready'
//         }).where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

//         return { status: 'completed', message: 'All chapters generated successfully' };
//       } else if (notesResult.failed > 0 && retryAttempt < 3) {
//         // Some chapters failed and we haven't exceeded retry limit
//         const delay = Math.pow(2, retryAttempt) * 30000; // 30s, 60s, 120s delays

//         console.log(`Scheduling retry ${retryAttempt + 1} in ${delay / 1000} seconds for ${notesResult.failed} failed chapters`);

//         // Schedule a retry with exponential backoff
//         await inngest.send({
//           name: 'notes.generate',
//           data: {
//             course,
//             retryAttempt: retryAttempt + 1
//           },
//           delay: delay
//         });

//         return {
//           status: 'retry_scheduled',
//           message: `Retry ${retryAttempt + 1} scheduled for ${notesResult.failed} failed chapters`,
//           nextRetryIn: `${delay / 1000}s`
//         };
//       } else {
//         // Max retries exceeded or no failures but still incomplete
//         await db.update(STUDY_MATERIAL_TABLE).set({
//           status: 'Failed'
//         }).where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

//         return {
//           status: 'failed',
//           message: `Course generation failed after ${retryAttempt + 1} attempts`,
//           remainingChapters: totalChapters - allNotes.length
//         };
//       }
//     });

//     return {
//       attempt: retryAttempt + 1,
//       chaptersProcessed: notesResult.processed,
//       successful: notesResult.successful,
//       failed: notesResult.failed,
//       result: finalResult
//     };
//   }
// );

// // Helper function to generate a single chapter with retry logic
// async function generateChapterWithRetry(chapter, chapterId, courseId, maxRetries = 2) {
//   for (let attempt = 0; attempt <= maxRetries; attempt++) {
//     try {
//       const PROMPT = `
//         You are a JSON content generator AI.

//         Only return a single valid JSON object with exactly the following three fields and nothing else:

//         - "title": A short chapter title
//         - "summary": A concise summary (~100 words)
//         - "markdownContent": Detailed study notes formatted in Markdown with good structure (headings, bullet points, etc.). The content should look like a beautifully written chapter.

//         Do not wrap your response in any other format (like "candidates", "parts", "text", etc.).

//         Do not include any explanations.

//         Input chapter:
//         ${JSON.stringify(chapter)}
//         Return only:
//         {
//           "title": "...",
//           "summary": "...",
//           "markdownContent": "..."
//         }
//         `;

//       const result = await generateNotesAIModel.sendMessage(PROMPT);
//       const aiText = await result.response.text();
//       const aiResp = JSON.parse(aiText);

//       await db.insert(CHAPTER_NOTES_TABLE).values({
//         chapterId,
//         courseId,
//         notes: aiResp,
//         createdAt: new Date(),
//       });

//       console.log(`Successfully generated chapter ${chapterId} on attempt ${attempt + 1}`);
//       return aiResp;

//     } catch (error) {
//       console.error(`Attempt ${attempt + 1} failed for chapter ${chapterId}:`, error.message);

//       if (attempt === maxRetries) {
//         throw error; // Final attempt failed
//       }

//       // Wait before retry (exponential backoff)
//       await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
//     }
//   }
// }

// export const GenerateStudyTypeContent = inngest.createFunction(
//   { id: 'Generate Study Type Content' },
//   { event: 'studyType.content' },

//   async ({ event, step }) => {
//     const { studyType, prompt, recordId, courseId } = event.data;

//     // Step 1: Generate content using AI
//     const AiResult = await step.run('Generating Flashcard/Quiz using AI', async () => {
//       const result =
//         studyType == 'Flashcard' ?
//           await generateStudyTypeContentAIModel.sendMessage(prompt) :
//           await generateQuizAIModel.sendMessage(prompt);

//       // Properly await the text and parse it
//       const aiText = await result.response.text();
//       const parsed = JSON.parse(aiText);

//       // Return a plain JSON object (remove any custom prototype)
//       return JSON.parse(JSON.stringify(parsed));
//     });

//     // Step 2: Save result to DB
//     const DbResult = await step.run('Save result to DB', async () => {
//       await db.update(STUDY_TYPE_CONTENT)
//         .set({
//           status: "Ready",
//           content: AiResult, // Assumes content column is type `json`
//         })
//         .where(eq(STUDY_TYPE_CONTENT.id, recordId));

//       return 'Inserted successfully';
//     });

//     return "Inserted successfully";
//   }
// );

// inngest/functions.js
import { db } from "@/configs/db";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT,
  USER_TABLE,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { inngest } from "./client";
import {
  generateNotesAIModel,
  generateStudyTypeContentAIModel,
  generateQuizAIModel,
} from "@/configs/AiModel";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello World!" };
  }
);

export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    const { user } = event.data;
    //GET EVENT DATA
    const result = await step.run(
      "Check User and create new User if not in DB",
      async () => {
        //Check if user exists
        const result = await db
          .select()
          .from(USER_TABLE)
          .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));
        //If not, then add to DB
        if (result?.length == 0) {
          const userResp = await db
            .insert(USER_TABLE)
            .values({
              userName: user?.firstName,
              email: user?.primaryEmailAddress?.emailAddress,
            })
            .returning({ id: USER_TABLE.id });
          return userResp;
        }
        return result;
      }
    );
    return "Success";
  }
);

export const GenerateNotes = inngest.createFunction(
  {
    id: "generate-course",
    retries: 0,
  },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course, retryAttempt = 0 } = event.data;

    const chaptersToProcess = await step.run(
      "Identify Missing Chapters",
      async () => {
        const Chapters = course?.courseLayout.list_of_chapters;

        const existingNotes = await db
          .select()
          .from(CHAPTER_NOTES_TABLE)
          .where(eq(CHAPTER_NOTES_TABLE.courseId, course?.courseId));

        const existingChapterIds = new Set(
          existingNotes.map((note) => note.chapterId)
        );

        return Chapters.map((chapter, index) => ({ chapter, index })).filter(
          ({ index }) => !existingChapterIds.has(index)
        );
      }
    );

    const notesResult = await step.run(
      "Generate Missing Chapter Notes",
      async () => {
        const results = await Promise.all(
          chaptersToProcess.map(async ({ chapter, index }) => {
            try {
              const result = await generateChapterWithRetry(
                chapter,
                index,
                course?.courseId
              );
              return { success: true, chapterId: index };
            } catch (error) {
              return { success: false, chapterId: index, error: error.message };
            }
          })
        );

        return {
          processed: results.length,
          successful: results.filter((r) => r.success).length,
          failed: results.filter((r) => !r.success).length,
          failedChapters: results
            .filter((r) => !r.success)
            .map((f) => f.chapterId),
        };
      }
    );

    const finalResult = await step.run(
      "Handle Completion or Retry",
      async () => {
        const totalChapters = course?.courseLayout.list_of_chapters.length;
        const allNotes = await db
          .select()
          .from(CHAPTER_NOTES_TABLE)
          .where(eq(CHAPTER_NOTES_TABLE.courseId, course?.courseId));

        const isComplete = allNotes.length === totalChapters;

        if (isComplete) {
          await db
            .update(STUDY_MATERIAL_TABLE)
            .set({ status: "Ready" })
            .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

          return {
            status: "completed",
            message: "All chapters generated successfully",
          };
        }

        if (notesResult.failed > 0 && retryAttempt < 3) {
          const delay = Math.pow(2, retryAttempt) * 30000;

          await inngest.send({
            name: "notes.generate",
            data: { course, retryAttempt: retryAttempt + 1 },
            delay,
          });

          return {
            status: "retry_scheduled",
            message: `Retry ${retryAttempt + 1} scheduled for ${
              notesResult.failed
            } failed chapters`,
            nextRetryIn: `${delay / 1000}s`,
          };
        }

        await db
          .update(STUDY_MATERIAL_TABLE)
          .set({ status: "Failed" })
          .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

        return {
          status: "failed",
          message: `Course generation failed after ${
            retryAttempt + 1
          } attempts`,
          remainingChapters: totalChapters - allNotes.length,
        };
      }
    );

    return {
      attempt: retryAttempt + 1,
      chaptersProcessed: notesResult.processed,
      successful: notesResult.successful,
      failed: notesResult.failed,
      result: finalResult,
    };
  }
);

// async function generateChapterWithRetry(
//   chapter,
//   chapterId,
//   courseId,
//   maxRetries = 2
// ) {
//   const PROMPT = `
// You are a JSON content generator AI.
// Only return a single valid JSON object with exactly the following three fields:
// - "title": A short chapter title
// - "summary": A concise summary (~100 words)
// - "markdownContent": Detailed study notes in Markdown.
// Input chapter: ${JSON.stringify(chapter)}
// Return only the JSON.
// `;

//   for (let attempt = 0; attempt <= maxRetries; attempt++) {
//     try {
//       const result = await generateNotesAIModel(PROMPT); // ✅ Correct function call
//       const aiText = await result.response.text(); // depends on your chatWithGroq response shape
//       const aiResp = JSON.parse(aiText);

//       await db.insert(CHAPTER_NOTES_TABLE).values({
//         chapterId,
//         courseId,
//         notes: aiResp,
//         createdAt: new Date(),
//       });

//       return aiResp;
//     } catch (error) {
//       if (attempt === maxRetries) throw error;
//       await new Promise((resolve) =>
//         setTimeout(resolve, Math.pow(2, attempt) * 1000)
//       );
//     }
//   }
// }

// async function generateChapterWithRetry(
//   chapter,
//   chapterId,
//   courseId,
//   maxRetries = 2
// ) {
//   const PROMPT = `
// You are a JSON content generator AI.
// Only return a single valid JSON object with exactly the following three fields:
// - "title": A short chapter title
// - "summary": A concise summary (~100 words)
// - "markdownContent": Detailed study notes in Markdown.
// Input chapter: ${JSON.stringify(chapter)}
// Return only the JSON.
// `;

//   for (let attempt = 0; attempt <= maxRetries; attempt++) {
//     try {
//       const result = await generateNotesAIModel(PROMPT);

//       // Fix: Handle the response properly based on your AI model's response structure
//       let aiText;
//       if (result.response && result.response.text) {
//         aiText = await result.response.text();
//       } else if (result.text) {
//         aiText = result.text;
//       } else if (
//         result.choices &&
//         result.choices[0] &&
//         result.choices[0].message
//       ) {
//         aiText = result.choices[0].message.content;
//       } else if (typeof result === "string") {
//         aiText = result;
//       } else {
//         throw new Error("Unexpected response format from AI model");
//       }

//       const aiResp = JSON.parse(aiText);

//       await db.insert(CHAPTER_NOTES_TABLE).values({
//         chapterId,
//         courseId,
//         notes: aiResp,
//         createdAt: new Date(),
//       });

//       return aiResp;
//     } catch (error) {
//       console.error(`Attempt ${attempt + 1} failed:`, error);
//       if (attempt === maxRetries) throw error;
//       await new Promise((resolve) =>
//         setTimeout(resolve, Math.pow(2, attempt) * 1000)
//       );
//     }
//   }
// }

// export const GenerateStudyTypeContent = inngest.createFunction(
//   { id: "Generate Study Type Content" },
//   { event: "studyType.content" },
//   async ({ event, step }) => {
//     const { studyType, prompt, recordId } = event.data;

//     const AiResult = await step.run("Generate Study Type Content", async () => {
//       const model =
//         studyType === "Flashcard"
//           ? generateStudyTypeContentAIModel
//           : generateQuizAIModel;
//       const result = await model.chat.completions.create({
//         model: "mixtral-8x7b-32768",
//         messages: [{ role: "user", content: prompt }],
//       });
//       return JSON.parse(
//         JSON.stringify(JSON.parse(result.choices[0].message.content))
//       );
//     });

//     await step.run("Save Content to DB", async () => {
//       await db
//         .update(STUDY_TYPE_CONTENT)
//         .set({ status: "Ready", content: AiResult })
//         .where(eq(STUDY_TYPE_CONTENT.id, recordId));
//     });

//     return "Inserted successfully";
//   }
// );

async function generateChapterWithRetry(
  chapter,
  chapterId,
  courseId,
  maxRetries = 2
) {
  const PROMPT = `
You are a JSON content generator AI.
Only return a single valid JSON object with exactly the following three fields:
- "title": A short chapter title
- "summary": A concise summary (~100 words)
- "markdownContent": Detailed study notes in Markdown.
Input chapter: ${JSON.stringify(chapter)}
Return only the JSON.
`;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await generateNotesAIModel(PROMPT);

      // Extract the AI response content (Groq uses OpenAI-compatible format)
      const aiText = result.choices[0].message.content;
      const aiResp = JSON.parse(aiText);

      await db.insert(CHAPTER_NOTES_TABLE).values({
        chapterId,
        courseId,
        notes: aiResp,
        createdAt: new Date(),
      });

      return aiResp;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      if (attempt === maxRetries) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}

// Fixed GenerateStudyTypeContent function
export const GenerateStudyTypeContent = inngest.createFunction(
  { id: "Generate Study Type Content" },
  { event: "studyType.content" },
  async ({ event, step }) => {
    const { studyType, prompt, recordId } = event.data;

    const AiResult = await step.run("Generate Study Type Content", async () => {
      try {
        let result;

        if (studyType === "Flashcard") {
          result = await generateStudyTypeContentAIModel(prompt);
        } else {
          result = await generateQuizAIModel(prompt);
        }

        // Extract the AI response content (Groq uses OpenAI-compatible format)
        const aiText = result.choices[0].message.content;
        const parsedResponse = JSON.parse(aiText);

        return parsedResponse;
      } catch (error) {
        console.error("Error in GenerateStudyTypeContent:", error);
        throw error;
      }
    });

    await step.run("Save Content to DB", async () => {
      await db
        .update(STUDY_TYPE_CONTENT)
        .set({ status: "Ready", content: AiResult, type: studyType })
        .where(eq(STUDY_TYPE_CONTENT.id, recordId));
    });

    return "Inserted successfully";
  }
);

// import { db } from "@/configs/db";
// import {
//   CHAPTER_NOTES_TABLE,
//   STUDY_MATERIAL_TABLE,
//   STUDY_TYPE_CONTENT,
//   USER_TABLE,
// } from "@/configs/schema";
// import { eq } from "drizzle-orm";
// import { inngest } from "./client";
// import {
//   generateNotesAIModel,
//   generateStudyTypeContentAIModel,
//   generateQuizAIModel,
// } from "@/configs/AiModel";

// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event, step }) => {
//     await step.sleep("wait-a-moment", "1s");
//     return { event, body: "Hello World!" };
//   }
// );

// export const CreateNewUser = inngest.createFunction(
//   { id: "create-user" },
//   { event: "user.create" },
//   async ({ event, step }) => {
//     const { user } = event.data;
//     return await step.run(
//       "Check User and create new User if not in DB",
//       async () => {
//         const result = await db
//           .select()
//           .from(USER_TABLE)
//           .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));
//         if (result?.length === 0) {
//           return await db
//             .insert(USER_TABLE)
//             .values({
//               userName: user?.firstName,
//               email: user?.primaryEmailAddress?.emailAddress,
//             })
//             .returning({ id: USER_TABLE.id });
//         }
//         return result;
//       }
//     );
//   }
// );

// export const GenerateNotes = inngest.createFunction(
//   { id: "generate-course", retries: 0 },
//   { event: "notes.generate" },
//   async ({ event, step }) => {
//     const { course, retryAttempt = 0 } = event.data;
//     const chaptersToProcess = await step.run(
//       "Identify Missing Chapters",
//       async () => {
//         const Chapters = course?.courseLayout.list_of_chapters || [];
//         const existingNotes = await db
//           .select()
//           .from(CHAPTER_NOTES_TABLE)
//           .where(eq(CHAPTER_NOTES_TABLE.courseId, course?.courseId));

//         const existingChapterIds = new Set(
//           existingNotes.map((note) => note.chapterId)
//         );
//         return Chapters.map((chapter, index) => ({ chapter, index })).filter(
//           ({ index }) => !existingChapterIds.has(index)
//         );
//       }
//     );

//     const notesResult = await step.run(
//       "Generate Missing Chapter Notes",
//       async () => {
//         const results = await Promise.all(
//           chaptersToProcess.map(async ({ chapter, index }) => {
//             try {
//               await generateChapterWithRetry(chapter, index, course?.courseId);
//               return { success: true, chapterId: index };
//             } catch (error) {
//               return { success: false, chapterId: index, error: error.message };
//             }
//           })
//         );

//         return {
//           processed: results.length,
//           successful: results.filter((r) => r.success).length,
//           failed: results.filter((r) => !r.success).length,
//           failedChapters: results
//             .filter((r) => !r.success)
//             .map((f) => f.chapterId),
//         };
//       }
//     );

//     const finalResult = await step.run(
//       "Handle Completion or Retry",
//       async () => {
//         const totalChapters = course?.courseLayout.list_of_chapters.length || 0;
//         const allNotes = await db
//           .select()
//           .from(CHAPTER_NOTES_TABLE)
//           .where(eq(CHAPTER_NOTES_TABLE.courseId, course?.courseId));

//         if (allNotes.length === totalChapters) {
//           await db
//             .update(STUDY_MATERIAL_TABLE)
//             .set({ status: "Ready" })
//             .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

//           return {
//             status: "completed",
//             message: "All chapters generated successfully",
//           };
//         }

//         if (notesResult.failed > 0 && retryAttempt < 3) {
//           const delay = Math.pow(2, retryAttempt) * 30000;
//           await inngest.send({
//             name: "notes.generate",
//             data: { course, retryAttempt: retryAttempt + 1 },
//             delay,
//           });
//           return {
//             status: "retry_scheduled",
//             message: `Retry ${retryAttempt + 1} scheduled for ${
//               notesResult.failed
//             } failed chapters`,
//             nextRetryIn: `${delay / 1000}s`,
//           };
//         }

//         await db
//           .update(STUDY_MATERIAL_TABLE)
//           .set({ status: "Failed" })
//           .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

//         return {
//           status: "failed",
//           message: `Course generation failed after ${
//             retryAttempt + 1
//           } attempts`,
//           remainingChapters: totalChapters - allNotes.length,
//         };
//       }
//     );

//     return {
//       attempt: retryAttempt + 1,
//       chaptersProcessed: notesResult.processed,
//       successful: notesResult.successful,
//       failed: notesResult.failed,
//       result: finalResult,
//     };
//   }
// );

// async function generateChapterWithRetry(
//   chapter,
//   chapterId,
//   courseId,
//   maxRetries = 2
// ) {
//   const PROMPT = `You are a JSON content generator AI. Only return a single valid JSON object with exactly the following three fields: \n- "title": A short chapter title\n- "summary": A concise summary (~100 words)\n- "markdownContent": Detailed study notes in Markdown.\nInput chapter: ${JSON.stringify(
//     chapter
//   )}\nReturn only the JSON.`;

//   for (let attempt = 0; attempt <= maxRetries; attempt++) {
//     try {
//       const result = await generateNotesAIModel(PROMPT);
//       const aiText = await result.response.text();
//       const aiResp = JSON.parse(aiText);

//       await db.insert(CHAPTER_NOTES_TABLE).values({
//         chapterId,
//         courseId,
//         notes: aiResp,
//         createdAt: new Date(),
//       });

//       return aiResp;
//     } catch (error) {
//       if (attempt === maxRetries) throw error;
//       await new Promise((resolve) =>
//         setTimeout(resolve, Math.pow(2, attempt) * 1000)
//       );
//     }
//   }
// }

// export const GenerateStudyTypeContent = inngest.createFunction(
//   { id: "Generate Study Type Content" },
//   { event: "studyType.content" },
//   async ({ event, step }) => {
//     const { studyType, prompt, recordId } = event.data;

//     const AiResult = await step.run("Generate Study Type Content", async () => {
//       const model =
//         studyType === "Flashcard"
//           ? generateStudyTypeContentAIModel
//           : generateQuizAIModel;

//       const result = await model(prompt); // ✅ Corrected call
//       const aiText = await result.response.text();
//       return JSON.parse(JSON.stringify(JSON.parse(aiText)));
//     });

//     await step.run("Save Content to DB", async () => {
//       await db
//         .update(STUDY_TYPE_CONTENT)
//         .set({ status: "Ready", content: AiResult })
//         .where(eq(STUDY_TYPE_CONTENT.id, recordId));
//     });

//     return "Inserted successfully";
//   }
// );
