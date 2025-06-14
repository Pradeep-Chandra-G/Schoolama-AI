import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { courseId, studyType } = await req.json();

    if (studyType == 'ALL') {
        const notes = await db.select().from(CHAPTER_NOTES_TABLE)
            .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));
        const contentList = await db.select().from(STUDY_TYPE_CONTENT)
            .where(eq(STUDY_TYPE_CONTENT?.courseId, courseId));
        // Get all other study type records
        const result = {
            notes: notes,
            flashCard: contentList?.filter(item => item.type == 'Flashcard'),
            quiz: contentList?.filter(item => item.type == 'Quiz'),
            qa: null
        }
        return NextResponse.json(result);
    }
    else if (studyType == 'notes') {
        const notes = await db.select().from(CHAPTER_NOTES_TABLE)
            .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));
        return NextResponse.json(notes);
    }

    // else if (studyType == 'Flashcard') {
    //     const flashcards = await db.select().from(STUDY_TYPE_CONTENT)
    //         .where(and(eq(STUDY_TYPE_CONTENT?.courseId, courseId),
    //             eq(STUDY_TYPE_CONTENT.type, studyType)));
    //     return NextResponse.json(flashcards);
    // }
    else {
        const result = await db.select().from(STUDY_TYPE_CONTENT)
            .where(and(eq(STUDY_TYPE_CONTENT?.courseId, courseId),
                eq(STUDY_TYPE_CONTENT.type, studyType)));
        console.log("In study-type-api: ", result, "courseId: ", courseId, "studyType: ", studyType);
        return NextResponse.json(result);
    }
}




// import { db } from "@/configs/db";
// import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT } from "@/configs/schema";
// import { eq, and } from "drizzle-orm";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     const { courseId, studyType } = await req.json();

//     if (studyType == 'ALL') {
//         const notes = await db.select().from(CHAPTER_NOTES_TABLE)
//             .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));
//         const contentList = await db.select().from(STUDY_TYPE_CONTENT)
//             .where(eq(STUDY_TYPE_CONTENT?.courseId, courseId));

//         // Get all other study type records
//         const result = {
//             notes: notes,
//             flashCard: contentList?.filter(item => item.type == 'Flashcard'),
//             quiz: contentList?.filter(item => item.type == 'Quiz'),
//             qa: null
//         }
//         return NextResponse.json(result);
//     }
//     else if (studyType == 'notes') {
//         const notes = await db.select().from(CHAPTER_NOTES_TABLE)
//             .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));
//         return NextResponse.json(notes);
//     }
//     else {
//         const result = await db.select().from(STUDY_TYPE_CONTENT)
//             .where(and(eq(STUDY_TYPE_CONTENT?.courseId, courseId),
//                 eq(STUDY_TYPE_CONTENT.type, studyType)));

//         // Handle the case where no data is found
//         if (!result || result.length === 0) {
//             return NextResponse.json({ error: 'No data found' }, { status: 404 });
//         }

//         // Clean the data to ensure JSON serializability
//         try {
//             const cleanData = {
//                 id: result[0].id,
//                 courseId: result[0].courseId,
//                 type: result[0].type,
//                 status: result[0].status,
//                 content: result[0].content || null
//             };

//             return NextResponse.json(cleanData);
//         } catch (error) {
//             console.error('JSON serialization error:', error);
//             console.log('Problematic data:', result[0]);

//             // Fallback: return a safe version
//             return NextResponse.json({
//                 id: result[0].id,
//                 courseId: result[0].courseId,
//                 type: result[0].type,
//                 status: result[0].status,
//                 content: null,
//                 error: 'Data serialization failed'
//             });
//         }
//     }
// }

// // import { db } from "@/configs/db";
// // import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT } from "@/configs/schema";
// // import { eq, and } from "drizzle-orm";
// // import { NextResponse } from "next/server";

// // export async function POST(req) {
// //     const { courseId, studyType } = await req.json();

// //     if (studyType == 'ALL') {
// //         const notes = await db.select().from(CHAPTER_NOTES_TABLE)
// //             .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));
// //         const contentList = await db.select().from(STUDY_TYPE_CONTENT)
// //             .where(eq(STUDY_TYPE_CONTENT?.courseId, courseId));

// //         // Get all other study type records
// //         const result = {
// //             notes: notes,
// //             flashCard: contentList?.filter(item => item.type == 'Flashcard'),
// //             quiz: contentList?.filter(item => item.type == 'Quiz'),
// //             qa: null
// //         }
// //         return NextResponse.json(result);
// //     }
// //     else if (studyType == 'notes') {
// //         const notes = await db.select().from(CHAPTER_NOTES_TABLE)
// //             .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));
// //         return NextResponse.json(notes);
// //     }
// //     else {
// //         const result = await db.select().from(STUDY_TYPE_CONTENT)
// //             .where(and(eq(STUDY_TYPE_CONTENT?.courseId, courseId),
// //                 eq(STUDY_TYPE_CONTENT.type, studyType)));

// //         // Handle the case where no data is found
// //         if (!result || result.length === 0) {
// //             return NextResponse.json({ error: 'No data found' }, { status: 404 });
// //         }

// //         // Clean the data to ensure JSON serializability
// //         const cleanData = {
// //             id: result[0].id,
// //             courseId: result[0].courseId,
// //             type: result[0].type,
// //             status: result[0].status,
// //             content: result[0].content ? JSON.parse(JSON.stringify(result[0].content)) : null
// //         };

// //         return NextResponse.json(cleanData);
// //     }
// // }