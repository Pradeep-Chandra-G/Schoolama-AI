// import React from 'react'
// import DashboardHeader from '../dashboard/_components/DashboardHeader'
// import SideBar from '../dashboard/_components/SideBar'

// function CourseViewLayout({ children }) {
//     return (
//         <div>

//             <div className='md:w-64 hidden md:block fixed'>
//                 <SideBar />
//             </div>
//             <div className='md:ml-64 '>
//                 <DashboardHeader />
//                 <div className='p-10'>
//                     {children}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CourseViewLayout

import React from 'react'
import DashboardHeader from '../dashboard/_components/DashboardHeader'
import SideBar from '../dashboard/_components/SideBar'

function CourseViewLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar - Hidden on mobile, fixed on tablet/desktop */}
            <div className='w-64 hidden md:block fixed top-0 left-0 h-full z-10'>
                <SideBar />
            </div>

            {/* Main content area */}
            <div className='md:ml-64'>
                {/* Header - Full width, responsive */}
                <DashboardHeader />

                {/* Content area with responsive padding */}
                <div className='p-4 sm:p-6 lg:p-8 xl:p-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default CourseViewLayout