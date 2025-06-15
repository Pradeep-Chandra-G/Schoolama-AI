// "use client"
// import React from 'react'
// import SelectOption from './_components/SelectOption'
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import TopicInput from './_components/TopicInput';
// import { v4 as uuidv4 } from 'uuid'
// import axios from 'axios';
// import { useUser } from '@clerk/nextjs';
// import { Loader } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';



// function Create() {
//     const [step, setStep] = useState(0);
//     const [formData, setFormData] = useState([]);
//     const { user, isLoaded } = useUser();
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();
//     const handleUserInput = (fieldName, fieldValue) => {

//         setFormData(prev => ({
//             ...prev,
//             [fieldName]: fieldValue
//         }))

//         console.log(formData);
//     }


//     const GenerateCourseOutline = async () => {
//         if (!isLoaded) return alert("User not loaded");
//         const courseId = uuidv4();
//         setLoading(true);
//         const result = await axios.post('/api/generate-course-outline', {
//             courseId,
//             ...formData,
//             createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
//         });
//         setLoading(false);
//         router.replace('/dashboard');

//         // Toast Notification
//         toast('Your course content is generating, Please refresh after a few seconds ...')

//         console.log(result.data);
//     };


//     return (
//         <div className='flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20'>
//             <h2 className='font-bold text-3xl text-primary'>Start Building Your Personal Study Material</h2>
//             <p className='text-gray-500 text-lg'>Fill all the details to generate study material for your next project</p>
//             <div className='mt-10'>
//                 {step == 0 ?
//                     <SelectOption selectedCourseType={(value) => handleUserInput('courseType', value)} /> :
//                     <TopicInput setTopic={(value) => handleUserInput('topic', value)}
//                         setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)} />}
//             </div>
//             <div className='flex justify-between w-full mt-32'>
//                 {step != 0 ? <Button variant="outline" onClick={() => setStep(step - 1)}>Previous</Button> : '-'}
//                 {step == 0 ? <Button onClick={() => setStep(step + 1)}>Next</Button> : <Button onClick={GenerateCourseOutline} disabled={loading}> {loading ? <Loader className='animate-spin' /> : 'Generate'}</Button>}
//             </div>
//         </div>
//     )
// }

// export default Create

"use client"
import React from 'react'
import SelectOption from './_components/SelectOption'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TopicInput from './_components/TopicInput';
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function Create() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState([]);
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUserInput = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
        console.log(formData);
    }

    const GenerateCourseOutline = async () => {
        if (!isLoaded) return alert("User not loaded");
        const courseId = uuidv4();
        setLoading(true);
        const result = await axios.post('/api/generate-course-outline', {
            courseId,
            ...formData,
            createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
        });
        setLoading(false);
        router.replace('/dashboard');
        toast('Your course content is generating, Please refresh after a few seconds ...')
        console.log(result.data);
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Main Container - Responsive padding and centering */}
            <div className='flex flex-col items-center px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16'>
                {/* Header Section - Responsive text and spacing */}
                <div className='text-center max-w-4xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6'>
                    <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-primary leading-tight'>
                        Start Building Your Personal Study Material
                    </h1>
                    <p className='text-gray-500 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed px-2'>
                        Fill all the details to generate study material for your next project
                    </p>
                </div>

                {/* Form Content - Responsive container */}
                <div className='w-full max-w-5xl mx-auto mt-8 sm:mt-12 lg:mt-16'>
                    <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 xl:p-10'>
                        {step == 0 ?
                            <SelectOption selectedCourseType={(value) => handleUserInput('courseType', value)} /> :
                            <TopicInput
                                setTopic={(value) => handleUserInput('topic', value)}
                                setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)}
                            />
                        }
                    </div>
                </div>

                {/* Navigation Buttons - Responsive positioning and sizing */}
                <div className='w-full max-w-5xl mx-auto mt-8 sm:mt-12 lg:mt-16'>
                    <div className='flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 px-4 sm:px-0'>
                        {/* Previous Button */}
                        <div className='w-full sm:w-auto order-2 sm:order-1'>
                            {step != 0 ? (
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(step - 1)}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium"
                                >
                                    Previous
                                </Button>
                            ) : (
                                <div className="hidden sm:block"></div>
                            )}
                        </div>

                        {/* Step Indicator - Mobile friendly */}
                        <div className='order-1 sm:order-2'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${step >= 0 ? 'bg-primary' : 'bg-gray-300'
                                    }`}></div>
                                <div className='w-8 sm:w-12 h-1 bg-gray-300 rounded-full'>
                                    <div className={`h-full bg-primary rounded-full transition-all duration-500 ${step >= 1 ? 'w-full' : 'w-0'
                                        }`}></div>
                                </div>
                                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-primary' : 'bg-gray-300'
                                    }`}></div>
                            </div>
                            <p className='text-xs sm:text-sm text-gray-500 text-center mt-2'>
                                Step {step + 1} of 2
                            </p>
                        </div>

                        {/* Next/Generate Button */}
                        <div className='w-full sm:w-auto order-3'>
                            {step == 0 ? (
                                <Button
                                    onClick={() => setStep(step + 1)}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    onClick={GenerateCourseOutline}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className='w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2' />
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate'
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Create