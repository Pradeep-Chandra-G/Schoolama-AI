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
