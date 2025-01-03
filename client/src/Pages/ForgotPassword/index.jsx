import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';


const ForgotPassword = () => {

    const [isShowPassword1, setIsShowPassword1] = useState(false);
    const [isShowPassword2, setIsShowPassword2] = useState(false);

    const [formFields, setFormFields] = useState({
        newPassword:'',
        confirmPassword:'',
    });

    

    return (
        <div>
            <section className="section py-10">
                <div className="container">
                    <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
                    <h3 className="text-[18px] text-center font-bold flex flex-col items-center justify-center gap-2"><img src="/ResetPassword.png" className="w-[64px] h-full" />Reset Password</h3>

                        <form action="" className="w-full mt-5">
                            <div className="form-group w-full mb-5 relative">
                                <TextField type={isShowPassword1 === true ? 'text' : 'password'} id="newPassword" name="newPassword" label="New Password" placeholder="Enter new password" required variant="outlined" className="custom-textfield w-full mb-5" />
                                <Button className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword1(!isShowPassword1)}>
                                    {
                                        isShowPassword1 === false ?
                                            <FaRegEyeSlash className="text-[20px]" />
                                            :
                                            <FaRegEye className="text-[20px]" />
                                    }
                                </Button>
                            </div>
                            <div className="form-group w-full mb-5 relative">
                                <TextField type={isShowPassword2 === true ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" label="Confirm New Password" placeholder="Re-enter new password" required variant="outlined" className="custom-textfield w-full mb-5" />
                                <Button className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword2(!isShowPassword2)}>
                                    {
                                        isShowPassword2 === false ?
                                            <FaRegEyeSlash className="text-[20px]" />
                                            :
                                            <FaRegEye className="text-[20px]" />
                                    }
                                </Button>
                            </div>
                            
                            <Button className="buttonPrimaryBlack !w-full !text-[15px] !font-semibold !mb-4 !capitalize">Reset Password</Button>

                            
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ForgotPassword
