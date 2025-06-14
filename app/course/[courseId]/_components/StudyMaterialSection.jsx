import React, { useState, useEffect } from 'react'
import MaterialCardItem from './MaterialCardItem'
import axios from 'axios'
import Link from 'next/link'


function StudyMaterialSection({courseId, course}) {

    const MaterialList = [
        {
            name: "Notes/Chapters",
            desc:'Read notes to prepare',
            icon:'/notes.png',
            path:'/notes',
            type:'notes'
        },
        {
            name: "Flashcard",
            desc:'Helps to remember the concepts',
            icon:'/flashcard.png',
            path:'/flashcards',
            type:'flashCard'
        },
        {
            name: "Quiz",
            desc:'Great way to test your knowledge',
            icon:'/quiz.png',
            path:'/quiz',
            type:'quiz'
        },
        {
            name: "Question/Answer",
            desc:'Helps to practice your learning',
            icon:'/qa.png',
            path:'/qa',
            type:'qa'
        },
    ]

    const [studyTypeContent, setStudyTypeContent] = useState();

    useEffect(() => {
        GetStudyMaterial();
    },[courseId]);

    const GetStudyMaterial = async () => {
        const result = await axios?.post('/api/study-type', {
            courseId: courseId,
            studyType: 'ALL'
        })
        console.log(result?.data);
        setStudyTypeContent(result.data);
    }

    return (
        <div className='mt-5'>
            <h2 className='font-medium text-xl'>Study Material</h2>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-3'>
                {MaterialList.map((item, index)=> {
                    console.log("item: ",item);
                   return (
                        <Link key={index} href={'/course/'+courseId+item.path}>
                            <MaterialCardItem  item={item} studyTypeContent={studyTypeContent} course={course}/>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}

export default StudyMaterialSection