import React, { useContext, useState } from 'react'
import { MyContext } from '../../App';
import { CircularProgress, Button, Radio } from '@mui/material';
import { FiUpload } from 'react-icons/fi';
import { useEffect } from 'react';
import { editData, fetchDataFromApi, postData, uploadImage } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Collapse } from 'react-collapse';
import { useRef } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';



const Profile = () => {

    const context = useContext(MyContext);
    const navigate = useNavigate();
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const oldPasswordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const [preview, setPreview] = useState(null);  // Preview for image before uploading
    const [avatar, setAvatar] = useState(null);  // Actual avatar URL fetched from the server
    const [address, setAddress] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isLoading3, setIsLoading3] = useState(false);
    const [isChangePasswordFormShow, setIsChangePasswordFormShow] = useState(false);
    const [isShowPassword1, setIsShowPassword1] = useState(false);
    const [isShowPassword2, setIsShowPassword2] = useState(false);
    const [isShowPassword3, setIsShowPassword3] = useState(false);
    const [phone, setPhone] = useState('');
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


    useEffect(() => {
        // Directly set the avatar URL from context if available
        if (context?.userData?.avatar) {
            setAvatar(context?.userData?.avatar);
            setPreview(context?.userData?.avatar); // Set preview to the same value initially
        }
    }, [context?.userData?.avatar]); // Re-fetch when only the avatar in context changes


    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token !== undefined && token !== null && token !== '') {
            context?.setIsLogin(true);
        } else {
            navigate("/sign-in");
        }
    }, [context, navigate]);


    useEffect(() => {
        if (context?.userData?._id !== '' && context?.userData?._id !== null && context?.userData?._id !== undefined) {

            // Fetch addresses when the component mounts
            fetchDataFromApi(`/api/address/get-address?userId=${context?.userData?._id}`).then((res) => {
                setAddress(res.data); // Store the fetched addresses in state
                context?.setAddress(res.data); // Store the fetched addresses in state
                // console.log(res);
            });

            setUserId(context?.userData?._id);
            setFormFields({
                name: context?.userData?.name,
                email: context?.userData?.email,
                mobile: context?.userData?.mobile,
            });
            setChangePassword({
                email: context?.userData?.email,
            });

            setPhone(`"${context?.userData?.mobile}"`);  // Set initial phone value from user data
        }
    }, [context?.userData]);


    const onChangeFile = async (e, apiEndPoint) => {
        
        try {
            const result = await toast.promise(
              (async () => {
                const file = e.target.files[0];
                if (!file) {
                  throw new Error("No file selected.");
                }
          
                const validFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
                if (!validFormats.includes(file.type)) {
                  throw new Error("Please select a valid image (JPEG/JPG/PNG/WEBP).");
                }
          
                const formData = new FormData();
                formData.append("avatar", file);
          
                setUploading(true);
          
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl); // Temporary preview
          
                // Call the API and validate the response
                const response = await uploadImage(apiEndPoint, formData);
                console.log("API Response Debug:", response); // Debug API response
          
                if (response?.avatar) {
                  setAvatar(response.avatar); // Update state with the final avatar URL
                  setPreview(response.avatar); // Update preview with the uploaded avatar
                  return "Avatar updated successfully!";
                } else {
                  console.error("Unexpected response format:", response);
                  throw new Error("Failed to update avatar.");
                }
              })(),
              {
                loading: "Uploading image... Please wait.",
                success: (message) => message,
                error: (err) => {
                  console.error("Toast error handler debug:", err);
                  const errorMessage =
                    err?.response?.data?.message || err.message || "An error occurred while uploading your image.";
                  return errorMessage;
                },
              }
            );
          
            console.log("Result:", result); // Log success message
            // context.openAlertBox("success", result); // Show success alert
          } catch (error) {
            console.error("Error while uploading file:", error);
            // context.openAlertBox("error", error?.message || "An unexpected error occurred.");
          } finally {
            setUploading(false); // Stop spinner
          }
        
    };


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


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formFields.name === "") {
            context.openAlertBox("error", "Please enter your full name.");
            return;
        }

        if (formFields.email === "") {
            context.openAlertBox("error", "Please enter your email ID.");
            return;
        }

        if (formFields.mobile === "") {
            context.openAlertBox("error", "Please enter your mobile number.");
            return;
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
            if (!changePassword.oldPassword) oldPasswordRef.current.focus();
            else if (!changePassword.newPassword) newPasswordRef.current.focus();
            else if (!changePassword.confirmPassword) confirmPasswordRef.current.focus();
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
                            // navigate("/"); // Navigate to home page
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


    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };



    return (
        <>
            <div className="card my-4 bg-white border rounded-md p-5">
                <div className="grid grid-cols-8 mb-3 gap-4">
                    <div className='col col-span-1'></div>
                    <div className='col col-span-7 flex items-center justify-between'>
                        <div className='col'>
                            <h2 className="pb-0 font-bold text-[18px] text-gray-700">User Profile</h2>
                        </div>
                        <div className='col'>
                            <Button className='!ml-auto !normal-case !bg-slate-50 shadow !text-black' onClick={() => setIsChangePasswordFormShow(!isChangePasswordFormShow)}>What to change password?</Button>
                        </div>
                    </div>
                </div>
                <hr />
                <br />

                <div className="grid grid-cols-8 mb-3 gap-4">
                    <div className='col col-span-1 flex items-start justify-center'>
                        <div className='w-[110px] h-[110px] border p-1 relative rounded-full overflow-hidden shadow-xl flex items-center justify-center '>
                            <div className="w-full h-full overflow-hidden group rounded-full relative shadow flex items-center justify-center border bg-gray-300">

                                {uploading === true ? (
                                    <CircularProgress color="inherit" />
                                ) : (
                                    <img
                                        src={preview || avatar || `https://static-00.iconduck.com/assets.00/profile-default-icon-1024x1023-4u5mrj2v.png`}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="overlay w-full h-full absolute top-0 left-0 z-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center opacity-0 rounded-full group-hover:opacity-100 duration-300 transition-all">
                                    <FiUpload className="text-white text-[22px] group-hover:scale-125 duration-300 transition-all" />
                                    <input type="file" id="" className="absolute top-0 left-0 w-full h-full opacity-0 rounded-full cursor-pointer border-2 " name="avatar" accept='image/*' onChange={(e) => onChangeFile(e, "/api/user/user-avatar")} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col col-span-7'>
                        <form action="" className="mt-0" onSubmit={handleSubmit}>

                            <div className="grid grid-cols-2 mb-3 gap-4">
                                <div className='col'>
                                    <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Full Name</h3>
                                    <input type="text" className={`w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-md ${isLoading === true ? "cursor-not-allowed" : ""}`} placeholder='Product title' ref={nameRef} name="name" value={formFields?.name} disabled={isLoading} onChange={onChangeInput} />
                                </div>
                                <div className='col'>
                                    <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Email</h3>
                                    <input type="email" className={`w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-md ${isLoading === true ? "cursor-not-allowed" : ""}`} placeholder='Product title' ref={emailRef} name="email" value={formFields?.email} disabled onChange={onChangeInput} />
                                </div>
                                <div className='col'>
                                    <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Mobile No.</h3>
                                    <PhoneInput defaultCountry="in" preferredCountries={["in"]} name='mobile' value={phone} onChange={(phone) => { setPhone(phone); setFormFields({ mobile: phone }); }} className={`!w-full h-[40px] flex items-center ${isLoading === true ? "!cursor-not-allowed" : ""}`} disabled={isLoading} />
                                </div>

                            </div>

                            <div className="grid grid-cols-4 mt-5 gap-4">
                                <div className='col'>
                                    <Button type='submit' className={`${isLoading === true ? "custom-btn-disabled" : "custom-btn"}  w-full`} disabled={isLoading}>
                                        {
                                            isLoading ? <CircularProgress color="inherit" /> : "Save"
                                        }
                                    </Button>
                                </div>
                                <div className='col'>
                                    <Button type='reset' className="custom-btn w-full" disabled={isLoading}>Cancel</Button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div >

            <div className="card my-4 bg-white border rounded-md p-5">
                <div className="grid grid-cols-8 mb-3 gap-4">
                    <div className='col col-span-1'></div>
                    <div className='col col-span-7 flex items-center justify-between'>
                        <div className='col'>
                            <h2 className="pb-0 font-bold text-[18px] text-gray-700">Address Details</h2>
                        </div>
                    </div>
                </div>
                <hr />
                <br />

                <div className="grid grid-cols-8 mb-3 gap-4">
                    <div className='col col-span-1'>
                    </div>
                    <div className='col col-span-7'>
                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Address</h3>
                            <div className={`w-full h-[40px] bg-blue-50 flex items-center justify-center border-2 border-dashed ${isLoading === true ? "" : "hover:border-blue-300 hover:bg-blue-50 cursor-pointer"} rounded-md p-3 text-md ${isLoading === true ? "cursor-not-allowed" : ""}`} onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: "Add New Address" })} disabled={isLoading}>
                                <span className='text-gray-700 text-center'>
                                    {
                                        isLoading3 ? <CircularProgress color="inherit" /> : "Add Address"
                                    }

                                </span>
                            </div>
                        </div>


                        {/* <div className="col">
                            <div
                                className={`w-full h-full flex flex-col items-center justify-center gap-2 mt-2 text-md ${isLoading ? 'cursor-not-allowed' : ''
                                    }`}
                            >
                                {address.length > 0 ? (
                                    address.map((address, index) => {
                                        const fullAddress =
                                            address.address_line1 + ", " +
                                            address.city + ", " +
                                            address.state + ", " +
                                            address.pincode + ", " +
                                            address.country + ", " +
                                            address.mobile;

                                        return (
                                            <label
                                                key={index}
                                                className="border-2 border-dashed addressBox w-full flex items-center justify-start p-3 rounded-md cursor-pointer"
                                            >
                                                <Radio
                                                    name="address"
                                                    checked={selectedValue === (address?._id)}
                                                    value={address?._id}
                                                    onChange={handleChange}
                                                />
                                                <span>{fullAddress}</span>
                                            </label>
                                        );
                                    })
                                ) : (
                                    <p>No addresses found.</p>
                                )}
                            </div>
                        </div> */}

                        <div className="col">
                            <div
                                className={`w-full h-full flex flex-col items-center justify-center gap-2 mt-2 text-md ${isLoading ? 'cursor-not-allowed' : ''
                                    }`}
                            >
                                {Array.isArray(address) && address.length > 0 ? (
                                    address.map((address, index) => {
                                        const fullAddress =
                                            address.address_line1 +
                                            ', ' +
                                            address.city +
                                            ', ' +
                                            address.state +
                                            ', ' +
                                            address.pincode +
                                            ', ' +
                                            address.country +
                                            ', ' +
                                            address.mobile;

                                        return (
                                            <label
                                                key={index}
                                                className="border-2 border-dashed addressBox w-full flex items-center justify-start p-3 rounded-md cursor-pointer"
                                            >
                                                <Radio
                                                    name="address"
                                                    checked={selectedValue === address?._id}
                                                    value={address?._id}
                                                    onChange={handleChange}
                                                />
                                                <span>{fullAddress}</span>
                                            </label>
                                        );
                                    })
                                ) : (
                                    <p>No addresses found.</p>
                                )}
                            </div>
                        </div>



                    </div>
                </div>
            </div>


            <Collapse isOpened={isChangePasswordFormShow}>
                <div className="card bg-white p-5 shadow-md rounded-md" >
                    <div className="grid grid-cols-8 mb-3 gap-4">
                        <div className='col col-span-1'></div>
                        <div className='col col-span-7'>
                            <h2 className="pb-0 font-bold text-[18px] text-gray-700">Edit Password</h2>
                        </div>
                    </div>
                    <hr />
                    <br />
                    <div className="grid grid-cols-8 mb-3 gap-4">
                        <div className='col col-span-1'>
                        </div>
                        <div className='col col-span-7'>
                            <form action="" onSubmit={handleSubmitChangePassword}>

                                <div className="grid grid-cols-2 mb-3 gap-4">
                                    <div className='col relative'>
                                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Old Password</h3>
                                        <input type={isLoading2 ? 'password' : (isShowPassword1 ? 'text' : 'password')} className={`w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-md ${isLoading === true ? "cursor-not-allowed" : ""}`} placeholder='Old Password' ref={oldPasswordRef} name="oldPassword" value={changePassword?.oldPassword} disabled={isLoading2} onChange={onChangeInput} />
                                        <Button className="!absolute bottom-[3px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword1(!isShowPassword1)} disabled={isLoading} >
                                            {
                                                isShowPassword1 === false ?
                                                    <FaRegEyeSlash className="text-[20px]" />
                                                    :
                                                    <FaRegEye className="text-[20px]" />
                                            }
                                        </Button>
                                    </div>

                                    <div className="col relative">
                                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>New Password</h3>
                                        <input type={isLoading2 ? 'password' : (isShowPassword2 ? 'text' : 'password')} className={`w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-md ${isLoading === true ? "cursor-not-allowed" : ""}`} placeholder='New Password' ref={newPasswordRef} name="newPassword" value={changePassword?.newPassword} disabled={isLoading2} onChange={onChangeInput} />
                                        <Button className="!absolute bottom-[3px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword2(!isShowPassword2)} disabled={isLoading} >
                                            {
                                                isShowPassword2 === false ?
                                                    <FaRegEyeSlash className="text-[20px]" />
                                                    :
                                                    <FaRegEye className="text-[20px]" />
                                            }
                                        </Button>
                                    </div>

                                    <div className="col relative">
                                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Confirm Password</h3>
                                        <input type={isLoading2 ? 'password' : (isShowPassword3 ? 'text' : 'password')} className={`w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-md ${isLoading === true ? "cursor-not-allowed" : ""}`} placeholder='New Password' ref={confirmPasswordRef} name="confirmPassword" value={changePassword?.confirmPassword} disabled={isLoading2} onChange={onChangeInput} />
                                        <Button className="!absolute bottom-[3px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[rgba(0,0,0,0.7)]" onClick={() => setIsShowPassword3(!isShowPassword3)} disabled={isLoading} >
                                            {
                                                isShowPassword3 === false ?
                                                    <FaRegEyeSlash className="text-[20px]" />
                                                    :
                                                    <FaRegEye className="text-[20px]" />
                                            }
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 mt-5 gap-4">
                                    <div className="col">
                                        <Button type='submit' className={`${isLoading2 === true ? "custom-btn-disabled" : "custom-btn"} w-full`} disabled={isLoading2}>
                                            {
                                                isLoading2 ? <CircularProgress color="inherit" /> : "Change Password"
                                            }
                                        </Button>
                                    </div>
                                    <div className="col">
                                        <Button type='reset' className="custom-btn w-full" disabled={isLoading2}>Cancel</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Collapse >

        </>
    )
}

export default Profile
