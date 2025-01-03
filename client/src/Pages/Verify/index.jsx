import React, { useState } from 'react'
import OtpBox from '../../components/OtpBox'
import { Button } from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Verify = () => {
    const [otp, setOtp] = useState("");
    const history = useNavigate();
    const handleOtpChange = (value) => {
        setOtp(value)
    };

    const sendOtp = () => {
        toast.success("Resend verification code!");
    }

    const verifyOTP = (e) => {
        e.preventDefault();
        alert(otp);
        history("/forgot-password");
        toast.success("Code verified!");
    }

    return (
        <div>
            <section className="section py-10">
                <div className="container">
                    <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
                        <h3 className="text-[18px] text-center font-bold flex flex-col items-center justify-center gap-2"><img src="/securityLogo.png" className="w-[64px] h-full" />Verify OTP</h3>
                        <p className="pt-5 text-[14px] text-[rgba(0,0,0,0.5)]">Please enter six-digit verification code that we&apos;ve send to your email (<Link to="https://mail.google.com/" target="_blank"><span className="text-[var(--bg-primary)] font-bold">elonmusk123@gmail.com</span></Link>).</p>
                        <form action="" onSubmit={verifyOTP}>
                            <div className="py-4">
                                <OtpBox length={6} onChange={handleOtpChange} />
                            </div>
                            <div className="flex justify-center w-full">
                                <Button type="submit" className="buttonPrimaryBlack w-full !capitalize flex gap-1">Verify<span className="!uppercase">OTP</span></Button>
                            </div>
                        </form>
                        <p className="text-center pt-2 text-[14px]">Didn&apos;t get the code? <Link to=""><span className="font-semibold underline underline-offset-2 cursor-pointer link" onClick={sendOtp}>Resend code</span></Link></p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Verify
