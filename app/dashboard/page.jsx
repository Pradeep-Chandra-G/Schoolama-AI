import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList';
import SharedCourses from './_components/SharedCourses';

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <WelcomeBanner />
      <SharedCourses/>
      <CourseList />
    </div>
  )
}