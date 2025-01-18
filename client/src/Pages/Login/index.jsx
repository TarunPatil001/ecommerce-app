import React, { useContext, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { CircularProgress } from '@mui/material';



const Login = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [formFields, setFormFields] = useState({
        email: '',
        password: '',
    });

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((formFields) => ({
            ...formFields,
            [name]: value,
        }));
    };

    const forgetPassword = () => {
        if (formFields.email !== "") {
            ""
        } else {
            ""
        }
        context.openAlertBOx("success", "Email sent successfully");
        navigate("/verify");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Array to store missing fields
        let missingFields = [];
    
        // Validate form fields
        if (!formFields.email) missingFields.push("Email Id");
        if (!formFields.password) missingFields.push("Password");
    
        // If any required fields are missing, show a single alert and exit
        if (missingFields.length > 0) {
            const missingFieldsList = missingFields.join(", ").replace(/, ([^,]*)$/, " and $1");
            context.openAlertBox("error", `Please enter your ${missingFieldsList}`);
            return; // Stop further execution
        }
    
        // Start loading and disable the fields
        setIsLoading(true);
    
        try {
            // Validate form fields
            if (!formFields.email || !formFields.password) {
                context.openAlertBox("error", "Email and password are required.");
                return;
            }
    
            // Login API call wrapped with toast.promise
            const result = await toast.promise(
                postData("/api/user/login", formFields, {withCredentials: true}),
                {
                    loading: "Logging in... Please wait.",
                    success: (res) => {
                        if (res && res.error === false) {
                            // Clear form fields and store tokens
                            setFormFields({ email: "", password: "" });
                            localStorage.setItem("accessToken", res?.data?.accessToken);
                            localStorage.setItem("refreshToken", res?.data?.refreshToken);
    
                            // Update login state and navigate
                            context.setIsLogin(true);
                            navigate("/"); // Navigate to home page
                            return res?.message;
                        } else {
                            throw new Error(res?.message || "Oops! Server is slow. Try again!");
                        }
                    },
                    error: (err) => {
                        // Ensure err.response exists and check the message structure
                        const errorMessage = err?.response?.data?.message || err.message || "An unexpected error occurred. Please try again.";
                        return errorMessage;
                    },
                }
            ).then((res) => {
                console.log(res);
                // Add any additional success actions here
            }).catch((err) => {
                console.error(err);
            });
        } catch (err) {
            // Final fallback for unexpected errors
            return err.message || "An error occurred during login.";
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div>
            <section className="section py-10">
                <div className="container">
                    <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
                        <h3 className="text-[18px] text-center font-bold flex items-center justify-center gap-2"><img src="/favicon.png" className="w-[18px] h-[18px]" />Login to your account</h3>

                        <form action="" className="w-full mt-5" onSubmit={handleSubmit}>
                            <div className="form-group w-full mb-5 relative">
                                <TextField type="email" id="email" label="Email Id" name="email" placeholder="Enter email" variant="outlined" className="custom-textfield w-full mb-5" value={formFields.email} disabled={isLoading} onChange={onChangeInput} />
                            </div>
                            <div className="form-group w-full mb-5 relative">
                                <TextField type={isShowPassword === true ? 'text' : 'password'} id="password" name="password" label="Password" placeholder="Enter password" variant="outlined" className="custom-textfield w-full mb-5" value={formFields.password} disabled={isLoading} onChange={onChangeInput} />
                                <Button className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword(!isShowPassword)} disabled={isLoading} >
                                    {
                                        isShowPassword === false ?
                                            <FaRegEyeSlash className="text-[20px]" />
                                            :
                                            <FaRegEye className="text-[20px]" />
                                    }
                                </Button>
                            </div>
                            <a className="cursor-pointer text-[14px] font-medium text-[var(--bg-primary)] hover:text-blue-700 hover:underline underline-offset-8" onClick={forgetPassword} disabled={isLoading} >Forgot Password?</a>

                            <Button type='submit' className={`${isLoading === true ? "buttonDisabled" : "buttonPrimaryBlack"} !w-full !text-[15px] !font-semibold !mt-4`}>
                                {
                                    isLoading ? <CircularProgress color="inherit" /> : "Sign In"
                                }
                            </Button>

                            <p className="text-[14px] font-medium flex items-center justify-center gap-1 mt-4">Not Registered?<Link to="/register" className="text-[var(--bg-primary)] hover:text-blue-700 hover:underline underline-offset-8 cursor-pointer text-[14px] font-medium">Sign Up</Link></p>

                            <p className="text-[14px] font-medium flex items-center justify-center gap-1 mt-1">Or continue with social account</p>

                            <Button className="w-full !bg-[#f1f1f1] hover:!bg-[#ffe6db] hover:!text-gray-700 flex items-center gap-2 !text-[15px] !font-semibold !mt-2" disabled={isLoading} ><FcGoogle className="text-[18px]" />Login with google</Button>

                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login
