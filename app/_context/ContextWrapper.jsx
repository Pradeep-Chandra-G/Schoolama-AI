"use client"
import { useState } from 'react';
import { CourseCountContext } from '../_context/CourseCountContext';

export default function ContextWrapper({ children }) {
    const [totalCourse, setTotalCourse] = useState(0);

    return (
        <CourseCountContext.Provider value={{ totalCourse, setTotalCourse }}>
            {children}
        </CourseCountContext.Provider>
    );
}