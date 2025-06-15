// "use client"
// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
// import axios from "axios";
// import CourseIntroCard from "./_components/CourseIntroCard";
// import StudyMaterialSection from "./_components/StudyMaterialSection";
// import ChapterList from "./_components/ChapterList"

// function Course() {
//     const { courseId } = useParams();
//     const [course, setCourse] = useState();
//     useEffect(() => {
//         GetCourse();
//     }, [courseId]);
//     const GetCourse = async () => {
//         const result = await axios.get('/api/courses?courseId=' + courseId);
//         console.log(result);
//         setCourse(result.data.result);
//     }
//     return (
//         <div>

//             <div className=''>

//                 {/* Course Intro */}
//                 <CourseIntroCard course={course}/>

//                 {/* Study Materials Options */}
//                 <StudyMaterialSection courseId={courseId} course={course}/>

//                 {/* Chapters List */}
//                 <ChapterList course={course}/>

//             </div>

//         </div>
//     )
// }

// export default Course

"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import axios from "axios";
import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList"

function Course() {
    const { courseId } = useParams();
    const [course, setCourse] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetCourse();
    }, [courseId]);

    const GetCourse = async () => {
        try {
            setLoading(true);
            const result = await axios.get('/api/courses?courseId=' + courseId);
            console.log(result);
            setCourse(result.data.result);
        } catch (error) {
            console.error("Error fetching course:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 sm:space-y-8">
                {/* Loading skeleton for course intro */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
                    <div className="animate-pulse">
                        <div className="h-8 sm:h-10 bg-gray-200 rounded-md mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-20 sm:h-24 bg-gray-200 rounded-md mt-4"></div>
                    </div>
                </div>

                {/* Loading skeleton for study materials */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded-md"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Loading skeleton for chapters */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-gray-200 rounded-md"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Course Intro - Responsive spacing */}
            <div className="w-full">
                <CourseIntroCard course={course} />
            </div>

            {/* Study Materials Options - Responsive spacing */}
            <div className="w-full">
                <StudyMaterialSection courseId={courseId} course={course} />
            </div>

            {/* Chapters List - Responsive spacing */}
            <div className="w-full">
                <ChapterList course={course} />
            </div>
        </div>
    )
}

export default Course