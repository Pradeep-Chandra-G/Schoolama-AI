import { db } from '@/configs/db';
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT, USER_TABLE } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { inngest } from "./client";
import { generateNotesAIModel, generateStudyTypeContentAIModel, generateQuizAIModel } from '@/configs/AiModel';


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello World!" };
  },
);

export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: 'user.create' },
  async ({ event, step }) => {
    const { user } = event.data;
    //GET EVENT DATA
    const result = await step.run('Check User and create new User if not in DB', async () => {
      //Check if user exists
      const result = await db.select().from(USER_TABLE)
        .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));
      //If not, then add to DB
      if (result?.length == 0) {
        const userResp = await db.insert(USER_TABLE).values({
          userName: user?.firstName,
          email: user?.primaryEmailAddress?.emailAddress
        }).returning({ id: USER_TABLE.id });
        return userResp;
      }
      return result;
    })
    return "Success";
  }

  //Step to send welcome mail notification

  //Step to send email notification after 3 days from joining
)


// export const GenerateNotes = inngest.createFunction(
//   { id: 'generate-course' },
//   { event: 'notes.generate' },
//   async ({ event, step }) => {
//     const { course } = event.data;

//     const notesResult = await step.run('Generate Chapter Notes', async () => {
//       const Chapters = course?.courseLayout.list_of_chapters;

//       await Promise.all(Chapters.map(async (chapter, index) => {
//         const PROMPT = `
//           You are a JSON content generator AI.

//           Only return a single valid JSON object with exactly the following three fields and nothing else:

//           - "title": A short chapter title
//           - "summary": A concise summary (~100 words)
//           - "markdownContent": Detailed study notes formatted in Markdown with good structure (headings, bullet points, etc.). The content should look like a beautifully written chapter.

//           Do not wrap your response in any other format (like "candidates", "parts", "text", etc.).

//           Do not include any explanations.

//           Input chapter:
//           ${JSON.stringify(chapter)}
//           Return only:
//           {
//             "title": "...",
//             "summary": "...",
//             "markdownContent": "..."
//           }
//           `;
//         const result = await generateNotesAIModel.sendMessage(PROMPT);
//         const aiText = await result.response.text();
//         const aiResp = JSON.parse(aiText);

//         await db.insert(CHAPTER_NOTES_TABLE).values({
//           chapterId: index,
//           courseId: course?.courseId,
//           notes: aiResp,
//         });
//       }));

//       return 'Completed';
//     });

//     const updateCourseStatusResult = await step.run('Update Course Status to Ready', async () => {
//       await db.update(STUDY_MATERIAL_TABLE).set({
//         status: 'Ready'
//       }).where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
//       return 'Success';
//     });
//   }
// );

// Used to generate Flashcard, Quiz, Question/Answer
// export const GenerateStudyTypeContent = inngest.createFunction(
//   { id: 'Generate Study Type Content' },
//   { event: 'studyType.content' },

//   async ({ event, step }) => {
//     const { studyType, prompt, recordId, courseId } = event.data;

//     const FlashcardAiResult = await step.run('Generating Flashcard using AI', async () => {
//       const result = await generateStudyTypeContentAIModel.sendMessage(prompt);
//       const AiResult = JSON.parse(result.response.text());
//       return AiResult;
//     })

//     // Save the Result
//     const DbResult = await step.run('Save result to DB', async () => {
//       const result = await db.update(STUDY_TYPE_CONTENT)
//         .set({
//           status: "Ready",
//           content: FlashcardAiResult
//         }).where(eq(STUDY_TYPE_CONTENT.id, recordId));


//       return 'Inserted successfully'
//     })
//   }
// )


export const GenerateNotes = inngest.createFunction(
  {
    id: 'generate-course',
    retries: 0 // Handle retries manually
  },
  { event: 'notes.generate' },
  async ({ event, step }) => {
    const { course, retryAttempt = 0 } = event.data;

    // Step 1: Identify which chapters need to be processed
    const chaptersToProcess = await step.run('Identify Missing Chapters', async () => {
      const Chapters = course?.courseLayout.list_of_chapters;

      const existingNotes = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, course?.courseId));

      const existingChapterIds = new Set(existingNotes.map(note => note.chapterId));

      const missingChapters = Chapters
        .map((chapter, index) => ({ chapter, index }))
        .filter(({ index }) => !existingChapterIds.has(index));

      console.log(`Attempt ${retryAttempt + 1}: Found ${missingChapters.length} chapters to process`);

      return missingChapters;
    });

    // Step 2: Generate notes for missing chapters with individual retry logic
    const notesResult = await step.run('Generate Missing Chapter Notes', async () => {
      if (chaptersToProcess.length === 0) {
        return { processed: 0, successful: 0, failed: 0, failedChapters: [] };
      }

      // Process chapters with individual error handling
      const results = [];
      for (const { chapter, index } of chaptersToProcess) {
        try {
          const result = await generateChapterWithRetry(chapter, index, course?.courseId);
          results.push({ success: true, chapterId: index });
        } catch (error) {
          console.error(`Failed to generate chapter ${index} after retries:`, error.message);
          results.push({ success: false, chapterId: index, error: error.message });
        }
      }

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      return {
        processed: chaptersToProcess.length,
        successful: successful.length,
        failed: failed.length,
        failedChapters: failed.map(f => f.chapterId)
      };
    });

    // Step 3: Handle completion or retry logic
    const finalResult = await step.run('Handle Completion or Retry', async () => {
      const totalChapters = course?.courseLayout.list_of_chapters.length;

      const allNotes = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, course?.courseId));

      const isComplete = allNotes.length === totalChapters;

      if (isComplete) {
        // All chapters complete - mark as ready
        await db.update(STUDY_MATERIAL_TABLE).set({
          status: 'Ready'
        }).where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

        return { status: 'completed', message: 'All chapters generated successfully' };
      } else if (notesResult.failed > 0 && retryAttempt < 3) {
        // Some chapters failed and we haven't exceeded retry limit
        const delay = Math.pow(2, retryAttempt) * 30000; // 30s, 60s, 120s delays

        console.log(`Scheduling retry ${retryAttempt + 1} in ${delay / 1000} seconds for ${notesResult.failed} failed chapters`);

        // Schedule a retry with exponential backoff
        await inngest.send({
          name: 'notes.generate',
          data: {
            course,
            retryAttempt: retryAttempt + 1
          },
          delay: delay
        });

        return {
          status: 'retry_scheduled',
          message: `Retry ${retryAttempt + 1} scheduled for ${notesResult.failed} failed chapters`,
          nextRetryIn: `${delay / 1000}s`
        };
      } else {
        // Max retries exceeded or no failures but still incomplete
        await db.update(STUDY_MATERIAL_TABLE).set({
          status: 'Failed'
        }).where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

        return {
          status: 'failed',
          message: `Course generation failed after ${retryAttempt + 1} attempts`,
          remainingChapters: totalChapters - allNotes.length
        };
      }
    });

    return {
      attempt: retryAttempt + 1,
      chaptersProcessed: notesResult.processed,
      successful: notesResult.successful,
      failed: notesResult.failed,
      result: finalResult
    };
  }
);

// Helper function to generate a single chapter with retry logic
async function generateChapterWithRetry(chapter, chapterId, courseId, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const PROMPT = `
        You are a JSON content generator AI.

        Only return a single valid JSON object with exactly the following three fields and nothing else:

        - "title": A short chapter title
        - "summary": A concise summary (~100 words)
        - "markdownContent": Detailed study notes formatted in Markdown with good structure (headings, bullet points, etc.). The content should look like a beautifully written chapter.

        Do not wrap your response in any other format (like "candidates", "parts", "text", etc.).

        Do not include any explanations.

        Input chapter:
        ${JSON.stringify(chapter)}
        Return only:
        {
          "title": "...",
          "summary": "...",
          "markdownContent": "..."
        }
        `;

      const result = await generateNotesAIModel.sendMessage(PROMPT);
      const aiText = await result.response.text();
      const aiResp = JSON.parse(aiText);

      await db.insert(CHAPTER_NOTES_TABLE).values({
        chapterId,
        courseId,
        notes: aiResp,
        createdAt: new Date(),
      });

      console.log(`Successfully generated chapter ${chapterId} on attempt ${attempt + 1}`);
      return aiResp;

    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed for chapter ${chapterId}:`, error.message);

      if (attempt === maxRetries) {
        throw error; // Final attempt failed
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}


export const GenerateStudyTypeContent = inngest.createFunction(
  { id: 'Generate Study Type Content' },
  { event: 'studyType.content' },

  async ({ event, step }) => {
    const { studyType, prompt, recordId, courseId } = event.data;

    // Step 1: Generate content using AI
    const AiResult = await step.run('Generating Flashcard/Quiz using AI', async () => {
      const result =
        studyType == 'Flashcard' ?
          await generateStudyTypeContentAIModel.sendMessage(prompt) :
          await generateQuizAIModel.sendMessage(prompt);

      // Properly await the text and parse it
      const aiText = await result.response.text();
      const parsed = JSON.parse(aiText);

      // Return a plain JSON object (remove any custom prototype)
      return JSON.parse(JSON.stringify(parsed));
    });


    // Step 2: Save result to DB
    const DbResult = await step.run('Save result to DB', async () => {
      await db.update(STUDY_TYPE_CONTENT)
        .set({
          status: "Ready",
          content: AiResult, // Assumes content column is type `json`
        })
        .where(eq(STUDY_TYPE_CONTENT.id, recordId));

      return 'Inserted successfully';
    });

    return "Inserted successfully";
  }
);


