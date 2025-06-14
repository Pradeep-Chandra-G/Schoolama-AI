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


export const GenerateNotes = inngest.createFunction(
  { id: 'generate-course' },
  { event: 'notes.generate' },
  async ({ event, step }) => {
    const { course } = event.data;

    const notesResult = await step.run('Generate Chapter Notes', async () => {
      const Chapters = course?.courseLayout.list_of_chapters;

      await Promise.all(Chapters.map(async (chapter, index) => {
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
          chapterId: index,
          courseId: course?.courseId,
          notes: aiResp,
        });
      }));

      return 'Completed';
    });

    const updateCourseStatusResult = await step.run('Update Course Status to Ready', async () => {
      await db.update(STUDY_MATERIAL_TABLE).set({
        status: 'Ready'
      }).where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
      return 'Success';
    });
  }
);

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


