"use client"
import React from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs';

function WelcomeBanner() {

    const { user } = useUser();


    return (
        <div className='p-5 bg-blue-500 w-full text-white rounded-lg flex items-center gap-6'>
            <Image src={'/Atom.svg'} width={100} height={100} alt='Welcome Image' />
            <div>
                <h2 className='font-bold text-3xl'>Hello, {user?.fullName}</h2>
                <p className=''>Welcome Back, It's time to get back and start learning</p>
            </div>
        </div>
    )
}

export default WelcomeBanner