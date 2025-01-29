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

  const formData = new FormData();

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      setPreviews([]);
      const file = e.target.files[0];
      if (!file) {
        throw new Error("No file selected.");
      }

      const validFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validFormats.includes(file.type)) {
        throw new Error("Please select a valid image (JPEG/JPG/PNG/WEBP).");
      }

      formData.append(props?.name, file);

      setIsLoading(true);

      const result = await toast.promise(
        (async () => {
          const response = await uploadImagePost(apiEndPoint, formData);

          if (response?.images) {
            props.setPreviewFun(response?.images); // Pass back the preview images to the parent
            return "Image uploaded successfully!";
          } else {
            throw new Error("Failed to upload images.");
          }
        })(),
        {
          loading: "Uploading image... Please wait.",
          success: (message) => message,
          error: (err) => {
            const errorMessage =
              err?.response?.data?.message ||
              err.message ||
              "An error occurred while uploading your image.";
            return errorMessage;
          },
        }
      );

      console.log("Result:", result); // Log the success message
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
        hover:border-blue-300 w-full h-[150px] bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all 
        flex flex-col items-center justify-center relative`}
    >
      {
        isLoading ?
          <CircularProgress color="inherit" />
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
            />
          </>
      }

    </div>
  );
};

export default UploadBox;
