import { useContext, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';


const ForgotPassword = () => {

    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [isShowPassword1, setIsShowPassword1] = useState(false);
    const [isShowPassword2, setIsShowPassword2] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const [formFields, setFormFields] = useState({
        email: localStorage.getItem("User email"),
        newPassword: '',
        confirmPassword: '',
    });
    

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
        if (!formFields.newPassword) missingFields.push("New Password");
        if (!formFields.confirmPassword) missingFields.push("Confirm Password");

        // If any required fields are missing, show a single alert and exit
        if (missingFields.length > 0) {
            const missingFieldsList = missingFields.join(", ").replace(/, ([^,]*)$/, " and $1");
            context.openAlertBox("error", `Please enter the ${missingFieldsList}`);
            if (!formFields.newPassword) newPasswordRef.current.focus();
            else if (!formFields.confirmPassword) confirmPasswordRef.current.focus();
            return; // Stop further execution
        }

        // Check if passwords match
        if (formFields.newPassword !== formFields.confirmPassword) {
            context.openAlertBox("error", "New Password and Confirm Password do not match.");
            confirmPasswordRef.current.focus();
            return;
        }

        // Start loading and disable the fields

        setIsLoading(true);

        try {
            // Validate form fields
            if (!formFields.newPassword || !formFields.confirmPassword) {
                context.openAlertBox("error", "New Password and Confirm Password are required.");
                return;
            }

            // Login API call wrapped with toast.promise
            await toast.promise(
                postData("/api/user/reset-password", formFields),
                {
                    loading: "Resetting Password... Please wait.",
                    success: (res) => {
                        if (res && res.error === false) {
                            // Clear form fields and store tokens
                            setFormFields({ newPassword: "", confirmPassword: "" });
                            localStorage.clear()
                            navigate("/login"); // Navigate to login page
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
            return err.message || "An error occurred during resetting password.";
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <section className="section py-10">
                <div className="container">
                    <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
                        <h3 className="text-[18px] text-center font-bold flex flex-col items-center justify-center gap-2"><img src="/ResetPassword.png" className="w-[64px] h-full" />Reset Password</h3>

                        <form action="" className="w-full mt-5" onSubmit={handleSubmit}>
                            <div className="form-group w-full mb-5 relative">
                                <TextField type={isLoading ? 'password' : (isShowPassword1 ? 'text' : 'password')} id="newPassword" name="newPassword" label="New Password" placeholder="Enter new password" variant="outlined" className="custom-textfield w-full mb-5" value={formFields.newPassword} disabled={isLoading} inputRef={newPasswordRef} onChange={onChangeInput} />
                                <Button className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" disabled={isLoading} onClick={() => setIsShowPassword1(!isShowPassword1)}>
                                    {
                                        isShowPassword1 === false ?
                                            <FaRegEyeSlash className="text-[20px]" />
                                            :
                                            <FaRegEye className="text-[20px]" />
                                    }
                                </Button>
                            </div>
                            <div className="form-group w-full mb-5 relative">
                                <TextField type={isLoading ? 'password' : (isShowPassword2 ? 'text' : 'password')} id="confirmPassword" name="confirmPassword" label="Confirm New Password" placeholder="Re-enter new password" variant="outlined" className="custom-textfield w-full mb-5" value={formFields.confirmPassword} disabled={isLoading} inputRef={confirmPasswordRef} onChange={onChangeInput} />
                                <Button className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" disabled={isLoading} onClick={() => setIsShowPassword2(!isShowPassword2)}>
                                    {
                                        isShowPassword2 === false ?
                                            <FaRegEyeSlash className="text-[20px]" />
                                            :
                                            <FaRegEye className="text-[20px]" />
                                    }
                                </Button>
                            </div>

                            <Button
                                type="submit"
                                className={`${isLoading === true ? "buttonDisabled" : "buttonPrimaryBlack"} !w-full !text-[15px] !font-semibold !mb-4 !capitalize`}
                                disabled={isLoading} // Disable submit button when loading
                            >
                                {
                                    isLoading ? <CircularProgress color="inherit" /> : "Reset Password"
                                }
                            </Button>

                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ForgotPassword
