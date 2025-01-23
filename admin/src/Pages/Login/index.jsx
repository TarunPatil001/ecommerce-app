import { Button, Checkbox } from '@mui/material'
import { useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { HiLogin } from "react-icons/hi";
import { PiUserCirclePlusLight } from "react-icons/pi";
import LoadingButton from '@mui/lab/LoadingButton';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaRegEyeSlash } from "react-icons/fa";
import FormControlLabel from '@mui/material/FormControlLabel';
import { FaRegEye } from "react-icons/fa";
import { useContext } from 'react';
import { MyContext } from '../../App';
import { CircularProgress } from '@mui/material';
import { postData } from '../../utils/api';
import toast from 'react-hot-toast';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Login = () => {

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [loadingFb, setLoadingFb] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [formFields, setFormFields] = useState({
        email: '',
        password: '',
    });

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    function handleClickGoogle() {
        setLoadingGoogle(true);
    }

    function handleClickFb() {
        setLoadingFb(true);
    }

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((formFields) => ({
            ...formFields,
            [name]: value,
        }));
    };


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
            if (!formFields.email) emailRef.current.focus();
            else if (!formFields.password) passwordRef.current.focus();
            return; // Stop further execution
        }

        // Check if an email already exists in localStorage
        const storedEmail = localStorage.getItem("User email");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (storedEmail) {
            if (storedEmail !== formFields.email || accessToken && refreshToken) {
                // Notify the user about the conflict
                // Optionally, provide an option to clear the stored email
                const confirmSwitch = window.confirm("Another admin account already exists on this profile. Do you want to switch to a new admin account? This will clear the current admin data for this site.");

                if (confirmSwitch) {
                    localStorage.clear();
                    // Proceed with registration or login for the new user
                } else {
                    return; // Stop further execution if the user doesn't confirm the switch
                }
            }
        } else {
            // Continue with the registration or login process
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
                postData("/api/user/login", formFields, { withCredentials: true }),
                {
                    loading: "Logging in... Please wait.",
                    success: (res) => {
                        if (res && res.error === false) {
                            localStorage.setItem("admin-email", formFields.email);
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

        <section className='w-full h-full bg-white'>
            <img src="/pattern.webp" alt="bg_img" className='w-full h-full fixed top-0 left-0 opacity-5' />
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
            <div className='loginBox card w-[600px] h-auto mx-auto pt-20 relative !z-50 pb-20'>
                <div className='text-center'>
                    <img src="https://isomorphic-furyroad.vercel.app/_next/static/media/logo-short.18ca02a8.svg" alt="" className='m-auto' />
                </div>
                <h1 className='mt-10 text-[44px] font-bold leading-[54px] text-center'>Welcome Back! <br />
                    Sign in with your credentials.
                </h1>

                <div className='flex items-center justify-center w-full mt-10 gap-6'>
                    <LoadingButton
                        size="small"
                        onClick={handleClickGoogle}
                        startIcon={<FcGoogle />}
                        loading={loadingGoogle}
                        loadingPosition="start"
                        variant="outlined"
                        className="!normal-case w-[200px] h-[44px] !rounded-md !shadow-none !text-[rgba(0,0,0,0.8)] custom-credential-btn !text-[14px] hover:!border-black"
                    >
                        Sign In with Google
                    </LoadingButton>
                    <LoadingButton
                        size="small"
                        onClick={handleClickFb}
                        startIcon={<FaFacebook className='text-blue-600' />}
                        loading={loadingFb}
                        loadingPosition="start"
                        variant="outlined"
                        className="!normal-case w-[200px] h-[44px] !rounded-md !shadow-none !text-[rgba(0,0,0,0.8)] custom-credential-btn !text-[14px] hover:!border-black"
                    >
                        Sign In with Facebook
                    </LoadingButton>
                </div>

                <div className='flex items-center justify-center w-full mt-10 gap-3 text-center'>
                    <span className='w-full'><hr /></span>
                    <span className='w-full text-[16px] text-[rgba(0,0,0,0.7)] font-medium'>Or, Sign In with your email</span>
                    <span className='w-full'><hr /></span>
                </div>

                <form action='#' className='w-full px-8 mt-3' onSubmit={handleSubmit}>
                    <div className='form-group mb-4 w-full'>
                        <h4 className='mt-5 text-[rgba(0,0,0,0.7)] font-medium text-[16px]'>Email</h4>
                        <input type="email" placeholder='Enter your email' className='mt-2 w-full h-[50px] px-4 text-[16px] font-medium border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:!border-[rgba(0,0,0,0.7)] focus:outline-none' name="email" ref={emailRef} value={formFields.email} disabled={isLoading} onChange={onChangeInput} />
                    </div>
                    <div className='form-group mb-4 w-full'>
                        <h4 className='mt-5 text-[rgba(0,0,0,0.7)] font-medium text-[16px]'>Password</h4>
                        <div className="relative w-full">
                            <input type={isLoading ? 'password' : (isPasswordShow ? 'text' : 'password')} placeholder='Enter your password' className='mt-2 w-full h-[50px] px-4 text-[16px] font-medium border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:!border-[rgba(0,0,0,0.7)] focus:outline-none' name="password" ref={passwordRef} value={formFields.password} disabled={isLoading} onChange={onChangeInput} />
                            <Button className='!absolute !top-[15px] !right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-[rgba(0,0,0,0.8)] !text-[18px]' onClick={() => setIsPasswordShow(!isPasswordShow)}>
                                {
                                    isPasswordShow === true ? (<FaRegEye />) : (<FaRegEyeSlash />)
                                }
                            </Button>
                        </div>
                    </div>
                    <div className='form-group mb-4 w-full flex items-center justify-between'>
                        <FormControlLabel
                            control={<Checkbox {...label} />}
                            label="Remember me"
                        />
                        <Link to="/forgot-password">
                            <h4 className='underline hover:no-underline font-semibold'>Forgot Password?</h4>
                        </Link>
                    </div>
                    <Button type='submit' className={`${isLoading === true ? "custom-btn-disabled" : "custom-btn"} !w-full !capitalize !text-[15px] !font-semibold !mt-4`} disabled={isLoading}>
                        {
                            isLoading ? <CircularProgress color="inherit" /> : "Sign In"
                        }
                    </Button>
                    <Link to="/sign-up"><p className='flex items-center justify-center gap-2 text-[rgba(0,0,0,0.6)] text-[16px] mt-5'>Don’t have an account?<span className='text-black font-semibold'>Sign Up</span></p></Link>
                </form>
            </div>
        </section>


    )
}

export default Login
