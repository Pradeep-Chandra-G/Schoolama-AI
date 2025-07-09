import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList';

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <WelcomeBanner />
      <CourseList />
    </div>
  )
}