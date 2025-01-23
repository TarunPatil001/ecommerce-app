import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress } from '@mui/material'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { HiLogin } from "react-icons/hi";
import { PiUserCirclePlusLight } from "react-icons/pi";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { MyContext } from '../../App';
import toast from 'react-hot-toast';
import { postData } from '../../utils/api';


const ChangePassword = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();

    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const [formFields, setFormFields] = useState({
        email: localStorage.getItem('admin-email'),
        newPassword: '',
        confirmPassword: '',
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formFields.newPassword) {
            context.openAlertBox('error', 'Please enter the New Password');
            newPasswordRef.current.focus();
            return;
        }

        if (!formFields.confirmPassword) {
            context.openAlertBox('error', 'Please enter the Confirm Password');
            confirmPasswordRef.current.focus();
            return;
        }

        if (formFields.newPassword !== formFields.confirmPassword) {
            context.openAlertBox('error', 'Passwords do not match');
            confirmPasswordRef.current.focus();
            return;
        }

        setIsLoading(true);

        try {
            const result = await toast.promise(
                postData('/api/user/reset-password', formFields),
                {
                    loading: 'Resetting Password...',
                    success: 'Password reset successfully!',
                    error: 'Failed to reset password. Please try again.',
                }
            );

            if (result.error === false) {
                setFormFields({ newPassword: '', confirmPassword: '' });
                localStorage.clear();
                navigate('/sign-in');
            } else {
                throw new Error(result.message || 'Unexpected error occurred');
            }
        } catch (error) {
            context.openAlertBox('error', error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-white w-full h-[100vh]">
            <header className="w-full py-2 px-10 fixed top-5 left-0 flex items-center justify-between">
                <Link to="/">
                    <img
                        src="https://isomorphic-furyroad.vercel.app/_next/static/media/logo.a795e14a.svg"
                        alt="Logo"
                        className="w-[200px]"
                    />
                </Link>
                <div className="flex items-center gap-2">
                    <NavLink to="/sign-in">
                        <Button className="!rounded-full flex items-center gap-1 !px-4 !py-1">
                            <HiLogin className="rotate-180 text-[16px]" />
                            Login
                        </Button>
                    </NavLink>
                    <NavLink to="/sign-up">
                        <Button className="!rounded-full flex items-center gap-1 !px-4 !py-1">
                            <PiUserCirclePlusLight className="text-[16px]" />
                            Sign Up
                        </Button>
                    </NavLink>
                </div>
            </header>

            <div className="loginBox card w-[600px] mx-auto pt-20 pb-20">
                <h1 className="mt-10 text-[44px] font-bold text-center">
                    Welcome Back! <br />
                    Set Your New Password for Enhanced Security
                </h1>

                <form className="w-full px-8 mt-3" onSubmit={handleSubmit}>
                    {/* New Password Field */}
                    <div className="form-group mb-4">
                        <h4 className="mt-5 text-[rgba(0,0,0,0.7)] font-medium text-[16px]">New Password</h4>
                        <div className="relative w-full">
                            <input
                                type={isPasswordShow ? 'text' : 'password'}
                                name="newPassword"
                                placeholder="Enter your new password"
                                className="mt-2 w-full h-[50px] px-4 text-[16px] border-2 rounded-md focus:outline-none"
                                value={formFields.newPassword}
                                ref={newPasswordRef}
                                onChange={onChangeInput}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                // className="!absolute top-[15px] right-[10px] z-50"
                                className="!absolute top-[15px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]"
                                onClick={() => setIsPasswordShow(!isPasswordShow)}
                                disabled={isLoading}
                            >
                                {isPasswordShow ? <FaRegEye /> : <FaRegEyeSlash />}
                            </Button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group mb-4">
                        <h4 className="mt-5 text-[rgba(0,0,0,0.7)] font-medium text-[16px]">Confirm Password</h4>
                        <div className="relative w-full">
                            <input
                                type={isConfirmPasswordShow ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Enter your confirm password"
                                className="mt-2 w-full h-[50px] px-4 text-[16px] border-2 rounded-md focus:outline-none"
                                value={formFields.confirmPassword}
                                ref={confirmPasswordRef}
                                onChange={onChangeInput}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                className="!absolute top-[15px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]"
                                onClick={() => setIsConfirmPasswordShow(!isConfirmPasswordShow)}
                                disabled={isLoading}
                            >
                                {isConfirmPasswordShow ? <FaRegEye /> : <FaRegEyeSlash />}
                            </Button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className={`${isLoading ? 'custom-btn-disabled' : 'custom-btn'
                            } !w-full !text-[15px] !mb-4`}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress color="inherit" size={24} /> : 'Reset Password'}
                    </Button>
                </form>

            </div>
        </section>
    );
};

export default ChangePassword;