// "use client"
// import React, { useContext, useEffect } from 'react'
// import Image from 'next/image'
// import { Button } from '@/components/ui/button'
// import { LayoutDashboard, Shield, UserCircle } from 'lucide-react'
// import { usePathname } from 'next/navigation'
// import { Progress } from "@/components/ui/progress"
// import Link from 'next/link'
// import { CourseCountContext } from '@/app/_context/CourseCountContext'

// function SideBar() {
//   const MenuList = [
//     {
//       name: "Home",
//       icon: LayoutDashboard,
//       path: '/dashboard'
//     },
//     {
//       name: "Upgrade",
//       icon: Shield,
//       path: "/dashboard/upgrade"
//     },
//     {
//       name: "Profile",
//       icon: UserCircle,
//       path: "/dashboard/profile"
//     }
//   ]
//   const { totalCourse = 0, setTotalCourse = () => { } } = useContext(CourseCountContext) || {};
//   console.log("In sidebar, Course Count Context: ", CourseCountContext);
//   const path = usePathname();
//   // Debug: Watch for changes in totalCourse
//   useEffect(() => {
//     console.log('SideBar - totalCourse updated to:', totalCourse);
//   }, [totalCourse]);
//   return (
//     <div className='h-screen shadow-md p-5'>
//       <div className="flex gap-2 items-center">
//         <Image src={"/school-hat.svg"} alt="logo" width={40} height={40} />
//         <h2 className='font-bold text-2xl'>SchooLama</h2>
//       </div>

//       <div className='mt-10'>
//         <Link href={'/create'} className="w-full ">
//           <Button className="w-full ">+ Create New</Button>
//         </Link>
//         <div className='mt-5'>
//           {MenuList.map((menu, index) => (
//             <Link key={index} href={menu.path} className='block mt-3 rounded-lg'>
//               <div className={`flex gap-5 items-center p-3 hover:bg-slate-200 cursor-pointer ${path === menu.path ? 'bg-slate-200' : ''}`}>
//                 <menu.icon />
//                 <span>{menu.name}</span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       <div className='border p-3 bg-slate-100 rounded-lg absolute bottom-10 w-[85%]'>
//         <h2 className='text-lg mb-2'>Available Credits: {5 - totalCourse}</h2>
//         <Progress value={(totalCourse / 5) * 100} />
//         <h2 className='text-sm'>{totalCourse} Out of 5 Credits Used</h2>
//         <Link href={'/dashboard/upgrade'} className='text-primary text-xs mt-3'>Upgrade to create more</Link>
//       </div>
//     </div>
//   )
// }

// export default SideBar


"use client"
import React, { useContext, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Shield, UserCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'
import { CourseCountContext } from '@/app/_context/CourseCountContext'

function SideBar() {
  const MenuList = [
    {
      name: "Home",
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade"
    },
    {
      name: "Profile",
      icon: UserCircle,
      path: "/dashboard/profile"
    }
  ]

  const { totalCourse = 0, setTotalCourse = () => { } } = useContext(CourseCountContext) || {};
  console.log("In sidebar, Course Count Context: ", CourseCountContext);
  const path = usePathname();

  // Debug: Watch for changes in totalCourse
  useEffect(() => {
    console.log('SideBar - totalCourse updated to:', totalCourse);
  }, [totalCourse]);

  return (
    <div className='h-screen shadow-md p-3 sm:p-4 lg:p-5 flex flex-col'>
      {/* Logo Section - Responsive sizing */}
      <div className="flex gap-2 items-center mb-6 lg:mb-10">
        <Image
          src={"/school-hat.svg"}
          alt="logo"
          width={32}
          height={32}
          className="sm:w-[36px] sm:h-[36px] lg:w-[40px] lg:h-[40px]"
        />
        <h2 className='font-bold text-lg sm:text-xl lg:text-2xl text-gray-800'>
          SchooLama
        </h2>
      </div>

      {/* Navigation Section - Flexible growth */}
      <div className='flex-1'>
        {/* Create Button - Full width responsive */}
        <Link href={'/create'} className="w-full block">
          <Button className="w-full text-sm sm:text-base py-2 sm:py-3">
            + Create New
          </Button>
        </Link>

        {/* Menu Items - Responsive spacing and sizing */}
        <div className='mt-4 lg:mt-5 space-y-1 sm:space-y-2'>
          {MenuList.map((menu, index) => (
            <Link key={index} href={menu.path} className='block rounded-lg'>
              <div className={`flex gap-3 sm:gap-4 lg:gap-5 items-center p-2 sm:p-3 hover:bg-slate-200 cursor-pointer transition-colors duration-200 rounded-lg ${path === menu.path ? 'bg-slate-200' : ''
                }`}>
                <menu.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">{menu.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Credits Section - Fixed at bottom with responsive sizing */}
      <div className='border p-3 sm:p-4 bg-slate-100 rounded-lg mt-4 w-full'>
        <h2 className='text-sm sm:text-base lg:text-lg font-semibold mb-2 text-gray-800'>
          Available Credits: {5 - totalCourse}
        </h2>
        <Progress value={(totalCourse / 5) * 100} className="mb-2" />
        <h2 className='text-xs sm:text-sm text-gray-600 mb-2'>
          {totalCourse} Out of 5 Credits Used
        </h2>
        <Link
          href={'/dashboard/upgrade'}
          className='text-primary text-xs sm:text-sm hover:underline inline-block'
        >
          Upgrade to create more
        </Link>
      </div>
    </div>
  )
}

export default SideBar