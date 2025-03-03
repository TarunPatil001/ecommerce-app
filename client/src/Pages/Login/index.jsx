import { useContext, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { CircularProgress } from '@mui/material';

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseApp } from '../../firebase';
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Login = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [formFields, setFormFields] = useState({
        email: '',
        password: '',
    });

    const context = useContext(MyContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((formFields) => ({
            ...formFields,
            [name]: value,
        }));
    };

    const forgetPassword = async (e) => {
        e.preventDefault();

        // Array to store missing fields
        let missingFields = [];

        // Validate form fields
        if (!formFields.email) missingFields.push("Email Id");

        // If any required fields are missing, show a single alert and exit
        if (missingFields.length > 0) {
            const missingFieldsList = missingFields.join(", ").replace(/, ([^,]*)$/, " and $1");
            context.openAlertBox("error", `Please enter your ${missingFieldsList}`);
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
                const confirmSwitch = window.confirm("Another user already exists on this profile. Do you want to switch to a new user? This will clear the current user data for this site.");

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
            if (!formFields.email) {
                context.openAlertBox("error", "Email Id is required.");
                return;
            }

            // Login API call wrapped with toast.promise
            await toast.promise(
                postData("/api/user/forgot-password", formFields, { withCredentials: true }),
                {
                    loading: "OTP is sending... Please wait.",
                    success: (res) => {
                        if (res && res.error === false) {
                            localStorage.setItem("User email", formFields.email);
                            localStorage.setItem("actionType", "forgot-password");
                            // Set OTP expiration time and trigger timer
                            const currentTime = Date.now();
                            const otpExpirationTime = currentTime + 5 * 60 * 1000; // OTP expires in 5 minutes
                            localStorage.setItem("OTP_EXPIRES", otpExpirationTime); // Store the OTP expiration time

                            // Clear form fields and store tokens
                            setFormFields({ email: "", password: "" });
                            navigate("/verify"); // Navigate to the verify page
                            return formFields.email ? `OTP sent to ${formFields.email}` : res?.message || "An unexpected error occurred";

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
            await toast.promise(
                postData("/api/user/login", formFields, { withCredentials: true }),
                {
                    loading: "Logging in... Please wait.",
                    success: (res) => {
                        if (res && res.error === false) {
                            localStorage.setItem("User email", formFields.email);
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


    const authWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)

                const fields = {
                    name: user.providerData[0].displayName,
                    email: user.providerData[0].email,
                    password: null,
                    avatar: user.providerData[0].photoURL,
                    mobile: user.providerData[0].phoneNumber,
                    role: "USER",
                }

                postData(`/api/user/authWithGoogle`, fields).then((res) => {
                    if (res?.error !== true) {
                        setIsLoading(false);
                        context.openAlertBox("success", res?.message);
                        localStorage.setItem("User email", fields.email);
                        localStorage.setItem("accessToken", res?.data?.accessToken);
                        localStorage.setItem("refreshToken", res?.data?.refreshToken);
                        context.setIsLogin(true);
                        navigate('/');
                    } else {
                        context.openAlertBox("error", res?.message);
                        setIsLoading(false);
                    }
                })

                console.log(user);
                // ...
            }).catch((error) => {
                // Log the error code and message to the console for debugging
                const errorCode = error.code;
                const errorMessage = error.message;
            
                // Optionally, log the email and credential if needed
                const email = error.customData?.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            
                // Display a message to the user, showing a generic error or custom error message
                context.openAlertBox("error", "An error occurred while signing in with Google. Please try again.");
            
                // You can log the error information for development purposes
                console.error("Google Auth Error:", { errorCode, errorMessage, email, credential });
            
                // Optionally, you can also send the error details to an analytics service like Sentry
            });
            
    }


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
                                <TextField type={isLoading ? 'password' : (isShowPassword ? 'text' : 'password')} id="password" name="password" label="Password" placeholder="Enter password" variant="outlined" className="custom-textfield w-full mb-5" value={formFields.password} disabled={isLoading} onChange={onChangeInput} />
                                <Button className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword(!isShowPassword)} disabled={isLoading} >
                                    {
                                        isShowPassword === false ?
                                            <FaRegEyeSlash className="text-[20px]" />
                                            :
                                            <FaRegEye className="text-[20px]" />
                                    }
                                </Button>
                            </div>

                            <a className={`cursor-pointer text-[14px] font-medium text-[var(--bg-primary)] hover:text-blue-700 hover:underline underline-offset-8 ${isLoading ? 'pointer-events-none opacity-50' : ''}`} onClick={forgetPassword}>Forgot Password?</a>

                            <Button type='submit' className={`${isLoading === true ? "buttonDisabled" : "buttonPrimaryBlack"} !w-full !text-[15px] !font-semibold !mt-4`} disabled={isLoading}>
                                {
                                    isLoading ? <CircularProgress color="inherit" /> : "Sign In"
                                }
                            </Button>

                            <p className="text-[14px] font-medium flex items-center justify-center gap-1 mt-4">Not Registered?<Link to="/register" className="text-[var(--bg-primary)] hover:text-blue-700 hover:underline underline-offset-8 cursor-pointer text-[14px] font-medium">Sign Up</Link></p>

                            <p className="text-[14px] font-medium flex items-center justify-center gap-1 mt-1">Or continue with social account</p>

                            <Button className="w-full !bg-[#f1f1f1] hover:!bg-[#ffe6db] hover:!text-gray-700 flex items-center gap-2 !text-[15px] !font-semibold !mt-2" disabled={isLoading} onClick={authWithGoogle}><FcGoogle className="text-[18px]" />Login with google</Button>

                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login





