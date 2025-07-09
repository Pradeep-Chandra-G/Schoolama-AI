"use client"
import React from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs';

function WelcomeBanner() {
    const { user } = useUser();

    return (
        <div className='p-4 sm:p-5 lg:p-6 bg-blue-500 w-full text-white rounded-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-6'>
            {/* Image - Responsive sizing */}
            <div className="flex-shrink-0">
                <Image
                    src={'/Atom.svg'}
                    width={80}
                    height={80}
                    className="sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px]"
                    alt='Welcome Image'
                />
            </div>

            {/* Text Content - Responsive typography and alignment */}
            <div className="text-center sm:text-left">
                <h2 className='font-bold text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2'>
                    Hello, {user?.fullName}
                </h2>
                <p className='text-sm sm:text-base lg:text-lg text-blue-100 leading-relaxed'>
                    Welcome Back, It's time to get back and start learning
                </p>
            </div>
        </div>
    )
}

export default WelcomeBanner