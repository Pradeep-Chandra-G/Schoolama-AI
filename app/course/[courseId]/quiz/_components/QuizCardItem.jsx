import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

function QuizCardItem({ quiz, userSelectedOption }) {


    const [selectedOption, setSelectedOption] = useState();
    return (
        <div className='mt-10 p-5'>
            <h2 className='font-medium text-3xl text-center'>{quiz?.question}</h2>
            <div className='grid grid-cols-2 gap-5 mt-6'>
                {quiz?.options.map((option, index) => {
                    return (
                        <h2
                            onClick={() => {
                                setSelectedOption(option);
                                userSelectedOption(option)
                            }}
                            key={index}
                            variant='outline'
                            className={`w-full border rounded-full p-2 
                        text-center text-lg   cursor-pointer
                        ${selectedOption == option ? 'bg-blue-600 text-white hover:bg-blue-600' : 'hover:bg-gray-200'}`}>
                            {option}
                        </h2>
                    )
                })}

            </div>
        </div >
    )
}

export default QuizCardItem