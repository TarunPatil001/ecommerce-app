import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';



const Login = () => {

    const [isShowPassword, setIsShowPassword] = useState(false);

    return (
        <div>
            <section className="section py-10">
                <div className="container">
                    <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
                    <h3 className="text-[18px] text-center font-bold flex items-center justify-center gap-2"><img src="/favicon.png" className="w-[18px] h-[18px]" />Login to your account</h3>

                        <form action="" className="w-full mt-5">
                            <div className="form-group w-full mb-5 relative">
                                <TextField type="email" id="email" label="Email Id" placeholder="Enter email" required variant="outlined" className="custom-textfield w-full mb-5" />
                            </div>
                            <div className="form-group w-full mb-5 relative">
                                <TextField type={isShowPassword === true ? 'text' : 'password'} id="password" label="Password" placeholder="Enter password" required variant="outlined" className="custom-textfield w-full mb-5" />
                                <Button className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword(!isShowPassword)}>
                                    {
                                        isShowPassword === false ?
                                            <FaRegEyeSlash className="text-[20px]" />
                                            :
                                            <FaRegEye className="text-[20px]" />
                                    }
                                </Button>
                            </div>
                            <a className="cursor-pointer text-[14px] font-medium text-[var(--bg-primary)] hover:text-blue-700 hover:underline underline-offset-8">Forgot Password?</a>

                            <Button className="buttonPrimaryBlack !w-full !text-[15px] !font-semibold !mt-4">Sign In</Button>

                            <p className="text-[14px] font-medium flex items-center justify-center gap-1 mt-4">Not Registered?<Link to="/register" className="text-[var(--bg-primary)] hover:text-blue-700 hover:underline underline-offset-8 cursor-pointer text-[14px] font-medium">Sign Up</Link></p>

                            <p className="text-[14px] font-medium flex items-center justify-center gap-1 mt-1">Or continue with social account</p>
                            
                            <Button className="w-full !bg-[#f1f1f1] hover:!bg-[#ffe6db] hover:!text-gray-700 flex items-center gap-2 !text-[15px] !font-semibold !mt-2"><FcGoogle className="text-[18px]" />Login with google</Button>

                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login
