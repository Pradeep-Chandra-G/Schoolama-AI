// import React from 'react'
// import Image from 'next/image';
// import { useState } from 'react';

// function SelectOption({ selectedCourseType }) {
//     const Options = [
//         {
//             name: 'Exam',
//             icon: '/exam-time.png'
//         },
//         {
//             name: 'Job Interview',
//             icon: '/job-interview.png'
//         },
//         {
//             name: 'Practice',
//             icon: '/practice.png'
//         },
//         {
//             name: 'Coding Prep',
//             icon: '/coding.png'
//         },
//         {
//             name: 'Other',
//             icon: '/knowledge.png'
//         }
//     ]
//     const [selectedOption, setSelectedOption] = useState();

//     return (
//         <div className=''>
//             <h2 className='text-center mb-2 text-lg'>Study Material for?</h2>
//             <div className='grid grid-cols-2 mt-5 md:grid-cols-3 lg:grid-cols-5 gap-5'>
//                 {Options.map((option, index) => {
//                     return (
//                         <div key={index} className={`p-4 flex flex-col items-center justify-center border rounded-xl hover:border-primary cursor-pointer ${option?.name == selectedOption && 'border-primary'}`}
//                             onClick={() => { setSelectedOption(option.name); selectedCourseType(option.name) }}
//                         >
//                             <Image src={option.icon} alt={option.name} width={50} height={50} />
//                             <h2 className='text-sm '>{option.name}</h2>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     )
// }

// export default SelectOption

import React from 'react'
import Image from 'next/image';
import { useState } from 'react';

function SelectOption({ selectedCourseType }) {
    const Options = [
        {
            name: 'Exam',
            icon: '/exam-time.png'
        },
        {
            name: 'Job Interview',
            icon: '/job-interview.png'
        },
        {
            name: 'Practice',
            icon: '/practice.png'
        },
        {
            name: 'Coding Prep',
            icon: '/coding.png'
        },
        {
            name: 'Other',
            icon: '/knowledge.png'
        }
    ]
    const [selectedOption, setSelectedOption] = useState();

    return (
        <div className='w-full space-y-6 sm:space-y-8'>
            {/* Header */}
            <div className='text-center'>
                <h2 className='text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 mb-2'>
                    What type of study material do you need?
                </h2>
                <p className='text-sm sm:text-base text-gray-500'>
                    Choose the category that best fits your learning goals
                </p>
            </div>

            {/* Options Grid - Responsive grid layout */}
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 xl:gap-6'>
                {Options.map((option, index) => {
                    const isSelected = option?.name === selectedOption;
                    return (
                        <div
                            key={index}
                            className={`group relative p-4 sm:p-5 lg:p-6 flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 ${isSelected
                                    ? 'border-primary bg-primary/5 shadow-md scale-105'
                                    : 'border-gray-200 hover:border-primary/50 bg-white'
                                }`}
                            onClick={() => {
                                setSelectedOption(option.name);
                                selectedCourseType(option.name)
                            }}
                        >
                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}

                            {/* Icon */}
                            <div className="mb-3 sm:mb-4">
                                <Image
                                    src={option.icon}
                                    alt={option.name}
                                    width={60}
                                    height={60}
                                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>

                            {/* Label */}
                            <h3 className={`text-xs sm:text-sm lg:text-base font-medium text-center leading-tight transition-colors duration-300 ${isSelected ? 'text-primary' : 'text-gray-700 group-hover:text-primary'
                                }`}>
                                {option.name}
                            </h3>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default SelectOption