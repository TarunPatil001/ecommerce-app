import { useDropzone } from "react-dropzone";
import { FaRegImages } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { uploadImagePost } from "../../utils/api";
import { useState } from "react";
import { CircularProgress } from '@mui/material';

const UploadBox = (props) => {
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    multiple: props.multiple !== undefined ? props.multiple : false,
    onDrop: (acceptedFiles) => {
      // This onDrop will just trigger the onChangeFile function for uploading
      if (acceptedFiles && acceptedFiles.length > 0) {
        acceptedFiles.forEach((file) => {
          // Simulate the file change event for each dropped file
          onChangeFile({ target: { files: [file] } }, props.url);
        });
      }
    },
  });
  
  // Image Upload Handling (with re-fetch)
  const onChangeFile = async (e, apiEndPoint) => {
    try {
        const files = e.target.files;
        if (!files || files.length === 0) {
            throw new Error("No file selected.");
        }

        const validFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        let invalidFileFound = false;
        const formData = new FormData();
        const previewUrls = [];

        for (let i = 0; i < files.length; i++) {
            if (!validFormats.includes(files[i].type)) {
                invalidFileFound = true;
                break;
            }
            previewUrls.push(URL.createObjectURL(files[i])); // Generate preview
            formData.append(props?.name, files[i]);
        }

        if (invalidFileFound) {
            toast.error("Please select valid image formats (JPEG/JPG/PNG/WEBP).");
            return;
        }

        if (props?.productId) {
            formData.append("productId", props?.productId);
        }

        setIsLoading(true);

        const result = await toast.promise(
            (async () => {
                const response = await uploadImagePost(apiEndPoint, formData);

                if (response?.images) {
                    // Check for duplicates before adding new images to preview
                    const existingImageUrls = new Set(props?.images || []);
                    const newImages = response.images.filter((url) => !existingImageUrls.has(url));

                    // Ensure you are adding only unique URLs to the previews
                    const updatedPreviews = [...props.images, ...newImages];

                    // Update preview in parent
                    props.setPreviewFun(updatedPreviews); 

                    return response?.data?.message || "Images uploaded successfully!";
                } else {
                    throw new Error("Failed to upload images.");
                }
            })(),
            {
                loading: "Uploading image... Please wait.",
                success: (message) => message,
                error: (err) => err?.response?.data?.message || err.message || "An error occurred while uploading your image.",
            }
        );

        console.log("Result:", result);
    } catch (error) {
        console.error("Error while uploading file:", error);
    } finally {
        setIsLoading(false);
    }
};




  
  return (
    <div
      {...getRootProps()}
      className={`uploadBox p-3 rounded-md overflow-hidden border-2 border-dashed 
        ${isDragActive ? "border-blue-500" : "border-gray-300"} 
        hover:border-blue-300  h-[200px] bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all 
        flex flex-col items-center justify-center relative`}
    >
      {
        isLoading ?
          <>
            <CircularProgress color="inherit" />
            <h4 className="text-[14px] text-center font-medium">
              <span className="text-blue-500">Uploading...</span>
            </h4>
          </>
          :
          <>
            <FaRegImages className="text-[40px] opacity-35 relative" />
            <h4 className="text-[14px] text-center font-medium">
              Drop your image here or{" "}
              <span className="text-blue-500">click to browse</span>
            </h4>
            <input
              {...getInputProps()}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-50"
              type="file"
              accept="image/*"
              onChange={(e) => onChangeFile(e, props?.url)}
              name={props?.name}
              multiple={props.multiple} // This allows both single and multiple file selection
            />
          </>
      }

    </div>
  );
};

export default UploadBox;
