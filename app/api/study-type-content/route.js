import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT } from "@/configs/schema";
import { inngest } from '@/inngest/client'
import { NextResponse } from "next/server";


export async function POST(req) {
    const { chapters, courseId, type } = await req.json();

    const PROMPT = type == 'Flashcard' ? 'Generate the flashcard on topic:' + chapters + 'in JSON format with front back content, maximum 15'
        : 'Generate the Quiz on topic:' + chapters + 'with Question and Options along with correct answer in JSON format with fields question, options, answer (answer must contain the entire and exact answer), maximum 15'

    // Insert record to DB, update status to Generating...
    const result = await db.insert(STUDY_TYPE_CONTENT).values({
        courseId: courseId,
        type: type
    }).returning({
        id: STUDY_TYPE_CONTENT.id
    });

    // Trigger inngest function
    inngest.send({
        name: 'studyType.content',
        data: {
            studyType: type,
            prompt: PROMPT,
            courseId: courseId,
            recordId: result[0].id
        }
    });

    return NextResponse.json(result[0].id);

}
