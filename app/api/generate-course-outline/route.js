import { courseOutlineAIModel } from "@/configs/AiModel";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { inngest } from "@/inngest/client";

function extractJSONFromAIResponse(text) {
  // Try to extract JSON block inside triple backticks (``` or ```json)
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1]);
  }

  // Fallback: Try to find first top-level JSON object (naive but useful)
  const curlyMatch = text.match(/{[\s\S]*}/);
  if (curlyMatch) {
    return JSON.parse(curlyMatch[0]);
  }

  throw new Error("No valid JSON found in AI response.");
}

export async function POST(req) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy } =
      await req.json();

    const MATERIAL_PROMPT = `Generate a study material for ${topic} for ${courseType} and level of difficulty will be ${difficultyLevel} with summary of course, list of chapters along with summary for each chapter, Topic list in each chapter, all results in JSON format. The JSON format should contain:
- course_title
- difficulty_level
- course_summary
- list_of_chapters (array of objects with: chapter_id, chapter_title, chapter_summary, topic_list, emoji)
Do not veer from this format!`;

    // Generate Course Layout using Groq AI
    const aiResponse = await courseOutlineAIModel(MATERIAL_PROMPT);

    // Extract the actual text content from the Groq response
    const aiText = aiResponse.choices[0].message.content;

    let aiResult;
    try {
      aiResult = extractJSONFromAIResponse(aiText);
    } catch (err) {
      console.error("Failed to parse AI response:", aiText);
      return NextResponse.json(
        { error: "Invalid JSON format from AI response" },
        { status: 500 }
      );
    }

    // Save the result in the DB
    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values({
        courseId,
        courseType,
        createdBy,
        topic,
        courseLayout: aiResult,
      })
      .returning({ resp: STUDY_MATERIAL_TABLE });

    // Trigger Inngest for further async processing
    const result = await inngest.send({
      name: "notes.generate",
      data: {
        course: dbResult[0].resp,
      },
    });

    return NextResponse.json({ result: dbResult[0] });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
