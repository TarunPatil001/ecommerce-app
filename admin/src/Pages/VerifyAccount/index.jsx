import { Button, Checkbox } from '@mui/material'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { HiLogin } from "react-icons/hi";
import { PiUserCirclePlusLight } from "react-icons/pi";
import LoadingButton from '@mui/lab/LoadingButton';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaRegEyeSlash } from "react-icons/fa";
import FormControlLabel from '@mui/material/FormControlLabel';
import { FaRegEye } from "react-icons/fa";
import OtpBox from '../../Components/OtpBox';


const VerifyAccount = () => {

    const email = "rajpatel59958@gmail.com"; // Replace this with the email you'd like to mask
    const [name, domain] = email.split("@"); // Split email into name and domain
    const maskedName =
        name.length > 3
            ? name.slice(0, 2) + "*****" + name.slice(-2) // Mask part of the name
            : name; // If name is short, show it as is
    const maskedEmail = `${maskedName}@${domain}`; // Combine masked name with domain

    const [otp, setOtp] = useState("");
    const history = useNavigate();
    const handleOtpChange = (value) => {
        setOtp(value)
    };

    const sendOtp = () => {
        // toast.success("Resend verification code!");
    }

    const verifyOTP = (e) => {
        e.preventDefault();
        alert(otp);
        history("/forgot-password");
        // toast.success("Code verified!");
    }

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
                    <img src="http://localhost:5173/securityLogo.png" alt="" className='m-auto' />
                </div>
                <h1 className='mt-10 text-[44px] font-bold leading-[54px] text-center'>OTP Verification <br />
                    Please verify your email
                </h1>
                <br />
                <p className='text-center'>OTP has been sent to <span className='font-semibold text-[var(--text-active)]'>{maskedEmail}</span></p>
                <br />
                <form action="" onSubmit={verifyOTP}>
                    <div className="py-4">
                        <OtpBox length={6} onChange={handleOtpChange} />
                    </div>
                    <div className="flex justify-center w-[300px] m-auto mt-4">
                        <Button type="submit" className="custom-btn w-full !capitalize flex gap-1">Verify<span className="!uppercase">OTP</span></Button>
                    </div>
                </form>
                <br />
                <p className="text-center pt-2 text-[14px]">Didn&apos;t get the code? <Link to=""><span className="font-semibold underline underline-offset-2 cursor-pointer link" onClick={sendOtp}>Resend code</span></Link></p>


            </div>

        </section>
    )
}

export default VerifyAccount
