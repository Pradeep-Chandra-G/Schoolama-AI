"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SharedCourseCard from './SharedCourseCard';
import { BookOpen, Sparkles } from 'lucide-react';

function SharedCourses() {
    const [sharedCourses, setSharedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSharedCourses();
    }, []);

    const getSharedCourses = async () => {
        try {
            const result = await axios.get('/api/shared-courses');
            setSharedCourses(result.data.result);
        } catch (error) {
            console.error('Error fetching shared courses:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className='mb-8'>
                <div className='flex items-center gap-2 mb-4'>
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <h2 className='font-bold text-xl sm:text-2xl text-gray-900'>
                        Featured Courses
                    </h2>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>

                    {[1, 2].map((item, index) => (
                        <div key={index} className='h-48 sm:h-52 lg:h-56 w-full bg-blue-100 rounded-lg animate-pulse'>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (sharedCourses.length === 0) {
        return null; // Don't show section if no courses available
    }

    return (
        <div className='mb-8'>
            {/* Header */}
            <div className='flex items-center gap-2 mb-4'>
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h2 className='font-bold text-xl sm:text-2xl text-gray-900'>
                    Featured Courses
                </h2>
                <span className='text-sm text-gray-500 ml-2'>
                    Try these sample courses
                </span>
            </div>

            {/* Course Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {sharedCourses.map((course, index) => (
                    <SharedCourseCard course={course} key={index} />
                ))}
            </div>
        </div>
    )
}

export default SharedCourses;