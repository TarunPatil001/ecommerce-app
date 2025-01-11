import { useDropzone } from "react-dropzone";
import { FaRegImages } from "react-icons/fa6";

const UploadBox = (props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    multiple: props.multiple !== undefined ? props.multiple : false,
    onDrop: (acceptedFiles) => {
      // Pass the valid dropped files to the parent component
      if (props.onDrop) {
        props.onDrop(acceptedFiles);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`uploadBox p-3 rounded-md overflow-hidden border-2 border-dashed 
        ${isDragActive ? "border-blue-500" : "border-gray-300"} 
        hover:border-blue-300 w-full h-[150px] bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all 
        flex flex-col items-center justify-center relative`}
    >
      <FaRegImages className="text-[40px] opacity-35 relative" />
      <h4 className="text-[14px] text-center font-medium">
        Drop your image here or{" "}
        <span className="text-blue-500">click to browse</span>
      </h4>
      <input
        {...getInputProps()}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-50"
      />
    </div>
  );
};

export default UploadBox;
