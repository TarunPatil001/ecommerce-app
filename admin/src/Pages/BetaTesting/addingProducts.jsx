import React, { useState } from "react";
import { Button } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FaCloudUploadAlt } from "react-icons/fa";
import UploadBoxBeta from "../../Components/UploadBoxBeta";
import toast from "react-hot-toast";

const AddingProducts = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [removedFiles, setRemovedFiles] = useState([]);

    const [formFields, setFormFields] = useState({
        name: "",
        images: [],
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((prevFields) => ({
            ...prevFields,
            [name]: value,
        }));
    };

    const handleFileUpload = (files) => {
        if (!files || files.length === 0) return;
        const newFiles = Array.from(files);
        
        setUploadedFiles((prevFiles) => {
            const updatedFiles = [...prevFiles, ...newFiles];
            console.log("Uploaded Files:", updatedFiles);
            return updatedFiles;
        });
    };

    const handleRemoveFile = (index) => {
        setUploadedFiles((prevFiles) => {
            const updatedFiles = prevFiles.filter((_, i) => i !== index);
            console.log("Remaining Uploaded Files:", updatedFiles);
            return updatedFiles;
        });
    
        setRemovedFiles((prevRemoved) => {
            const removedFile = uploadedFiles[index]; // Get the file before updating state
            const updatedRemoved = [...prevRemoved, removedFile];
            console.log("Files marked for removal:", updatedRemoved);
            return updatedRemoved;
        });
    };
    
    

    const handleSave = () => {
        // console.log("Saving Product with Images:", uploadedFiles);
        // console.log("Files to be permanently deleted:", removedFiles);

        setRemovedFiles([]);
        toast.success("Product saved successfully!");
    };

    return (
        <section className="p-8">
            <form className="form py-3 p-0">
                <h3 className="text-[24px] font-bold mb-2">Create Product</h3>
                <div className="flex flex-col gap-4 border-2 border-dashed border-gray-300 bg-white rounded-md p-5 mb-5">
                    <h3 className="text-[14px] font-medium mb-1 text-gray-700">Product Name</h3>
                    <input
                        type="text"
                        className="w-full h-[40px] border border-gray-300 focus:outline-none rounded-md p-3 text-sm"
                        placeholder="Product title"
                        name="name"
                        value={formFields.name}
                        onChange={onChangeInput}
                    />
                </div>

                <div className="w-full px-0">
                    <h3 className="text-[18px] font-bold mb-2">Media & Images</h3>
                    <div className="grid grid-cols-8 gap-2 border-2 border-dashed border-gray-300 rounded-md p-5 pt-1 mb-4">
                        <span className="opacity-50 col-span-full text-[14px]">
                            Choose a product photo or drag and drop
                        </span>

                        {uploadedFiles.map((file, index) => (
                            <div
                                key={file.name || index}
                                className="border p-2 rounded-md flex flex-col items-center bg-white h-[150px] relative"
                            >
                                <span
                                    className="absolute -top-[5px] -right-[5px] bg-white w-[15px] h-[15px] rounded-full border border-red-600 flex items-center justify-center cursor-pointer hover:scale-125 transition-all"
                                    onClick={() => handleRemoveFile(index)}
                                >
                                    <IoClose className="text-[15px] text-red-600" />
                                </span>
                                <div className="w-full h-[100px]">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`uploaded-${index}`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                                <p className="text-[14px] text-center mt-2 line-clamp-1 overflow-hidden">
                                    {file.name}
                                </p>
                            </div>
                        ))}

                        <div className={uploadedFiles.length > 0 ? "" : "col-span-8"}>
                            <UploadBoxBeta multiple={true} onDrop={handleFileUpload} />
                        </div>
                        <p className="text-sm mt-2 text-gray-600 col-span-full">
                            {uploadedFiles.length > 0
                                ? `Files uploaded: ${uploadedFiles.length}`
                                : "No files uploaded yet."}
                        </p>
                    </div>
                </div>

                <div className="w-full h-[70px] fixed bottom-0 right-0 bg-white flex items-center justify-end px-10 gap-4 z-[49] border-t border-gray-300">
                    <Button
                        type="button"
                        className="!bg-red-500 !text-white w-[150px] h-[40px] flex items-center justify-center gap-2"
                    >
                        <FaCloudUploadAlt className="text-[20px]" />
                        Discard
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        className="custom-btn w-[150px] h-[40px] flex items-center justify-center gap-2"
                    >
                        <FaCloudUploadAlt className="text-[20px]" />
                        Save
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddingProducts;
