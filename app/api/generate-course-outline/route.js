import { courseOutlineAIModel } from "@/configs/AiModel";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { inngest } from "@/inngest/client";

export async function POST(req) {
    const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();

    const MATERIAL_PROMPT = 'Generate a study material for ' + topic + ' for ' + courseType + ' and level of difficulty will be ' + difficultyLevel + ' with summary of course, list of chapters along with summary for each chapter, Topic list in each chapter, all results in JSON format, the JSON format should contain course_title, difficulty_level, course_summary, list_of_chapters and within each chapter in list of chapters, there must be chapter_id, chapter_title, chapter_summary, topic_list, emoji for each chapter do no veer from this format!'
    // Generate Course Layout using AI
    const aiResp = await courseOutlineAIModel.sendMessage(MATERIAL_PROMPT);
    const aiResult = JSON.parse(aiResp.response.text());

    // Save the result along with User Input
    const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
        courseId: courseId,
        courseType: courseType,
        createdBy: createdBy,
        topic: topic,
        courseLayout: aiResult
    }).returning({ resp: STUDY_MATERIAL_TABLE });

    // Trigger the Inngest function to generate chapter notes
    const result = await inngest.send({
        name: 'notes.generate',
        data: {
            course: dbResult[0].resp
        }
    });
    console.log(result);

    return NextResponse.json({ result: dbResult[0] });
}