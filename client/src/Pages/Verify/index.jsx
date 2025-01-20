import React, { useContext, useEffect, useState } from 'react';
import OtpBox from '../../components/OtpBox';
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
    const [timer, setTimer] = useState(0); // Initial timer state
    const [isOtpResent, setIsOtpResent] = useState(false); // Track if OTP has been resent
    
    const handleOtpChange = (value) => {
        setOtp(value);
    };
    
    const actionType = localStorage.getItem("actionType");

    useEffect(() => {
        // Get the OTP expiration time from localStorage
        const otpExpiresTime = localStorage.getItem("OTP_EXPIRES");

        if (otpExpiresTime) {
            const currentTime = Date.now();
            const remainingTime = Math.max(0, Math.floor((otpExpiresTime - currentTime) / 1000)); // Calculate the remaining time in seconds
            setTimer(remainingTime);
        }

        // Handle timer countdown
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    const newTimer = prevTimer - 1;
                    if (newTimer <= 0) {
                        // If the timer reaches 0, remove OTP expiration from localStorage
                        localStorage.removeItem("OTP_EXPIRES");
                    }
                    return Math.max(newTimer, 0); // Ensure timer doesn't go below 0
                });
            }, 1000);
        }

        // Cleanup on component unmount
        return () => clearInterval(interval);
    }, [timer]); // Re-run effect whenever timer changes

    

    const sendOtp = async (e) => {
        e.preventDefault();
        
        console.log("Resending OTP to: ", localStorage.getItem("User email"));

        if (actionType !== "forgot-password") {
            toast.promise(
                postData("/api/user/resend-otp", {
                    email: localStorage.getItem("User email"),
                }),
                {
                    loading: "Resending OTP...",
                    success: (res) => {
                        console.log("OTP resend response: ", res); // Log response data
                        if (res?.success) {
                            // Set new expiration time (e.g., 5 minutes from now)
                            const newExpirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
                            localStorage.setItem("OTP_EXPIRES", newExpirationTime);

                            // Reset timer
                            setTimer(300); // 5 minutes in seconds

                            setIsOtpResent(true); // Update OTP resend state
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

        } else {
            toast.promise(
                postData("/api/user/forgot-password", {
                    email: localStorage.getItem("User email"),
                }),
                {
                    loading: "Resending OTP...",
                    success: (res) => {
                        console.log("OTP resend response: ", res); // Log response data
                        if (res?.success) {
                            // Set new expiration time (e.g., 5 minutes from now)
                            const newExpirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
                            localStorage.setItem("OTP_EXPIRES", newExpirationTime);

                            // Reset timer
                            setTimer(300); // 5 minutes in seconds

                            setIsOtpResent(true); // Update OTP resend state
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
        }

    };


    const verifyOTP = async (e) => {
        e.preventDefault();

        if (actionType !== "forgot-password") {
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
                            // Navigate to login if verification is successful
                            localStorage.removeItem("User email");
                            localStorage.removeItem("OTP_EXPIRES");
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
        } else {
            // Use toast.promise to handle loading, success, and error states
        toast.promise(
            postData("/api/user/verify-forgot-password-otp", {
                email: localStorage.getItem("User email"),
                otp: otp,
            }),
            {
                loading: "Verifying OTP... Please wait.",
                success: (res) => {
                    if (res?.error === false) {
                        // Navigate to login if verification is successful
                        localStorage.removeItem("OTP_EXPIRES");
                        navigate("/forgot-password"); // Use navigate for redirection
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
            console.log("res?.user?.email = ", res?.user?.email)
        }).catch((err) => {
            // Add any additional actions for handling errors here
            console.error("OTP Verification Error:", err);
        });
        }
    };


    return (
        <div>
            <section className="section py-10">
                <div className="container">
                    <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
                        <h3 className="text-[18px] text-center font-bold flex flex-col items-center justify-center gap-2">
                            <img src="/securityLogo.png" className="w-[64px] h-full" />
                            Verify OTP
                        </h3>
                        <p className="pt-5 text-[14px] text-[rgba(0,0,0,0.5)]">
                            Please enter the six-digit verification code that we&apos;ve sent to your email&nbsp;
                            <span className="text-[var(--bg-primary)] font-bold">
                                {localStorage.getItem("User email") || "your-email@example.com"}
                            </span>.
                        </p>
                        <form action="" onSubmit={verifyOTP}>
                            <div className="py-4">
                                <OtpBox length={6} onChange={handleOtpChange} />
                            </div>
                            <div className="flex justify-center w-full">
                                <Button type="submit" className={`${isLoading === true ? "buttonDisabled" : "buttonPrimaryBlack"} w-full !capitalize flex gap-1`} disabled={isLoading}>
                                    {isLoading ? <CircularProgress color="inherit" /> : "Verify OTP"}
                                </Button>
                            </div>
                        </form>
                        <p className="text-center pt-2 text-[14px] inline-block">
                            Didn&apos;t get the code?{" "}
                            <span
                                className={`font-semibold cursor-pointer ${timer > 0 ? 'text-gray-500' : ''}`}
                                onClick={sendOtp}
                                disabled={timer > 0} // Disable resend button if OTP is being resent
                            >
                                <span>
                                    {timer > 0
                                        ? <>
                                            <span className="link underline underline-offset-4 transition-all">Resend code</span> in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                                        </>
                                        : <span className="link underline underline-offset-4 transition-all">Resend code</span>
                                    }
                                </span>
                            </span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Verify;
