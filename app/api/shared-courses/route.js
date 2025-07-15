// app/api/shared-courses/route.js
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq, desc, inArray, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get specific featured courses by their IDs
    const featuredCourseIds = [
      "8c3f010f-6f5b-40e2-976b-c113ed93e375",
      "056272d9-581a-426a-9ac3-13a2d213bfd4",
    ];

    console.log("Fetching courses with IDs:", featuredCourseIds);

    // Query by courseId instead of id (which is an integer serial)
    const sharedCourses = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(
        or(
          eq(STUDY_MATERIAL_TABLE.courseId, featuredCourseIds[0]),
          eq(STUDY_MATERIAL_TABLE.courseId, featuredCourseIds[1])
        )
      )
      .orderBy(desc(STUDY_MATERIAL_TABLE.id));

    console.log("Found courses:", sharedCourses.length);

    return NextResponse.json({ result: sharedCourses });
  } catch (error) {
    console.error("Error fetching shared courses:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to fetch shared courses",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
