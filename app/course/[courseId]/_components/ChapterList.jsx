// import React from 'react'

// function ChapterList({course}) {
//     const CHAPTERS = course?.courseLayout?.list_of_chapters;
//     return (
//         <div className='mt-5'> 
//             <h2 className='font-medium text-xl'>Chapters</h2>

//             <div className='mt-3'>
//                 {CHAPTERS?.map((chapter, index) => {
//                     return (
//                         <div key = {index} className='flex gap-5 items-center p-4 border shadow-md mb-2 rounded-lg cursor-pointer'>
//                             <h2 className='text-2xl'>{chapter?.emoji}</h2>
//                             <div>
//                                 <h2 className='font-medium '>{chapter?.chapter_title}</h2>
//                                 <p className='text-gray-400 text-sm'>{chapter?.chapter_summary}</p>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     )
// }

// export default ChapterList

import React from 'react'

function ChapterList({ course }) {
    const CHAPTERS = course?.courseLayout?.list_of_chapters;
    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
            {/* Section Header - Responsive text */}
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 lg:mb-8 text-center sm:text-left">
                Chapters
            </h2>

            {/* Chapters List - Responsive spacing and layout */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                {CHAPTERS?.map((chapter, index) => {
                    return (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-5 lg:p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-5">
                                {/* Chapter Emoji - Responsive sizing */}
                                <div className="flex-shrink-0 mx-auto sm:mx-0">
                                    <span className="text-3xl sm:text-4xl lg:text-5xl">
                                        {chapter?.emoji}
                                    </span>
                                </div>

                                {/* Chapter Content - Responsive text and spacing */}
                                <div className="flex-1 text-center sm:text-left space-y-2 sm:space-y-3">
                                    <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800 leading-tight">
                                        {chapter?.chapter_title}
                                    </h3>

                                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                                        {chapter?.chapter_summary}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ChapterList