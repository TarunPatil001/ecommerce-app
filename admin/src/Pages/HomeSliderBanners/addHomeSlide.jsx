import { Button, CircularProgress } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { IoClose } from 'react-icons/io5'
import UploadBox from '../../Components/UploadBox'
import { MyContext } from '../../App'
import { deleteImages, editData, fetchDataFromApi, postData } from '../../utils/api'
import toast from 'react-hot-toast'
import { RiResetLeftFill } from 'react-icons/ri'
import { IoIosSave } from 'react-icons/io'
import { FiEdit } from 'react-icons/fi'

const AddHomeSlide = () => {

  const context = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [homeSlideIdNo, setHomeSlideIdNo] = useState(null);

  // const [isLoading3, setIsLoading3] = useState(false);
  const [previews, setPreviews] = useState([]);

  const [formFields, setFormFields] = useState({
    images: [],
  });


  useEffect(() => {
    setFormFields((prev) => ({
      ...prev,
      images: previews, // Sync images with updated previews
    }));
  }, [previews]);


  useEffect(() => {
    const { homeSlideId } = context.isOpenFullScreenPanel || {};
    console.log("AddNewHomeSlidePage - HomeSlide ID :", homeSlideId);

    // Early return for new address (addressId is not present)
    if (!homeSlideId) {
      setHomeSlideIdNo(homeSlideId)
      setFormFields({
        images: [],
      });
      return; // Exit early if it's a new address
    }

    // If addressId is available (editing existing address)
    if (homeSlideId) {
      setHomeSlideIdNo(homeSlideId)
      console.log("Id Received");
      const fetchHomeSlideData = async () => {
        try {
          const response = await fetchDataFromApi(
            `/api/homeSlides/${homeSlideId}`);

          // Check if the response was successful
          if (response.success && response.data) {
            const homeSlide = response.data;
            console.log("Response Data:", homeSlide); // Log response to check status

            // Populate the form fields with the fetched data
            setPreviews(homeSlide?.images || []); // Update previews state
            setFormFields((prev) => ({
              ...prev,
              images: homeSlide?.images || [], // Set images directly
            }));

            console.log("Populated form fields:", homeSlide);
          }
          else {
            console.error("HomeSlide data not found or response unsuccessful.");
          }
        } catch (error) {
          console.error("Error fetching homeSlide:", error);
        }
      };

      fetchHomeSlideData();
    }
  }, [context, context.isOpenFullScreenPanel, setHomeSlideIdNo]);


  // Handle image previews update properly
  const setPreviewFun = (previeswArr) => {
    // Update the previews state, which will trigger re-render
    setPreviews(previeswArr);

    // Update formFields.images to reflect the preview updates
    setFormFields((prev) => ({
      ...prev,
      images: previeswArr,
    }));
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (previews?.length === 0) {
      context.openAlertBox("error", "Please select category image.");
      return;
    }

    setIsLoading(true);
    // Start a toast.promise for handling loading, success, and error states
    try {
      const result = await toast.promise(
        postData(`/api/homeSlides/add-homeSlide`, formFields), {
        loading: "Adding homeSlide... Please wait.",
        success: (res) => {
          if (res?.success) {
            context?.forceUpdate();
            return res.message || "HomeSlide added successfully!";
          } else {
            throw new Error(res?.message || "An unexpected error occurred.");
          }
        },
        error: (err) => {
          // Check if err.response exists, else fallback to err.message
          const errorMessage = err?.response?.data?.message || err.message || "Failed to add homeSlide. Please try again.";
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
        context.setIsOpenFullScreenPanel({ open: false, model: "Home Banner Details" });
      }, 500);
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (previews?.length === 0) {
      context.openAlertBox("error", "Please select homeSlide image.");
      return;
    }

    try {
      const result = await toast.promise(
        editData(`/api/homeSlides/${homeSlideIdNo}`, {
          ...formFields,
          homeSlideId: homeSlideIdNo,
        }, { withCredentials: true }),
        {
          loading: "Updating homeSlide... Please wait.",
          success: (res) => {
            if (res?.success) {
              context?.forceUpdate();
              return res.message || "HomeSlide updated successfully!";
            } else {
              throw new Error(res?.message || "An unexpected error occurred.");
            }
          },
          error: (err) => {
            const errorMessage = err?.response?.data?.message || err.message || "Failed to update homeSlide. Please try again.";
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
        context.setIsOpenFullScreenPanel({ open: false, model: "HomeSlide Details" });
      }, 500);
    }
  };



  const handleRemoveImage = async (image, index) => {
    try {
      // Confirm image is valid before attempting to delete
      if (!image) {
        throw new Error("Invalid image.");
      }

      // Attempt to delete the image from Cloudinary or backend
      const response = await deleteImages(`/api/homeSlides/delete-homeSlide-image?img=${image}`);

      if (response.success) {
        // If image is not found in Cloudinary, remove it from state
        if (!response.imageFound) {

          // Remove the image from the state
          const updatedImages = previews.filter((_, imgIndex) => imgIndex !== index);
          setPreviews(updatedImages);

          // Update formFields images as well (without mutating directly)
          setFormFields((prevFields) => ({
            ...prevFields,
            images: updatedImages,
          }));

          context.openAlertBox("error", "Image not found in Cloudinary, removed from state.");
        } else {
          // Image deleted successfully from Cloudinary, update state accordingly
          const updatedImages = previews.filter((_, imgIndex) => imgIndex !== index);
          setPreviews(updatedImages);

          // Update formFields images as well
          setFormFields((prevFields) => ({
            ...prevFields,
            images: updatedImages,
          }));

          context.openAlertBox("success", "Image removed successfully.");
        }
      } else {
        throw new Error(response.message || "Failed to remove image.");
      }
    } catch (error) {
      // Handle any errors during the removal
      console.error("Error removing image:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };


  // Refactored handleDiscard to ensure all images are removed properly
  const handleDiscard = () => {
    // Loop through the previews and delete each image from the server
    previews.forEach((image, index) => {
      handleRemoveImage(image, index);
    });

    // Reset the form and states
    setFormFields({ name: '', images: [] });
    setPreviews([]); // Clear the previews after images are removed
    console.log("Discard action, file cleared.");
  };




  return (
    <div>
      <section className='p-8'>
        <form action="#"
          onSubmit={handleFormSubmit}
          className='form py-3'>
          <h3 className='text-[24px] font-bold mb-2'>Create Home Slide Banner</h3>

          <h3 className="text-[18px] font-bold mb-2">Media & Images</h3>

          <div className="grid grid-cols-2 gap-2 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 pt-1 mb-4">
            <span className='opacity-50 col-span-full text-[14px]'>Choose a banner photo or simply drag and drop</span>

            {
              previews?.length !== 0 && previews.map((image, index) => {
                return (
                  <div className="border p-2 rounded-md flex flex-col items-center bg-white h-full relative" key={index}>
                    <span
                      className='absolute -top-[5px] -right-[5px] bg-white w-[15px] h-[15px] rounded-full border border-red-600 flex items-center justify-center cursor-pointer hover:scale-125 transition-all'
                      onClick={() => handleRemoveImage(image, index)}
                    >
                      <IoClose className='text-[15px] text-red-600' />
                    </span>
                    <div className='w-full h-[200px]'>
                      {
                        isLoading2 ? (
                          <CircularProgress color="inherit" />
                        ) : (
                          homeSlideIdNo === undefined ? (
                            <img src={image} alt="HomeSlide Image" className="w-full h-full object-cover rounded-md" />
                          ) : (
                            <img src={formFields.images[0]} alt="HomeSlide Image" className="w-full h-full object-cover rounded-md" />
                          )
                        )
                      }
                    </div>
                  </div>
                )
              })
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
                  url={"/api/homeSlides/upload-homeSlide-images"}
                  setPreviewFun={setPreviewFun}  // Pass function to handle preview in the parent
                />
              </div>
            )}


          </div>

          <div className='!overflow-x-hidden w-full h-[70px] fixed bottom-0 right-0 bg-white flex items-center justify-end px-10 gap-4 z-[49] border-t border-[rgba(0,0,0,0.1)] custom-shadow'>
            {
              homeSlideIdNo === undefined ? (
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

export default AddHomeSlide
