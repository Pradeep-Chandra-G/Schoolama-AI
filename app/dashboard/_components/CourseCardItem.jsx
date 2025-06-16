import React from "react";
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw } from "lucide-react";
import Link from "next/link";

function CourseCardItem({ course }) {
    return (
        <div className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 sm:p-5 bg-white">
            {/* Header with image and date - Responsive layout */}
            <div className='flex justify-between items-start mb-3 sm:mb-4'>
                <div className="flex-shrink-0">
                    <Image
                        src={'/course.png'}
                        alt="Course"
                        width={40}
                        height={40}
                        className="sm:w-[45px] sm:h-[45px] lg:w-[50px] lg:h-[50px] rounded-lg"
                    />
                </div>
                <div className="bg-blue-600 text-white px-2 py-1 rounded-full">
                    <h2 className='text-[9px] sm:text-[10px] font-medium'>20 Dec</h2>
                </div>
            </div>

            {/* Course title - Responsive typography */}
            <h2 className="font-semibold text-base sm:text-lg lg:text-xl text-gray-900 mb-2 line-clamp-2 leading-tight">
                {course?.courseLayout?.course_title}
            </h2>

            {/* Course description - Responsive text size */}
            <p className="text-xs sm:text-sm line-clamp-2 text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                {course?.courseLayout?.course_summary}
            </p>

            {/* Progress bar - Consistent across all sizes */}
            <div className="mb-3 sm:mb-4">
                <Progress value={0} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">0% Complete</p>
            </div>

            {/* Action button - Responsive sizing and layout */}
            <div className="flex justify-end">
                {course?.status === 'Generating' ? (
                    <div className="bg-gray-400 text-white px-3 py-2 rounded-full flex items-center gap-2">
                        <RefreshCw className='h-4 w-4 sm:h-5 sm:w-5 animate-spin' />
                        <span className="text-xs sm:text-sm font-medium">
                            <span className="hidden sm:inline">Generating...</span>
                            <span className="sm:hidden">Gen...</span>
                        </span>
                    </div>
                ) : (
                    <Link href={'/course/' + course?.courseId}>
                        <Button
                            size="sm"
                            className="text-sm sm:text-base px-4 sm:px-6 py-2 hover:scale-105 transition-transform duration-200"
                        >
                            <span className="hidden sm:inline">View Course</span>
                            <span className="sm:hidden">View</span>
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default CourseCardItem