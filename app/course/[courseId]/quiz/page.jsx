"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import StepProgress from '@/app/course/[courseId]/_components/StepProgress'; // ✅ correct
import QuizCardItem from './_components/QuizCardItem';

function Quiz() {
    // ✅ Extract courseId properly from params object
    const params = useParams();
    const courseId = params.courseId; // Get the actual courseId string
    
    const [quizData, setQuizData] = useState();
    const [stepCount, setStepCount] = useState(0);
    const [quiz, setQuiz] = useState([]);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
    const [correctAns, setCorrectAns] = useState();
    
    useEffect(() => {
        if (courseId) { // Only call API when courseId is available
            GetQuiz();
        }
        setCorrectAns(null);
        setIsCorrectAnswer(null);
    }, [courseId, stepCount]) // Add courseId as dependency
    
    const GetQuiz = async () => {
        try {
            console.log('Sending courseId:', courseId); // Debug log
            console.log('courseId type:', typeof courseId); // Debug log
            
            const result = await axios.post('/api/study-type', {
                courseId: courseId, // Now sending the actual string value
                studyType: 'Quiz'
            });
            
            console.log("Quiz API Response:", result.data);
            setQuizData(result.data);
            
            // Fix: Handle array response - get first item and check its content
            if (Array.isArray(result.data) && result.data.length > 0) {
                const quizItem = result.data[0]; // Get the first quiz item
                if (quizItem?.content && Array.isArray(quizItem.content)) {
                    setQuiz(quizItem.content); // Set the content array directly
                    console.log('Quiz content set:', quizItem.content);
                }
            }
            // Alternative: if your API should return a single object, not array
            else if (result.data?.content && Array.isArray(result.data.content)) {
                setQuiz(result.data.content); // Set the content array directly
            }
        } catch (error) {
            console.error('Error fetching quiz:', error);
        }
    }

    const checkAnswer = (userAnswer, currentQuestion) => {
        if(userAnswer == currentQuestion?.answer)   {
            setIsCorrectAnswer(true);
            setCorrectAns(currentQuestion?.answer);
            return;
        }
        setIsCorrectAnswer(false);
        setCorrectAns(currentQuestion?.answer);
    }
    
    return (
        <div>
            <h2 className='font-bold text-2xl text-center mb-4'>Quiz</h2>
            {/* Add loading state */}
            {!courseId ? (
                <div>Loading...</div>
            ) : quiz.length > 0 ? (
                <div>
                    <StepProgress 
                        data={quiz} 
                        setStepCount={setStepCount} 
                        stepCount={stepCount}
                    />
                    <div>
                        <QuizCardItem quiz = {quiz[stepCount]} 
                        userSelectedOption={(v)=>checkAnswer(v, quiz[stepCount])}/>       
                    </div>

                    {isCorrectAnswer == false && <div>
                        <div className='border p-3 border-red-700 bg-red-200 rounded-lg'>
                            <h2 className='font-bold text-lg text-red-600'>Incorrect</h2>
                            <p className='text-red-600'>Correct Answer is : {correctAns}</p>
                        </div>
                    </div>}
                    {isCorrectAnswer == true && <div>
                        <div className='border p-3 border-green-700 bg-green-200 rounded-lg'>
                            <h2 className='font-bold text-lg text-green-600'>Correct</h2>
                            <p className='text-green-600'>Your answer is correct!</p>
                        </div>
                        
                    </div>}
                </div>
                
            ) : (
                <div>Loading quiz...</div>
            )}
        </div>
    )
}

export default Quiz