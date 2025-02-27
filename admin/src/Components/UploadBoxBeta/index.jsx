import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FaRegImages } from 'react-icons/fa6';

const UploadBoxBeta = (props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    multiple: props.multiple !== undefined ? props.multiple : false,
    onDrop: (acceptedFiles) => {
      // Pass the dropped files to the parent component through the callback
      if (props.onDrop) {
        props.onDrop(acceptedFiles);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`uploadBox p-3 rounded-md overflow-hidden border-2 border-dashed 
        ${isDragActive ? 'border-blue-500' : 'border-[rgba(0,0,0,0.2)]'} 
        hover:border-[rgba(0,0,255,0.3)] w-full h-[150px] bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all 
        flex flex-col items-center justify-center  relative`}
    >
      <FaRegImages className="text-[40px] opacity-35 relative" />
      <h4 className="text-[14px] text-center font-medium">
        Drop your image here or <span className="text-blue-500">click to browse</span>
      </h4>
      <input {...getInputProps()} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-50" />
    </div>
  );
};

export default UploadBoxBeta;
