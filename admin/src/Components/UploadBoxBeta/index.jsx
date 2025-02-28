import { useDropzone } from "react-dropzone";
import { FaRegImages } from "react-icons/fa6";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const UploadBoxBeta = ({ multiple, onFileChange, name }) => {
    const [isLoading, setIsLoading] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/gif": [],
            "image/webp": [],
        },
        multiple: multiple ?? false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileChange({ target: { files: acceptedFiles } });
            }
        },
    });

    return (
        <div
            {...getRootProps()}
            className={`uploadBoxBeta p-3 rounded-md overflow-hidden border-2 border-dashed 
            ${isDragActive ? "border-blue-500" : "border-gray-300"} 
            hover:border-blue-300 h-[150px] bg-white cursor-pointer hover:bg-gray-100 transition-all 
            flex flex-col items-center justify-center relative`}
        >
            {isLoading ? (
                <>
                    <CircularProgress color="inherit" />
                    <h4 className="text-[14px] text-center font-medium">
                        <span className="text-blue-500">Uploading...</span>
                    </h4>
                </>
            ) : (
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
                        name={name}
                        multiple={multiple}
                        onChange={onFileChange}
                    />
                </>
            )}
        </div>
    );
};

UploadBoxBeta.propTypes = {
    multiple: PropTypes.bool,
    onFileChange: PropTypes.func.isRequired,
    name: PropTypes.string,
};

export default UploadBoxBeta;
