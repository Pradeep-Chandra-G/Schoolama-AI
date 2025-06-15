// "use client"
// import React, { useState } from 'react'
// import SideBar from './_components/SideBar';
// import DashboardHeader from './_components/DashboardHeader';
// import { CourseCountContext } from '../_context/CourseCountContext';

// export default function DashboardLayout({ children }) {
//   const [totalCourse, setTotalCourse] = useState(0);
//   return (
//     <CourseCountContext.Provider value={{ totalCourse, setTotalCourse }}>
//       <div>
//         <div className='md:w-64 hidden md:block fixed'>
//           <SideBar />
//         </div>
//         <div className='md:ml-64 '>
//           <DashboardHeader />
//           <div className='p-10'>
//             {children}
//           </div>
//         </div>
//       </div>
//     </CourseCountContext.Provider>

//   )
// }

"use client"
import React from 'react'
import SideBar from './_components/SideBar';
import DashboardHeader from './_components/DashboardHeader';

export default function DashboardLayout({ children }) {
  // Remove all CourseCountContext.Provider code from here
  return (
    <div>
      <div className='md:w-64 hidden md:block fixed'>
        <SideBar />
      </div>
      <div className='md:ml-64 '>
        <DashboardHeader />
        <div className='p-10'>
          {children}
        </div>
      </div>
    </div>
  )
}

