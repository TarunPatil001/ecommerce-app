import  { useContext, useEffect, useState } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiUpload } from 'react-icons/fi'
import { FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa'
import { IoMdHeart } from 'react-icons/io'
import { IoBagCheck } from 'react-icons/io5'
import { TbLogout } from 'react-icons/tb'
import { MyContext } from '../../App'
import { fetchDataFromApi, uploadImage } from '../../utils/api'
import toast from 'react-hot-toast'

const AccountSidebar = () => {

    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);  // Preview for image before uploading
    const [avatar, setAvatar] = useState(null);  // Actual avatar URL fetched from the server
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Directly set the avatar URL from context if available
        if (context?.userData?.avatar) {
            setAvatar(context?.userData?.avatar);
            setPreview(context?.userData?.avatar); // Set preview to the same value initially
        }
    }, [context?.userData?.avatar]); // Re-fetch when only the avatar in context changes



    const onChangeFile = async (e, apiEndPoint) => {
        try {
            // Toast promise to handle loading, success, and error states
            const result = await toast.promise(
                (async () => {
                    const file = e.target.files[0];  // Get the selected file
                    if (!file) {
                        throw new Error("No file selected.");
                    }
    
                    const validFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
                    console.log("File type:", file.type);  // Debug file type
    
                    if (!validFormats.includes(file.type)) {
                        throw new Error("Please select a valid image (JPEG/JPG/PNG/WEBP).");
                    }
    
                    const formData = new FormData();
                    formData.append("avatar", file);  // Append file to FormData
    
                    setUploading(true);
    
                    const previewUrl = URL.createObjectURL(file);
                    setPreview(previewUrl);  // Temporary preview before upload
    
                    // Call the API for image upload
                    const response = await uploadImage(apiEndPoint, formData);
                    console.log("API Response Debug:", response);  // Debug API response
    
                    if (response?.avatar) {
                        setAvatar(response.avatar);  // Set the avatar URL to the state
                        setPreview(response.avatar);  // Update preview with the uploaded avatar
                        context?.forceUpdate();  // Trigger UI re-render
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
    
            console.log("Result:", result);  // Log success message
    
        } catch (error) {
            console.error("Error while uploading file:", error);
            setUploading(false);  // Stop spinner on error
        } finally {
            setUploading(false);  // Always stop spinner when the upload is complete (success or failure)
        }
    };
    
    

    const logout = () => {

        fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accessToken')}`, { withCredentials: true }).then((res) => {
            if (res?.error === false) {
                context.setIsLogin(false);
                localStorage.clear();
                navigate("/");
            }
        })
    }


    return (
        <>
            <div className="col-1 w-[20%]">
                <div className="card bg-white shadow-md rounded-md sticky top-20">
                    <div className="w-full p-5 flex items-center justify-center flex-col">
                        <div className='w-[110px] h-[110px] border p-1 relative rounded-full overflow-hidden shadow-xl flex items-center justify-center mb-2'>
                            <div className="w-full h-full overflow-hidden group rounded-full shadow relative flex items-center justify-center bg-gray-300">
                                {uploading ? (
                                    <CircularProgress color="inherit" /> // Show spinner while uploading
                                ) : (
                                    <img
                                        src={preview || avatar || `https://static-00.iconduck.com/assets.00/profile-default-icon-1024x1023-4u5mrj2v.png`} // Use preview if available, else use avatar or default image
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="overlay w-full h-full absolute top-0 left-0 z-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center opacity-0 rounded-full group-hover:opacity-100 duration-300 transition-all">
                                    <FiUpload className="text-white text-[22px] group-hover:scale-125 duration-300 transition-all" />
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="absolute top-0 left-0 w-full h-full opacity-0 rounded-full cursor-pointer border-2"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={(e) => onChangeFile(e, "/api/user/user-avatar")} // Call the function to upload the avatar
                                    />
                                </div>
                            </div>

                        </div>
                        <h3 className="font-bold text-[16px] line-clamp-1">{context?.userData?.name}</h3>
                        <h6 className="text-[13px] font-medium">{context?.userData?.email}</h6>
                    </div>
                    <ul className="list-none pb-5 bg-[#f1f1f1] myAccountTabs">
                        <li className="w-full">
                            <NavLink to="/my-account" exact={true} activeClassName="isActive">
                                <Button className="!py-2 flex items-center !text-left !justify-start gap-2 w-full !rounded-none !capitalize !text-[rgba(0,0,0,0.8)] !text-[16px]"><FaUserCircle className="text-[20px]" />My Account</Button>
                            </NavLink>
                        </li>
                        <li className="w-full">
                            <NavLink to="/my-addresses" exact={true} activeClassName="isActive">
                                <Button className="!py-2 flex items-center !text-left !justify-start gap-2 w-full !rounded-none !capitalize !text-[rgba(0,0,0,0.8)] !text-[16px]"><FaMapMarkerAlt className="text-[20px]" />Addresses</Button>
                            </NavLink>
                        </li>
                        <li className="w-full">
                            <NavLink to="/my-orders" exact={true} activeClassName="isActive">
                                <Button className="!py-2 flex items-center !text-left !justify-start gap-2 w-full !rounded-none !capitalize !text-[rgba(0,0,0,0.8)] !text-[16px]"><IoBagCheck className="text-[20px]" />Orders</Button>
                            </NavLink>
                        </li>
                        <li className="w-full">
                            <NavLink to="/my-wishlist" exact={true} activeClassName="isActive">
                                <Button className="!py-2 flex items-center !text-left !justify-start gap-2 w-full !rounded-none !capitalize !text-[rgba(0,0,0,0.8)] !text-[16px]"><IoMdHeart className="text-[20px]" />Wishlist</Button>
                            </NavLink>
                        </li>
                        <li className="w-full">
                            <Button className="!py-2 flex items-center !text-left !justify-start gap-2 w-full !rounded-none !capitalize !text-[rgba(0,0,0,0.8)] !text-[16px]" onClick={logout}><TbLogout className="text-[20px]" />Logout</Button>
                        </li>

                    </ul>
                </div>
            </div>
        </>
    )
}

export default AccountSidebar
