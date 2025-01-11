import { Button, Checkbox } from '@mui/material'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { HiLogin } from "react-icons/hi";
import { PiUserCirclePlusLight } from "react-icons/pi";
import LoadingButton from '@mui/lab/LoadingButton';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaRegEyeSlash } from "react-icons/fa";
import FormControlLabel from '@mui/material/FormControlLabel';
import { FaRegEye } from "react-icons/fa";


const ChangePassword = () => {

    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);

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
            <img src="/pattern.webp" alt="bg_img" className='w-full fixed top-0 left-0 opacity-5' />

            <div className='loginBox card w-[600px] h-auto mx-auto pt-20 relative !z-50 pb-20'>
                <div className='text-center'>
                    <img src="https://isomorphic-furyroad.vercel.app/_next/static/media/logo-short.18ca02a8.svg" alt="" className='m-auto' />
                </div>
                <h1 className='mt-10 text-[44px] font-bold leading-[54px] text-center'>Welcome Back! <br />
                    Set Your New Password for Enhanced Security
                </h1>


                <form action='#' className='w-full px-8 mt-3'>
                    <div className='form-group mb-4 w-full'>
                        <h4 className='mt-5 text-[rgba(0,0,0,0.7)] font-medium text-[16px]'>New Password</h4>
                        <div className="relative w-full">
                            <input type={isPasswordShow === true ? "text" : "password"} placeholder='Enter your new password' required className='mt-2 w-full h-[50px] px-4 text-[16px] font-medium border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:!border-[rgba(0,0,0,0.7)] focus:outline-none' />
                            <Button className='!absolute !top-[15px] !right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-[rgba(0,0,0,0.8)] !text-[18px]' onClick={() => setIsPasswordShow(!isPasswordShow)}>
                                {
                                    isPasswordShow === true ? (<FaRegEye />) : (<FaRegEyeSlash />)
                                }
                            </Button>
                        </div>
                    </div>
                    <div className='form-group mb-4 w-full'>
                        <h4 className='mt-5 text-[rgba(0,0,0,0.7)] font-medium text-[16px]'>Confirm Password</h4>
                        <div className="relative w-full">
                            <input type={isConfirmPasswordShow === true ? "text" : "password"} placeholder='Enter your confirm password' required className='mt-2 w-full h-[50px] px-4 text-[16px] font-medium border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:!border-[rgba(0,0,0,0.7)] focus:outline-none' />
                            <Button className='!absolute !top-[15px] !right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-[rgba(0,0,0,0.8)] !text-[18px]' onClick={() => setIsConfirmPasswordShow(!isConfirmPasswordShow)}>
                                {
                                    isConfirmPasswordShow === true ? (<FaRegEye />) : (<FaRegEyeSlash />)
                                }
                            </Button>
                        </div>
                    </div>
                    
                    <Button className='w-full custom-btn !capitalize !text-[16px]'>Change Password</Button>
                </form>

            </div>

        </section>
    )
}

export default ChangePassword
