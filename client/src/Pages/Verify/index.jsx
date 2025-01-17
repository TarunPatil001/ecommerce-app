import React, { useContext, useState } from 'react'
import OtpBox from '../../components/OtpBox'
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { postData } from '../../utils/api';
import { MyContext } from '../../App';

const Verify = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleOtpChange = (value) => {
        setOtp(value)
    };

    const sendOtp = async () => {
        console.log("Sending OTP to: ", localStorage.getItem("User email")); // Check email value
        toast.promise(
            postData("/api/user/resend-otp", {
                email: localStorage.getItem("User email"),
            }),
            {
                loading: "Resending OTP...",
                success: (res) => {
                    console.log("OTP resend response: ", res); // Log response data
                    if (res?.success) {
                        return res?.message;
                    } else {
                        console.error("Failed to resend OTP:", res?.message); // Log failure
                        throw new Error(res?.message || "Failed to resend OTP.");
                    }
                },
                error: (err) => {
                    console.error("Error resending OTP:", err); // Log error
                    return err.message || "An error occurred while resending OTP.";
                },
            }
        );
    };



    const verifyOTP = async (e) => {
        e.preventDefault();

        // Use toast.promise to handle loading, success, and error states
        toast.promise(
            postData("/api/user/verifyEmail", {
                email: localStorage.getItem("User email"),
                otp: otp,
            }),
            {
                loading: "Verifying OTP... Please wait.",
                success: (res) => {
                    if (res?.error === false) {
                        // Navigate to forgot-password page before returning success message
                        navigate("/login"); // Use navigate for redirection
                        return res?.message;  // Success message shown in toast
                    } else {
                        // Throw an error to be handled by the error section
                        throw new Error(res?.message || "Verification failed. Please try again.");
                    }
                },
                error: (err) => {
                    return err.message || "An unexpected error occurred. Please try again."; // This will display the toast error message
                },
            }
        ).then((res) => {
            // Add any additional actions after the promise resolves (if needed)
            console.log("OTP Verification Completed:", res);
        }).catch((err) => {
            // Add any additional actions for handling errors here
            console.error("OTP Verification Error:", err);
        });
    };




    return (
        <div>
            <section className="section py-10">
                <div className="container">
                    <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
                        <h3 className="text-[18px] text-center font-bold flex flex-col items-center justify-center gap-2"><img src="/securityLogo.png" className="w-[64px] h-full" />Verify OTP</h3>
                        <p className="pt-5 text-[14px] text-[rgba(0,0,0,0.5)]">Please enter six-digit verification code that we&apos;ve send to your email <span className="text-[var(--bg-primary)] font-bold">{localStorage.getItem("User email") || "your-email@example.com"}</span>.</p>
                        <form action="" onSubmit={verifyOTP}>
                            <div className="py-4">
                                <OtpBox length={6} onChange={handleOtpChange} />
                            </div>
                            <div className="flex justify-center w-full">
                                <Button type="submit" className={`${isLoading === true ? "buttonDisabled" : "buttonPrimaryBlack"} w-full !capitalize flex gap-1`} disabled={isLoading}>

                                    {
                                        isLoading ? <CircularProgress color="inherit" /> : "Verify OTP"
                                    }
                                </Button>
                            </div>
                        </form>
                        <p className="text-center pt-2 text-[14px]">Didn&apos;t get the code? <span className="font-semibold underline underline-offset-2 cursor-pointer link" onClick={sendOtp}>Resend code</span></p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Verify
