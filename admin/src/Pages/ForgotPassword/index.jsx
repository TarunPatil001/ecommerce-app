import { Button } from '@mui/material'
import { Link, NavLink } from 'react-router-dom'
import { HiLogin } from "react-icons/hi";
import { PiUserCirclePlusLight } from "react-icons/pi";


const ForgotPassword = () => {

    return (

        <section className='bg-white w-full h-[100vh]'>
            <header className='w-full py-2 px-10 fixed top-5 left-0 flex items-center justify-between !z-50'>
                <Link to="/">
                    <img src="https://isomorphic-furyroad.vercel.app/_next/static/media/logo.a795e14a.svg" alt="" className='w-[200px]' />
                </Link>
                <div className='flex items-center gap-2'>
                    <NavLink to="/sign-in" exact={true} activeClassName="isActive">
                        <Button className='!rounded-full !text-[rgba(0,0,0,0.8)] flex items-center gap-1 !capitalize !px-4 !py-1'><HiLogin className='rotate-180 text-[16px]' />Login</Button>
                    </NavLink>
                    <NavLink to="/sign-up" exact={true} activeClassName="isActive">
                        <Button className='!rounded-full !text-[rgba(0,0,0,0.8)] flex items-center gap-1 !capitalize !px-4 !py-1 '><PiUserCirclePlusLight className='text-[16px]' />Sign Up</Button>
                    </NavLink>
                </div>
            </header>
            <img src="/pattern.webp" alt="bg_img" className='w-full fixed top-0 left-0 opacity-5 z-0' />

            <div className='loginBox card w-[600px] h-auto mx-auto pt-20 relative !z-50 pb-20'>
                <div className='text-center'>
                    <img src="https://isomorphic-furyroad.vercel.app/_next/static/media/logo-short.18ca02a8.svg" alt="" className='m-auto' />
                </div>
                <h1 className='mt-10 text-[44px] font-bold leading-[54px] text-center'>Having trouble to sign in?
                    <br />
                    Reset your password.
                </h1>

                <form action='#' className='w-full px-8 mt-3'>
                    <div className='form-group mb-4 w-full'>
                        <h4 className='mt-5 text-[rgba(0,0,0,0.7)] font-medium text-[16px]'>Email</h4>
                        <input type="email" placeholder='Enter your email' required className='mt-2 w-full h-[50px] px-4 text-[16px] font-medium border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:!border-[rgba(0,0,0,0.7)] focus:outline-none' />
                    </div>
                    <Button className='w-full custom-btn !capitalize !text-[16px]'>Reset Password</Button>
                    <Link to="/sign-in"><p className='flex items-center justify-center gap-2 text-[rgba(0,0,0,0.6)] text-[16px] mt-5'>Don’t want to reset?<span className='text-black font-semibold'>Sign In</span></p></Link>
                </form>

            </div>

        </section>
    )
}

export default ForgotPassword
