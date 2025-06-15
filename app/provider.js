"use client"

import React from 'react'
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

export function Provider({ children }) {

    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {

        if (isLoaded && isSignedIn)
            user && CheckIsNewUser();

    }, [isLoaded, isSignedIn, user])

    const CheckIsNewUser = async () => {
        const resp = await axios.post('/api/create-user', { user: user });
    }
    return (
        <div>
            {children}
        </div>
    )
}

export default Provider