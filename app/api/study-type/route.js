import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId, studyType } = await req.json();

    if (!courseId || !studyType) {
      return NextResponse.json(
        { error: "Missing courseId or studyType" },
        { status: 400 }
      );
    }

    // Handle ALL
    if (studyType === "ALL") {
      const notes = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

      const contentList = await db
        .select()
        .from(STUDY_TYPE_CONTENT)
        .where(eq(STUDY_TYPE_CONTENT.courseId, courseId));

      const result = {
        notes,
        flashCard: contentList.filter((item) => item.type === "Flashcard"),
        quiz: contentList.filter((item) => item.type === "Quiz"),
        qa: contentList.filter((item) => item.type === "QA") || null,
      };

      return NextResponse.json(result);
    }

    // Handle Notes
    if (studyType === "notes") {
      const notes = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));
      return NextResponse.json(notes);
    }

    // Handle Quiz / Flashcard / QA
    const result = await db
      .select()
      .from(STUDY_TYPE_CONTENT)
      .where(
        and(
          eq(STUDY_TYPE_CONTENT.courseId, courseId),
          eq(STUDY_TYPE_CONTENT.type, studyType)
        )
      );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Study type API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
