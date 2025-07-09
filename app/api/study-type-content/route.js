import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { chapters, courseId, type } = await req.json();

    if (!chapters || !courseId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create AI prompt based on type
    const PROMPT =
      type === "Flashcard"
        ? `Generate flashcards for the following topics: ${chapters}. Return result in JSON format as an array of objects with fields: front, back. Maximum 15 flashcards.`
        : `Generate a quiz for the following topics: ${chapters}. Return result in JSON format as an array of objects with fields: question, options, answer. Each 'answer' must contain the full and exact correct option. Maximum 15 questions.`;

    // Insert into DB with generating state
    const [inserted] = await db
      .insert(STUDY_TYPE_CONTENT)
      .values({
        courseId,
        type,
        status: "Generating", // Optional: if you want to show status in frontend
      })
      .returning({
        id: STUDY_TYPE_CONTENT.id,
      });

    // Trigger Inngest function for background AI generation
    await inngest.send({
      name: "studyType.content",
      data: {
        studyType: type,
        prompt: PROMPT,
        courseId,
        recordId: inserted.id,
      },
    });

    return NextResponse.json({ id: inserted.id });
  } catch (error) {
    console.error("Error in generate-study-type:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
