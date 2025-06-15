// // import React from 'react'
// // import { UserButton } from '@clerk/nextjs';

// // function DashboardHeader() {
// //   return (
// //     <div className='p-5 shadow-md flex justify-end'>
// //       <UserButton />
// //     </div>
// //   )
// // }

// // export default DashboardHeader

// import React from 'react'
// import { UserButton } from '@clerk/nextjs';
// import Link from 'next/link';
// import { BookOpen, Sparkles } from 'lucide-react';

// function DashboardHeader() {
//   return (
//     <div className='relative bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 shadow-lg'>
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
//       <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-blue-100/30 to-transparent"></div>

//       {/* Content */}
//       <div className='relative px-6 py-4 flex items-center justify-between'>
//         {/* Left Side - Logo/Brand */}
//         <div className='flex items-center space-x-3'>
//           <div className='bg-blue-600 p-2.5 rounded-xl shadow-md'>
//             <BookOpen className='w-6 h-6 text-white' />
//           </div>
//           <div>
//             <Link
//               href="https://www.schoolama.studio"
//               className='text-xl font-bold text-blue-900 hover:text-blue-700 transition-colors duration-200 flex items-center space-x-2 group'
//             >
//               <span>Dashboard</span>
//               <Sparkles className='w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors' />
//             </Link>
//             <p className='text-xs text-blue-600/70 font-medium'>Schoolama Studio</p>
//           </div>
//         </div>

//         {/* Right Side - User Controls */}
//         <div className='flex items-center space-x-4'>
//           {/* Welcome Message */}
//           <div className='hidden sm:block text-right'>
//             <p className='text-sm font-medium text-blue-900'>Welcome back!</p>
//             <p className='text-xs text-blue-600/70'>Ready to create something amazing?</p>
//           </div>

//           {/* User Button with Custom Styling */}
//           <div className='bg-white rounded-full p-1 shadow-md border border-blue-100'>
//             <UserButton
//               appearance={{
//                 elements: {
//                   avatarBox: "w-10 h-10",
//                   userButtonPopoverCard: "shadow-xl border border-blue-100",
//                   userButtonPopoverActions: "text-blue-900"
//                 }
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Subtle Bottom Accent */}
//       <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
//     </div>
//   )
// }

// export default DashboardHeader

import React from 'react'
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { BookOpen, Sparkles } from 'lucide-react';

function DashboardHeader() {
  return (
    <div className='relative bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 shadow-lg'>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
      <div className="absolute right-0 top-0 w-16 sm:w-24 lg:w-32 h-full bg-gradient-to-l from-blue-100/30 to-transparent"></div>

      {/* Content - Responsive padding and layout */}
      <div className='relative px-4 sm:px-5 lg:px-6 py-3 sm:py-4 flex items-center justify-between'>
        {/* Left Side - Logo/Brand - Responsive sizing */}
        <div className='flex items-center space-x-2 sm:space-x-3'>
          <div className='bg-blue-600 p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl shadow-md'>
            <BookOpen className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white' />
          </div>
          <div>
            <Link
              href="https://www.schoolama.studio"
              className='text-base sm:text-lg lg:text-xl font-bold text-blue-900 hover:text-blue-700 transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 group'
            >
              <span>Dashboard</span>
              <Sparkles className='w-3 h-3 sm:w-4 sm:h-4 text-blue-500 group-hover:text-blue-600 transition-colors' />
            </Link>
            <p className='text-xs text-blue-600/70 font-medium hidden sm:block'>
              Schoolama Studio
            </p>
          </div>
        </div>

        {/* Right Side - User Controls - Responsive layout */}
        <div className='flex items-center space-x-2 sm:space-x-3 lg:space-x-4'>
          {/* Welcome Message - Hidden on mobile, visible on larger screens */}
          <div className='hidden md:block text-right'>
            <p className='text-sm font-medium text-blue-900'>Welcome back!</p>
            <p className='text-xs text-blue-600/70'>Ready to create something amazing?</p>
          </div>

          {/* Simplified Welcome for tablet */}
          <div className='hidden sm:block md:hidden text-right'>
            <p className='text-sm font-medium text-blue-900'>Welcome back!</p>
          </div>

          {/* User Button with Responsive Styling */}
          <div className='bg-white rounded-full p-0.5 sm:p-1 shadow-md border border-blue-100'>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10",
                  userButtonPopoverCard: "shadow-xl border border-blue-100",
                  userButtonPopoverActions: "text-blue-900"
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
    </div>
  )
}

export default DashboardHeader