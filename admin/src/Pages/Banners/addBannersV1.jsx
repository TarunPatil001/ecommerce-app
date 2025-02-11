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

const AddBannersV1 = () => {

    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    // const [isLoading3, setIsLoading3] = useState(false);
    const [previews, setPreviews] = useState([]);

    const nameInputRef = useRef(null);
    const priceInputRef = useRef(null);
    const categorySelectRef = useRef(null);
    const categorySelectRef2 = useRef(null);
    const categorySelectRef3 = useRef(null);

    const [productCategory, setProductCategory] = useState('');
    const [productCategory2, setProductCategory2] = useState('');
    const [productCategory3, setProductCategory3] = useState('');
    const [alignInfo, setAlignInfo] = useState('');
    const [isLoadingReset1, setIsLoadingReset1] = useState(false);
    const [isLoadingSave1, setIsLoadingSave1] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]); // ✅ Ensures default is an empty array

    const [formFields, setFormFields] = useState({
        bannerTitle: '',
        images: [],
        parentCategoryId: '',
        subCategoryId: '',
        thirdSubCategoryId: '',
        price: '',
        alignInfo: '',
    });


    useEffect(() => {
        setFormFields((prev) => ({
            ...prev,
            images: previews, // Sync images with updated previews
        }));
    }, [previews]);


    useEffect(() => {
        const fetchBannerData = async () => {
            const bannerId = context.isOpenFullScreenPanel?.bannerId;

            console.log("Add Banner Id - BannerId:", bannerId);

            if (!bannerId) {
                console.log("No bannerId found, resetting state.");
                context.setBannerIdNo(undefined);
                setPreviews([]);
                setFormFields({
                    bannerTitle: '',
                    images: [],
                    parentCategoryId: '',
                    subCategoryId: '',
                    thirdSubCategoryId: '',
                    price: '',
                    alignInfo: '',
                });
                setProductCategory('');
                setProductCategory2('');
                setProductCategory3('');
                setFilteredCategories([]);
                setFilteredSubCategories([]);
                setAlignInfo('');
                return;
            }

            try {
                console.log("Fetching data for Banner ID:", bannerId);
                context.setBannerIdNo(bannerId);
                const response = await fetchDataFromApi(`/api/bannersV1/${bannerId}`);
                console.log("API Response:", response);

                if (response?.success && response?.data) {
                    const banner = response.data;
                    console.log("Banner Data:", banner);

                    setPreviews(banner.images || []);
                    setAlignInfo(banner.alignInfo || []);

                    setFormFields((prev) => ({
                        ...prev,
                        bannerTitle: banner.bannerTitle || "",
                        images: banner.images || [],
                        parentCategoryId: banner.parentCategoryId || "",
                        subCategoryId: banner.subCategoryId || "",
                        thirdSubCategoryId: banner.thirdSubCategoryId || "",
                        price: banner.price || "",
                        alignInfo: banner.alignInfo || "",
                    }));

                    // Automatically populate categories
                    setProductCategory(banner?.parentCategoryId || "");
                    setProductCategory2(banner?.subCategoryId || "");
                    setProductCategory3(banner?.thirdSubCategoryId || "");

                    // Set filtered categories based on existing selections
                    const selectedCategory = context?.catData?.find(cat => cat._id === banner?.parentCategoryId);
                    setFilteredCategories(selectedCategory?.children || []);

                    const selectedSubCategory = selectedCategory?.children?.find(cat => cat._id === banner?.subCategoryId);
                    setFilteredSubCategories(selectedSubCategory?.children || []);

                } else {
                    console.error("Banner data not found or response unsuccessful.");
                }
            } catch (error) {
                console.error("Error fetching banner:", error);
            }
        };

        fetchBannerData();

        return () => {
            console.log("Cleanup: Resetting banner-related states");
            setPreviews([]);
            setFormFields({
                bannerTitle: '',
                images: [],
                parentCategoryId: '',
                subCategoryId: '',
                thirdSubCategoryId: '',
                price: '',
            });
            setProductCategory('');
            setProductCategory2('');
            setProductCategory3('');
            setFilteredCategories([]);
            setFilteredSubCategories([]);
        };

    }, [context.isOpenFullScreenPanel?.bannerId]); // Depend only on `bannerId`



    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((formFields) => ({
            ...formFields,
            [name]: value,
        }));
    };


    const selectedCatFun = (categoryId, categoryName) => {
        setFormFields({
            ...formFields,
            categoryName: categoryName,
            parentCategoryId: categoryId,
        });
        setProductCategory(categoryId);
        setProductCategory2(""); // Reset second dropdown when first changes
        setProductCategory3(""); // Reset third dropdown when first changes

        // Find selected category and set its children for Level 2
        const selectedCategory = context?.catData?.find(cat => cat._id === categoryId);
        setFilteredCategories(selectedCategory?.children || []);
        setFilteredSubCategories([]); // Clear Level 3 when Level 1 changes
    };


    const selectedCatFun2 = (categoryId2, categoryName2) => {
        setFormFields((prev) => ({
            ...prev,
            subCategoryId: categoryId2,  // ✅ Make sure subCategoryId is set
        }));
        setProductCategory2(categoryId2);
        setProductCategory3(""); // Reset third dropdown when second changes

        const selectedSubCategory = filteredCategories.find(cat => cat._id === categoryId2);
        setFilteredSubCategories(selectedSubCategory?.children || []);
    };


    const selectedCatFun3 = (categoryId3, categoryName3) => {
        setFormFields((prev) => ({
            ...prev,
            thirdSubCategoryId: categoryId3,  // ✅ Ensure thirdSubCategoryId is set
        }));
        setProductCategory3(categoryId3);
    };


    const handleChangeProductCategory = (event) => {
        const selectedCategoryId = event.target.value;
        setProductCategory(selectedCategoryId);
        setProductCategory2(""); // Reset second dropdown when first changes
        setProductCategory3(""); // Reset third dropdown when first changes

        // Find selected category and set its children for Level 2
        const selectedCategory = context?.catData?.find(
            (cat) => cat._id === selectedCategoryId
        );
        setFilteredCategories(selectedCategory?.children || []);
        setFilteredSubCategories([]); // Reset Level 3 when Level 1 changes
    };


    const handleChangeProductCategory2 = (event) => {
        const selectedCategoryId2 = event.target.value;
        setProductCategory2(selectedCategoryId2);
        setProductCategory3(""); // Reset third dropdown when second changes

        // Find selected category and set its children for Level 3
        const selectedCategory2 = filteredCategories.find(
            (cat) => cat._id === selectedCategoryId2
        );
        setFilteredSubCategories(selectedCategory2?.children || []);
    };


    const handleChangeProductCategory3 = (event) => {
        const selectedCategoryId3 = event.target.value;
        if (filteredSubCategories.some(cat => cat._id === selectedCategoryId3)) {
            setProductCategory3(selectedCategoryId3);
        } else {
            setProductCategory3(""); // Reset if the value is invalid
        }
    };


    useEffect(() => {
        setFormFields((prev) => ({
            ...prev,
            parentCategoryId: productCategory,
            subCategoryId: productCategory2,
            thirdSubCategoryId: productCategory3,
        }));
    }, [productCategory, productCategory2, productCategory3]);


    const setPreviewFun = (previewArr) => {
        // Update the previews state to reflect the new image array
        setPreviews(previewArr);

        // Update formFields.images state properly without direct mutation
        setFormFields((prevFormFields) => ({
            ...prevFormFields,
            images: previewArr, // Assign the previewArr to images
        }));
    };


    const handleAlignInfoChange = (event) => {
        const value = event.target.value;
        setAlignInfo(value); // Update status in local state
        setFormFields((prevState) => ({
            ...prevState,
            alignInfo: value, // Update the form fields
        }));
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (formFields.bannerTitle === "") {
            context.openAlertBox("error", "Please enter Banner Title");
            nameInputRef.current?.focus();
            return;
        }

        if (formFields.price === "") {
            context.openAlertBox("error", "Please enter price");
            priceInputRef.current?.focus();
            return;
        }

        if (!productCategory) {
            context.openAlertBox("error", "Please select a parent category.");
            categorySelectRef.current?.focus();
            return;
        }

        if (!productCategory2) {
            context.openAlertBox("error", "Please select a 2nd-sub-category.");
            categorySelectRef2.current?.focus();
            return;
        }

        if (!productCategory3) {
            context.openAlertBox("error", "Please select a third-child-category.");
            categorySelectRef3.current?.focus();
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
                postData(`/api/bannersV1/add`, formFields), {
                loading: "Adding banners... Please wait.",
                success: (res) => {
                    if (res?.success) {
                        context?.forceUpdate();
                        return res.message || "Banner added successfully!";
                    } else {
                        throw new Error(res?.message || "An unexpected error occurred.");
                    }
                },
                error: (err) => {
                    // Check if err.response exists, else fallback to err.message
                    const errorMessage = err?.response?.data?.message || err.message || "Failed to add banner. Please try again.";
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
                context.setIsOpenFullScreenPanel({ open: false, model: "BannerV1 Details" });
            }, 500);
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (formFields.bannerTitle === "") {
            context.openAlertBox("error", "Please enter Banner Title");
            nameInputRef.current?.focus();
            return;
        }

        if (formFields.price === "") {
            context.openAlertBox("error", "Please enter price");
            priceInputRef.current?.focus();
            return;
        }

        if (!productCategory) {
            context.openAlertBox("error", "Please select a parent category.");
            categorySelectRef.current?.focus();
            return;
        }

        if (!productCategory2) {
            context.openAlertBox("error", "Please select a 2nd-sub-category.");
            categorySelectRef2.current?.focus();
            return;
        }

        if (!productCategory3) {
            context.openAlertBox("error", "Please select a third-child-category.");
            categorySelectRef3.current?.focus();
            return;
        }

        if (formFields.images.length === 0) {
            context.openAlertBox("error", "Please upload images");
            return;
        }


        try {
            const result = await toast.promise(
                editData(`/api/bannersV1/${context.bannerIdNo}`, {
                    ...formFields,
                    userId: context?.userData?._id,
                    bannerId: context.bannerIdNo,
                }),
                {
                    loading: "Updating banner... Please wait.",
                    success: (res) => {
                        if (res?.success) {
                            context?.forceUpdate();
                            return res.message || "Banner updated successfully!";
                        } else {
                            throw new Error(res?.message || "An unexpected error occurred.");
                        }
                    },
                    error: (err) => {
                        const errorMessage = err?.response?.data?.message || err.message || "Failed to update banner. Please try again.";
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
                context.setIsOpenFullScreenPanel({ open: false, model: "BannerV1 Details" });
            }, 500);
        }
    }

    // Banner Image Deletion Handling
    const handleRemoveImage = async (bannerImage, index) => {
        try {
            if (!bannerImage) {
                throw new Error("Invalid banner image.");
            }

            const bannerId = context.bannerIdNo; // Get banner ID properly
            let url = `/api/bannersV1/deleteImage?imgUrl=${encodeURIComponent(bannerImage)}`;

            if (bannerId) {
                // If updating, include bannerId in the API request
                url += `&bannerId=${bannerId}`;
                console.log("Removing banner image with bannerId:", bannerImage, "for banner:", bannerId);
            } else {
                console.log("Removing banner image without bannerId:", bannerImage);
            }

            const response = await deleteImages(url);

            if (response?.success) {
                // Remove the deleted image from the previews array
                setPreviews((prevPreviews) => {
                    const updatedPreviews = prevPreviews?.filter((_, i) => i !== index) || [];
                    return updatedPreviews;
                });

                // Update formFields state for banner image
                setFormFields((prevFields) => ({
                    ...prevFields,
                    bannerImage: null,
                }));

                console.log("Updated formFields after banner deletion:", formFields);
                toast.success("Banner image removed successfully.");
            } else {
                throw new Error(response?.message || "Failed to remove banner image.");
            }
        } catch (error) {
            console.error("Error removing banner image:", error);
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
                    <h3 className='text-[24px] font-bold mb-2'>{!context.bannerIdNo ? "Create New Banner" : "Edit Banner"}</h3>

                    <h3 className='text-[18px] font-bold mb-2'>Basic Information</h3>
                    <div className="grid grid-cols-3 gap-4 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 pt-1 mb-4">
                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Banner Title</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Content to display on banner...' name="bannerTitle" ref={nameInputRef} value={formFields?.bannerTitle || ''} onChange={onChangeInput} />
                        </div>

                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Align Info</h3>
                            <Select
                                size="small"
                                value={alignInfo}
                                onChange={handleAlignInfoChange}
                                className="w-full !text-[14px]"
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="" disabled>
                                    Where to align info?
                                </MenuItem>
                                <MenuItem value="right">Right</MenuItem>
                                <MenuItem value="left">Left</MenuItem>
                                {/* <MenuItem value="center">Center</MenuItem> */}
                            </Select>
                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Price</h3>
                            <input
                                type="number"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                                placeholder="Enter price"
                                min="0"
                                onKeyDown={(e) => {
                                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                        e.preventDefault();
                                    }
                                }}
                                name="price" value={formFields.price} onChange={onChangeInput} ref={priceInputRef}
                            />
                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Parent Category</h3>

                            <Select
                                labelId="productCategoryDropDownLabel"
                                id="productCategoryDropDown"
                                size="small"
                                value={productCategory}
                                onChange={handleChangeProductCategory}
                                className="w-full !text-[14px]"
                                displayEmpty
                                inputRef={categorySelectRef}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="" disabled>
                                    Select parent category
                                </MenuItem>
                                {
                                    context?.catData?.map((item) => (
                                        <MenuItem key={item._id} value={item._id} onClick={() => selectedCatFun(item._id, item.name)}>
                                            {item.name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>

                        </div>

                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Sub-Category (2<sup>nd</sup> Level)</h3>

                            <div className='flex gap-2'>

                                <Select
                                    labelId="productCategoryDropDownLabel2"
                                    id="productCategoryDropDown2"
                                    size="small"
                                    value={productCategory2}
                                    onChange={handleChangeProductCategory2} // Update second dropdown value
                                    className="w-full !text-[14px]"
                                    displayEmpty
                                    inputRef={categorySelectRef2}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="" disabled>
                                        Select sub-category (2<sup>nd</sup> Level)
                                    </MenuItem>

                                    {filteredCategories.length > 0 && filteredCategories.map((item2, index_) => (
                                        <MenuItem key={index_} value={item2._id} onClick={() => selectedCatFun2(item2._id, item2.name)}>
                                            {item2.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Child Category (3<sup>rd</sup> Level)</h3>

                            <div className='flex gap-2'>

                                <Select
                                    labelId="productCategoryDropDownLabel3" // FIXED: Unique ID
                                    id="productCategoryDropDown3" // FIXED: Unique ID
                                    size="small"
                                    value={productCategory3}
                                    onChange={handleChangeProductCategory3} // FIXED: Now correctly updates the third dropdown
                                    className="w-full !text-[14px]"
                                    displayEmpty
                                    inputRef={categorySelectRef3}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="" disabled>
                                        Select child category (3<sup>rd</sup> Level)
                                    </MenuItem>

                                    {filteredSubCategories.length > 0 && filteredSubCategories.map((item3, index__) => (
                                        <MenuItem key={index__} value={item3._id} onClick={() => selectedCatFun3(item3._id, item3.name)}>
                                            {item3.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>


                    <h3 className="text-[18px] font-bold mb-2">Media & Images</h3>
                    <div className="grid grid-cols-6 gap-2 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 pt-1 mb-4">
                        <span className='opacity-50 col-span-full text-[14px]'>
                            Choose a banner photo or simply drag and drop
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
                                                    context.bannerIdNo === undefined ? (
                                                        <img src={image} alt="BannerImage" className="w-full h-full object-cover rounded-md" />
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
                                    url={"/api/bannersV1/uploadBannerImages"}
                                    setPreviewFun={setPreviewFun}
                                />
                            </div>
                        )}

                    </div>

                    <div className='!overflow-x-hidden w-full h-[70px] fixed bottom-0 right-0 bg-white flex items-center justify-end px-10 gap-4 z-[49] border-t border-[rgba(0,0,0,0.1)] custom-shadow'>
                        {
                            context.bannerIdNo === undefined ? (
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

export default AddBannersV1
