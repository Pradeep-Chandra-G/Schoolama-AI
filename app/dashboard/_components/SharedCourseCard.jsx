import React from "react";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Eye } from "lucide-react";
import Link from "next/link";

function SharedCourseCard({ course }) {
    return (
        <div className="relative border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 sm:p-5 bg-white">
            {/* Sample Course Badge */}
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                Sample Course
            </div>

            {/* Header with image */}
            <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex-shrink-0">
                    <Image
                        src={'/course.png'}
                        alt="Course"
                        width={40}
                        height={40}
                        className="sm:w-[45px] sm:h-[45px] lg:w-[50px] lg:h-[50px] rounded-lg"
                    />
                </div>
            </div>

            {/* Course title */}
            <h2 className="font-semibold text-base sm:text-lg lg:text-xl text-gray-900 mb-2 line-clamp-2 leading-tight">
                {course?.courseLayout?.course_title}
            </h2>

            {/* Course description */}
            <p className="text-xs sm:text-sm line-clamp-2 text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                {course?.courseLayout?.course_summary}
            </p>

            {/* Action Button */}
            <div className="flex justify-end">
                <Link href={`/course/${course?.courseId}`}>
                    <Button
                        size="sm"
                        className="text-sm sm:text-base px-4 sm:px-6 py-2 hover:scale-105 transition-transform duration-200"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Preview Course</span>
                        <span className="sm:hidden">Preview</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default SharedCourseCard;
