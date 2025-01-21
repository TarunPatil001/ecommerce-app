import React, { useContext, useEffect, useState } from 'react'
import { Button, CircularProgress, Divider, TextField } from '@mui/material'
import AccountSidebar from '../../components/AccountSidebar'
import { MyContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { editData } from '../../utils/api'

const MyAccount = () => {

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState("");
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        mobile: '',
    })

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((formFields) => ({
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
            setFormFields((formFields) => ({
                name: context?.userData?.name,
                email: context?.userData?.email,
                mobile: context?.userData?.mobile,
            }));
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
    


    return (
        <section className="py-10 w-full">
            <div className="container flex gap-5">
                <AccountSidebar />
                <div className="col-2 w-[50%]">
                    <div className="card bg-white p-5 shadow-md rounded-md">
                        <h2 className="pb-3">My Profile</h2>
                        <Divider />
                        <form action="" className="mt-5" onSubmit={handleSubmit}>
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
                </div>
            </div>
        </section>
    )
}

export default MyAccount
