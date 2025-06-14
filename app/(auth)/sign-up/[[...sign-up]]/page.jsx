import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <SignUp redirectUrl={process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT} />
        </div>
    )
}