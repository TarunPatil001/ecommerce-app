import React, { useContext, useEffect, useState } from 'react'
import { Button, CircularProgress, Divider, TextField } from '@mui/material'
import AccountSidebar from '../../components/AccountSidebar'
import { MyContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { editData } from '../../utils/api'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { postData } from './../../utils/api';
import { Collapse } from 'react-collapse'

const MyAccount = () => {

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isChangePasswordFormShow, setIsChangePasswordFormShow] = useState(false);
    const [isShowPassword1, setIsShowPassword1] = useState(false);
    const [isShowPassword2, setIsShowPassword2] = useState(false);
    const [isShowPassword3, setIsShowPassword3] = useState(false);
    const [userId, setUserId] = useState("");
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        mobile: '',
    })
    const [changePassword, setChangePassword] = useState({
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((formFields) => ({
            ...formFields,
            [name]: value,
        }));
        setChangePassword((formFields) => ({
            ...formFields,
            [name]: value,
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token !== undefined && token !== null && token !== '') {
            context?.setIsLogin(true);
        } else {
            navigate("/");
        }
    }, [context, navigate]);

    useEffect(() => {
        if (context?.userData?._id !== undefined && context?.userData?._id !== null && context?.userData?._id !== '') {
            setUserId(context?.userData?._id);
            setFormFields({
                name: context?.userData?.name,
                email: context?.userData?.email,
                mobile: context?.userData?.mobile,
            });
            setChangePassword({
                email: context?.userData?.email,
            });
        }
    }, [context]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Array to store missing fields
        const missingFields = [];

        // Validate form fields
        if (!formFields.name) missingFields.push("Full Name");
        if (!formFields.email) missingFields.push("Email ID");
        if (!formFields.mobile) missingFields.push("Mobile");

        // If any required fields are missing, show a single alert and exit
        if (missingFields.length > 0) {
            const missingFieldsList = missingFields.join(", ").replace(/, ([^,]*)$/, " and $1");
            context.openAlertBox("error", `Please enter your ${missingFieldsList}`);
            return; // Stop further execution
        }

        // Start a toast.promise for handling loading, success, and error states
        try {
            await toast.promise(
                (async () => {
                    setIsLoading(true); // Start loading

                    // API call to update data
                    const response = await editData(`/api/user/${userId}`, formFields, { withCredentials: true });

                    if (response?.status === 200 && response?.data?.error === false) {
                        // Success: Profile updated
                        navigate("/"); // Redirect to the home page
                        return response;
                    } else {
                        // Failure: Throw an error to be caught by toast.promise
                        const errorMessage = response?.data?.message || "Failed to update profile";
                        throw new Error(errorMessage);
                    }
                })(),
                {
                    pending: "Updating profile...", // Loading message
                    success: (response) => response?.data?.message || "Profile updated successfully!", // Success message
                    error: {
                        render({ data }) {
                            return data.message || "Failed to update profile"; // Custom error message
                        },
                    },
                }
            );
        } catch (error) {
            console.error("Error updating profile:", error);

            // Display error message
            const errorMessage = error?.response?.data?.message || "Failed to update profile";
            context.openAlertBox("error", errorMessage);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const handleSubmitChangePassword = async (e) => {
        e.preventDefault();

        // Array to store missing fields
        const missingFields = [];

        // Validate form fields
        if (!changePassword.oldPassword) missingFields.push("Old Password");
        if (!changePassword.newPassword) missingFields.push("New Password");
        if (!changePassword.confirmPassword) missingFields.push("Confirm Password");
        if (changePassword.confirmPassword !== changePassword.newPassword) missingFields.push("New & Confirm Passwords correctly. They don't match.");

        // If any required fields are missing, show a single alert and exit
        if (missingFields.length > 0) {
            const missingFieldsList = missingFields.join(", ").replace(/, ([^,]*)$/, " and $1");
            context.openAlertBox("error", `Please enter your ${missingFieldsList}`);
            return; // Stop further execution
        }

       // Start loading and disable the fields
        setIsLoading2(true);

        try {

            // Login API call wrapped with toast.promise
            const result = await toast.promise(
                postData("/api/user/reset-password", changePassword, { withCredentials: true }),
                {
                    loading: "Updating password... Please wait.",
                    success: (res) => {
                        if (res && res.error === false) {
                            // Clear form fields and store tokens
                            setChangePassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
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
            return err.message || "An error occurred during updating password.";
        } finally {
            setIsLoading2(false);
        }
    };


    return (
        <section className="py-10 w-full">
            <div className="container flex gap-5">
                <AccountSidebar />
                <div className="col-2 w-[50%]">
                    <div className="card bg-white p-5 shadow-md rounded-md mb-5">
                        <div className="flex items-center mb-2">
                            <h2 className="pb-0 font-semibold">My Profile</h2>
                            <Button className='!ml-auto' onClick={() => setIsChangePasswordFormShow(!isChangePasswordFormShow)}>Change Password</Button>
                        </div>
                        <Divider />
                        <form action="" className="mt-6" onSubmit={handleSubmit}>
                            <div className="flex items-center gap-5">
                                <div className="w-[50%]">
                                    <TextField type='text' label="Full Name" variant="outlined" size="small" className="custom-textfield w-full" name="name" value={formFields.name} disabled={isLoading} onChange={onChangeInput} />
                                </div>
                                <div className="w-[50%]">
                                    <TextField type='email' label="Email" variant="outlined" size="small" className="custom-textfield w-full" name="email" value={formFields.email} disabled onChange={onChangeInput} />
                                </div>
                            </div>
                            <div className="flex items-center gap-5 mt-4">
                                <div className="w-[50%]">
                                    <TextField type='tel' label="Mobile No." variant="outlined" size="small" className="custom-textfield w-full" name="mobile" value={formFields.mobile} disabled={isLoading} onChange={onChangeInput} />
                                </div>
                                <div className="w-[50%]"></div>
                            </div>
                            <div className="flex items-center gap-5 mt-5">
                                <div className="flex gap-5 w-[50%]">
                                    <Button type='submit' className={`${isLoading === true ? "buttonDisabled" : "buttonPrimaryBlack"} w-full`} disabled={isLoading}>
                                        {
                                            isLoading ? <CircularProgress color="inherit" /> : "Save"
                                        }
                                    </Button>
                                    <Button type='reset' className="buttonPrimaryWhite w-full" disabled={isLoading}>Cancel</Button>
                                </div>
                            </div>
                        </form>
                    </div>


                    <Collapse isOpened={isChangePasswordFormShow}>
                        <div className="card bg-white p-5 shadow-md rounded-md" >
                            <div className="flex items-center mb-2">
                                <h2 className="pb-0 font-semibold">Change Password</h2>
                            </div>
                            <Divider />
                            <form action="" className="mt-6" onSubmit={handleSubmitChangePassword}>
                                <div className="flex items-center gap-5">
                                    <div className="w-[50%] relative">
                                        <TextField type={isLoading2 ? 'password' : (isShowPassword1 ? 'text' : 'password')} label="Old Password" variant="outlined" size="small" className="custom-textfield w-full" name="oldPassword" value={changePassword.oldPassword} disabled={isLoading2} onChange={onChangeInput} />
                                        <Button className="!absolute top-[3px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword1(!isShowPassword1)} disabled={isLoading} >
                                            {
                                                isShowPassword1 === false ?
                                                    <FaRegEyeSlash className="text-[20px]" />
                                                    :
                                                    <FaRegEye className="text-[20px]" />
                                            }
                                        </Button>
                                    </div>
                                    <div className="w-[50%] relative">
                                        <TextField type={isLoading2 ? 'password' : (isShowPassword2 ? 'text' : 'password')} label="New Password" variant="outlined" size="small" className="custom-textfield w-full" name="newPassword" value={changePassword.newPassword} disabled={isLoading2} onChange={onChangeInput} />
                                        <Button className="!absolute top-[3px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword2(!isShowPassword2)} disabled={isLoading} >
                                            {
                                                isShowPassword2 === false ?
                                                    <FaRegEyeSlash className="text-[20px]" />
                                                    :
                                                    <FaRegEye className="text-[20px]" />
                                            }
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 mt-4">
                                    <div className="w-[50%] relative">
                                        <TextField type={isLoading2 ? 'password' : (isShowPassword3 ? 'text' : 'password')} label="Confirm Password" variant="outlined" size="small" className="custom-textfield w-full" name="confirmPassword" value={changePassword.confirmPassword} disabled={isLoading2} onChange={onChangeInput} />
                                        <Button className="!absolute top-[3px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword3(!isShowPassword3)} disabled={isLoading} >
                                            {
                                                isShowPassword3 === false ?
                                                    <FaRegEyeSlash className="text-[20px]" />
                                                    :
                                                    <FaRegEye className="text-[20px]" />
                                            }
                                        </Button>
                                    </div>
                                    <div className="w-[50%]"></div>
                                </div>
                                <div className="flex items-center gap-5 mt-5">
                                    <div className="flex gap-5 w-[50%]">
                                        <Button type='submit' className={`${isLoading2 === true ? "buttonDisabled" : "buttonPrimaryBlack"} w-full`} disabled={isLoading2}>
                                            {
                                                isLoading2 ? <CircularProgress color="inherit" /> : "Change Password"
                                            }
                                        </Button>
                                        <Button type='reset' className="buttonPrimaryWhite w-full" disabled={isLoading2}>Cancel</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Collapse>

                </div>
            </div>
        </section>
    )
}

export default MyAccount
