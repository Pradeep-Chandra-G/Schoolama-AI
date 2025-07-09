"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import CourseCardItem from './CourseCardItem';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CourseCountContext } from '@/app/_context/CourseCountContext';

function CourseList() {
    const { user, isLoaded } = useUser();
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Debug the context
    const contextValue = useContext(CourseCountContext);
    console.log('CourseList - contextValue:', contextValue);

    const { totalCourse, setTotalCourse } = contextValue || {};

    useEffect(() => {
        user && GetCourseList();
    }, [user, isLoaded]);

    const GetCourseList = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/courses', {
                createdBy: user?.primaryEmailAddress?.emailAddress
            });

            console.log('API Response:', result.data.result);
            console.log('Course count:', result.data.result?.length);

            setCourseList(result.data.result);

            // Check if setTotalCourse exists before calling it
            if (setTotalCourse && typeof setTotalCourse === 'function') {
                const courseCount = result.data.result?.length || 0;
                console.log('Calling setTotalCourse with:', courseCount);
                setTotalCourse(courseCount);
            } else {
                console.error('setTotalCourse is not available or not a function');
            }

        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='mt-6 sm:mt-8 lg:mt-10'>
            {/* Header - Responsive layout and typography */}
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6'>
                <h2 className='font-bold text-xl sm:text-2xl text-gray-900'>
                    Your Study Material
                </h2>
                <Button
                    variant='outline'
                    onClick={GetCourseList}
                    className='border-primary text-primary hover:bg-primary hover:text-white transition-colors w-fit sm:w-auto'
                    size="sm"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    <span className="hidden xs:inline">Refresh</span>
                    <span className="xs:hidden">↻</span>
                </Button>
            </div>

            {/* Grid - Responsive columns and spacing */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6'>
                {loading === false ? courseList?.map((course, index) => (
                    <CourseCardItem course={course} key={index} />
                )) :
                    // Loading skeletons - Responsive count
                    Array.from({ length: 6 }, (_, index) => (
                        <div key={index} className='h-48 sm:h-52 lg:h-56 w-full bg-slate-200 rounded-lg animate-pulse'>
                        </div>
                    ))}
            </div>

            {/* Empty state - Show when no courses and not loading */}
            {!loading && courseList?.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4">Start your learning journey by creating your first course!</p>
                </div>
            )}
        </div>
    )
}

export default CourseList