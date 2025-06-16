import React, { useState, useEffect } from 'react'
import MaterialCardItem from './MaterialCardItem'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

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
            name: "AI Chat",
            desc: 'Get instant help and answers',
            icon: '/qa.png', // You can change this to your preferred chat icon
            path: '/chat',
            type: 'chat',
            isSpecial: true // Flag to identify this as the special chat card
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

    // Special Chat Card Component
    // const ChatCard = ({ item }) => {
    //     return (
    //         <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
    //             {/* Icon */}
    //             <div className="flex justify-center mb-3 sm:mb-4">
    //                 <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
    //                     <img
    //                         src={item.icon}
    //                         alt={item.name}
    //                         className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 filter brightness-0 invert"
    //                     />
    //                 </div>
    //             </div>

    //             {/* Title */}
    //             <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 text-center mb-2 sm:mb-3">
    //                 {item.name}
    //             </h3>

    //             {/* Description */}
    //             <p className="text-xs sm:text-sm lg:text-base text-gray-600 text-center mb-3 sm:mb-4 lg:mb-5 leading-relaxed">
    //                 {item.desc}
    //             </p>

    //             {/* Status Badge */}
    //             <div className="flex justify-center mb-3 sm:mb-4">
    //                 <span className="bg-green-100 text-green-700 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full border border-green-200">
    //                     ✓ Ready
    //                 </span>
    //             </div>

    //             {/* Access Button */}
    //             <div className="flex justify-center">
    //                 <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium text-xs sm:text-sm lg:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95">
    //                     Access Chat
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // };
    const ChatCard = ({ item }) => {
        return (
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                {/* Status Badge - Responsive positioning */}
                <div className="relative p-4 sm:p-5 lg:p-6">
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
                            Ready
                        </span>
                    </div>

                    {/* Icon - Responsive sizing */}
                    <div className="flex justify-center mb-3 sm:mb-4">
                        <Image
                            src={item.icon}
                            width={60}
                            height={60}
                            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
                            alt={item.name}
                        />
                    </div>

                    {/* Content - Responsive text and spacing */}
                    <div className="text-center space-y-2 sm:space-y-3">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
                            {item.name}
                        </h3>

                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed px-2">
                            {item.desc}
                        </p>
                    </div>

                    {/* Action Button - Responsive sizing */}
                    <div className="mt-4 sm:mt-5 lg:mt-6">
                        <Button className="w-full text-sm sm:text-base py-2 sm:py-2.5 lg:py-3 font-medium">
                            Start Chat
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

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

                    // Special handling for chat card
                    if (item.isSpecial && item.type === 'chat') {
                        return (
                            <Link key={index} href={'/course/' + courseId + item.path}>
                                <ChatCard item={item} />
                            </Link>
                        );
                    }

                    // Regular material cards
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
