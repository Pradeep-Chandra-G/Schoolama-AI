// import React, { useState, useEffect } from 'react'
// import MaterialCardItem from './MaterialCardItem'
// import axios from 'axios'
// import Link from 'next/link'


// function StudyMaterialSection({courseId, course}) {

//     const MaterialList = [
//         {
//             name: "Notes/Chapters",
//             desc:'Read notes to prepare',
//             icon:'/notes.png',
//             path:'/notes',
//             type:'notes'
//         },
//         {
//             name: "Flashcard",
//             desc:'Helps to remember the concepts',
//             icon:'/flashcard.png',
//             path:'/flashcards',
//             type:'flashCard'
//         },
//         {
//             name: "Quiz",
//             desc:'Great way to test your knowledge',
//             icon:'/quiz.png',
//             path:'/quiz',
//             type:'quiz'
//         },
//         {
//             name: "Question/Answer",
//             desc:'Helps to practice your learning',
//             icon:'/qa.png',
//             path:'/qa',
//             type:'qa'
//         },
//     ]

//     const [studyTypeContent, setStudyTypeContent] = useState();

//     useEffect(() => {
//         GetStudyMaterial();
//     },[courseId]);

//     const GetStudyMaterial = async () => {
//         const result = await axios?.post('/api/study-type', {
//             courseId: courseId,
//             studyType: 'ALL'
//         })
//         console.log(result?.data);
//         setStudyTypeContent(result.data);
//     }

//     return (
//         <div className='mt-5'>
//             <h2 className='font-medium text-xl'>Study Material</h2>

//             <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-3'>
//                 {MaterialList.map((item, index)=> {
//                     console.log("item: ",item);
//                    return (
//                         <Link key={index} href={'/course/'+courseId+item.path}>
//                             <MaterialCardItem  item={item} studyTypeContent={studyTypeContent} course={course}/>
//                         </Link>
//                     );
//                 })}
//             </div>
//         </div>
//     )
// }

// export default StudyMaterialSection

import React, { useState, useEffect } from 'react'
import MaterialCardItem from './MaterialCardItem'
import axios from 'axios'
import Link from 'next/link'

function StudyMaterialSection({ courseId, course }) {

    const MaterialList = [
        {
            name: "Notes/Chapters",
            desc: 'Read notes to prepare and revise',
            icon: '/notes.png',
            path: '/notes',
            type: 'notes'
        },
        {
            name: "Flashcard",
            desc: 'Helps to remember the concepts',
            icon: '/flashcard.png',
            path: '/flashcards',
            type: 'flashCard'
        },
        {
            name: "Quiz",
            desc: 'Great way to test your knowledge',
            icon: '/quiz.png',
            path: '/quiz',
            type: 'quiz'
        },
        {
            name: "Question/Answer",
            desc: 'Helps to practice your learning',
            icon: '/qa.png',
            path: '/qa',
            type: 'qa'
        },
    ]

    const [studyTypeContent, setStudyTypeContent] = useState();

    useEffect(() => {
        GetStudyMaterial();
    }, [courseId]);

    const GetStudyMaterial = async () => {
        const result = await axios?.post('/api/study-type', {
            courseId: courseId,
            studyType: 'ALL'
        })
        console.log(result?.data);
        setStudyTypeContent(result.data);
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
            {/* Section Header - Responsive text */}
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 lg:mb-8 text-center sm:text-left">
                Study Material
            </h2>

            {/* Material Cards Grid - Responsive grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {MaterialList.map((item, index) => {
                    console.log("item: ", item);
                    return (
                        <Link key={index} href={'/course/' + courseId + item.path}>
                            <MaterialCardItem
                                item={item}
                                studyTypeContent={studyTypeContent}
                                course={course}
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}

export default StudyMaterialSection
