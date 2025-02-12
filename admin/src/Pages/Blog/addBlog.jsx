import { Button, CircularProgress, MenuItem, Select } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FiEdit } from 'react-icons/fi';
import { IoIosSave } from 'react-icons/io';
import { RiResetLeftFill } from 'react-icons/ri';
import UploadBox from '../../Components/UploadBox';
import { IoClose } from 'react-icons/io5';
import { MyContext } from '../../App';
import toast from 'react-hot-toast';
import { deleteImages, editData, fetchDataFromApi, postData } from '../../utils/api';

const AddBlog = () => {

    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [previews, setPreviews] = useState([]);

    const titleInputRef = useRef(null);
    const descriptionInputRef = useRef(null);

    const [formFields, setFormFields] = useState({
        title: '',
        images: [],
        description: '',
    });


    useEffect(() => {
        setFormFields((prev) => ({
            ...prev,
            images: previews, // Sync images with updated previews
        }));
    }, [previews]);


    useEffect(() => {
        const fetchBlogData = async () => {
            const blogId = context.isOpenFullScreenPanel?.blogId;

            console.log("Add Blog Id - BlogId:", blogId);

            if (!blogId) {
                console.log("No blogId found, resetting state.");
                context.setBlogIdNo(undefined);
                setPreviews([]);
                setFormFields({
                    title: '',
                    images: [],
                    description: '',
                });
                return;
            }

            try {
                console.log("Fetching data for Blog ID:", blogId);
                context.setBlogIdNo(blogId);
                const response = await fetchDataFromApi(`/api/blog/${blogId}`);
                console.log("API Response:", response);

                if (response?.success && response?.data) {
                    const blog = response.data;
                    console.log("Blog Data:", blog);

                    setPreviews(blog.images || []);

                    setFormFields((prev) => ({
                        ...prev,
                        title: blog.title || "",
                        images: blog.images || [],
                        description: blog.description || "",
                    }));

                } else {
                    console.error("Blog data not found or response unsuccessful.");
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };

        fetchBlogData();

        return () => {
            console.log("Cleanup: Resetting blog-related states");
            setPreviews([]);
            setFormFields({
                title: '',
                images: [],
                description: '',
            });
        };

    }, [context.isOpenFullScreenPanel?.blogId]); // Depend only on `blogId`



    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((formFields) => ({
            ...formFields,
            [name]: value,
        }));
    };


    const setPreviewFun = (previewArr) => {
        // Update the previews state to reflect the new image array
        setPreviews(previewArr);

        // Update formFields.images state properly without direct mutation
        setFormFields((prevFormFields) => ({
            ...prevFormFields,
            images: previewArr, // Assign the previewArr to images
        }));
    };



    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (formFields.title === "") {
            context.openAlertBox("error", "Please enter Blog Title");
            titleInputRef.current?.focus();
            return;
        }

        if (formFields.description === "") {
            context.openAlertBox("error", "Please enter description");
            descriptionInputRef.current?.focus();
            return;
        }


        if (formFields.images.length === 0) {
            context.openAlertBox("error", "Please upload images");
            return;
        }

        setIsLoading(true);
        // Start a toast.promise for handling loading, success, and error states
        try {
            const result = await toast.promise(
                postData(`/api/blog/add`, formFields), {
                loading: "Adding banners... Please wait.",
                success: (res) => {
                    if (res?.success) {
                        context?.forceUpdate();
                        return res.message || "Blog added successfully!";
                    } else {
                        throw new Error(res?.message || "An unexpected error occurred.");
                    }
                },
                error: (err) => {
                    // Check if err.response exists, else fallback to err.message
                    const errorMessage = err?.response?.data?.message || err.message || "Failed to add blog. Please try again.";
                    return errorMessage;
                },
            }
            );
            console.log("Result:", result);
        } catch (err) {
            console.error("Error:", err);
            toast.error(err?.message || "An unexpected error occurred.");
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                context.setIsOpenFullScreenPanel({ open: false, model: "Blog Details" });
            }, 500);
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (formFields.title === "") {
            context.openAlertBox("error", "Please enter Blog Title");
            titleInputRef.current?.focus();
            return;
        }

        if (formFields.description === "") {
            context.openAlertBox("error", "Please enter description");
            descriptionInputRef.current?.focus();
            return;
        }


        if (formFields.images.length === 0) {
            context.openAlertBox("error", "Please upload images");
            return;
        }


        try {
            const result = await toast.promise(
                editData(`/api/blog/${context.blogIdNo}`, {
                    ...formFields,
                    userId: context?.userData?._id,
                    blogId: context.blogIdNo,
                }),
                {
                    loading: "Updating blog... Please wait.",
                    success: (res) => {
                        if (res?.success) {
                            context?.forceUpdate();
                            return res.message || "Blog updated successfully!";
                        } else {
                            throw new Error(res?.message || "An unexpected error occurred.");
                        }
                    },
                    error: (err) => {
                        const errorMessage = err?.response?.data?.message || err.message || "Failed to update blog. Please try again.";
                        return errorMessage;
                    },
                }
            );

            console.log("Update Result:", result);
        } catch (err) {
            console.error("Error in handleUpdate:", err);
            toast.error(err?.message || "An unexpected error occurred.");
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                context.setIsOpenFullScreenPanel({ open: false, model: "Blog Details" });
            }, 500);
        }
    }

    // Blog Image Deletion Handling
    const handleRemoveImage = async (blogImage, index) => {
        try {
            if (!blogImage) {
                throw new Error("Invalid blog image.");
            }

            const blogId = context.blogIdNo; // Get blog ID properly
            let url = `/api/blog/deleteImage?imgUrl=${encodeURIComponent(blogImage)}`;

            if (blogId) {
                // If updating, include blogId in the API request
                url += `&blogId=${blogId}`;
                console.log("Removing blog image with blogId:", blogImage, "for blog:", blogId);
            } else {
                console.log("Removing blog image without blogId:", blogImage);
            }

            const response = await deleteImages(url);

            if (response?.success) {
                // Remove the deleted image from the previews array
                setPreviews((prevPreviews) => {
                    const updatedPreviews = prevPreviews?.filter((_, i) => i !== index) || [];
                    return updatedPreviews;
                });

                // Update formFields state for blog image
                setFormFields((prevFields) => ({
                    ...prevFields,
                    blogImage: null,
                }));

                console.log("Updated formFields after blog deletion:", formFields);
                toast.success("Blog image removed successfully.");
            } else {
                throw new Error(response?.message || "Failed to remove blog image.");
            }
        } catch (error) {
            console.error("Error removing blog image:", error);
            toast.error(error?.message || "An unexpected error occurred.");
        }
    };



    const handleDiscard = () => { }


    return (
        <div>
            <section className='p-8'>
                <form
                    action="#"
                    onSubmit={handleFormSubmit}
                    className='form py-3'>
                    <h3 className='text-[24px] font-bold mb-2'>{!context.blogIdNo ? "Create New Blog" : "Edit Blog"}</h3>

                    <h3 className='text-[18px] font-bold mb-2'>Basic Information</h3>
                    <div className="grid grid-cols-3 gap-4 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 pt-1 mb-4">
                        <div className='col col-span-full'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Blog Title</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Blog heading' name="title" ref={titleInputRef} value={formFields?.title || ''} onChange={onChangeInput} />
                        </div>

                        <div className='col col-span-full'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Blog Description</h3>
                            <textarea type="text" rows={4} className='w-full border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Blog description' name="description" ref={descriptionInputRef} value={formFields?.description || ''} onChange={onChangeInput} />
                        </div>


                    </div>


                    <h3 className="text-[18px] font-bold mb-2">Media & Images</h3>
                    <div className="grid grid-cols-6 gap-2 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 pt-1 mb-4">
                        <span className='opacity-50 col-span-full text-[14px]'>
                            Choose a blog photo or simply drag and drop
                        </span>

                        {
                            previews?.length !== 0 && previews.map((image, index) => {
                                return (
                                    <div className="border p-2 rounded-md flex flex-col items-center bg-white h-full relative" key={index}>
                                        <span
                                            className='absolute -top-[5px] -right-[5px] bg-white w-[15px] h-[15px] rounded-full border border-red-600 flex items-center justify-center cursor-pointer hover:scale-125 transition-all'
                                            onClick={() => handleRemoveImage(image, index)}
                                        >
                                            <IoClose className='text-[15px] text-red-600 bg' />
                                        </span>
                                        <div className='w-full h-[200px]'>
                                            {
                                                isLoading2 ? (
                                                    <CircularProgress color="inherit" />
                                                ) : (
                                                    context.blogIdNo === undefined ? (
                                                        <img src={image} alt="BlogImage" className="w-full h-full object-cover rounded-md" />
                                                    ) : (
                                                        <img src={formFields.images[0]} alt="CategoryImage" className="w-full h-full object-cover rounded-md" />
                                                    )
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            )
                        }


                        {previews?.length === 0 && (
                            <div className="col-span-8">
                                <UploadBox
                                    multiple={false}
                                    images={previews}
                                    onDrop={(acceptedFiles) => {
                                        const previewUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
                                        setPreviewFun(previewUrls);
                                    }}
                                    name="images"
                                    url={"/api/blog/uploadBlogImages"}
                                    setPreviewFun={setPreviewFun}
                                />
                            </div>
                        )}

                    </div>

                    <div className='!overflow-x-hidden w-full h-[70px] fixed bottom-0 right-0 bg-white flex items-center justify-end px-10 gap-4 z-[49] border-t border-[rgba(0,0,0,0.1)] custom-shadow'>
                        {
                            context.blogIdNo === undefined ? (
                                <>
                                    <Button
                                        type="reset"
                                        onClick={handleDiscard}
                                        className={`${isLoading2 === true ? "!bg-red-300" : "!bg-red-500"} !text-white w-[150px] h-[40px] flex items-center justify-center gap-2`} disabled={isLoading2}
                                    >
                                        {
                                            isLoading2 ? <CircularProgress color="inherit" /> : <><RiResetLeftFill className='text-[20px]' />Discard</>
                                        }
                                    </Button>
                                    <Button type='submit' className={`${isLoading === true ? "custom-btn-disabled" : "custom-btn"}  w-[150px] h-[40px] flex items-center justify-center gap-2`} disabled={isLoading}>
                                        {
                                            isLoading ? <CircularProgress color="inherit" /> : <><IoIosSave className='text-[20px]' />Create</>
                                        }
                                    </Button>
                                </>
                            ) : (
                                <Button type='submit' className={`${isLoading === true ? "custom-btn-update-disabled" : "custom-btn-update"}  w-[150px] h-[40px] flex items-center justify-center gap-2`} disabled={isLoading} onClick={handleUpdate}>
                                    {
                                        isLoading ? <CircularProgress color="inherit" /> : <><FiEdit className='text-[20px]' />Update</>
                                    }
                                </Button>
                            )
                        }

                    </div>
                </form>
            </section>
        </div>
    )
}

export default AddBlog
