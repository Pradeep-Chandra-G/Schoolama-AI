import React from 'react'
import Image from 'next/image'


function CourseIntroCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Course Image - Responsive sizing */}
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <Image
            src={'/course.png'}
            width={300}
            height={300}
            className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 rounded-lg object-cover"
            alt="Course Image"
          />
        </div>

        {/* Course Details - Responsive text and spacing */}
        <div className="flex-1 space-y-3 sm:space-y-4 lg:space-y-6 text-center lg:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 leading-tight">
            {course?.courseLayout.course_title}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
            {course?.courseLayout.course_summary}
          </p>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 lg:p-5">
            <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700">
              Total Chapters: <span className="font-bold text-blue-600">
                {course?.courseLayout.list_of_chapters?.length}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseIntroCard