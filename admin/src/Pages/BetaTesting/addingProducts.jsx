import { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FaCloudUploadAlt } from "react-icons/fa";
import UploadBoxBeta from "../../Components/UploadBoxBeta";
import toast from "react-hot-toast";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const AddingProducts = () => {
  const context = useContext(MyContext);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [formFields, setFormFields] = useState({
    name: "",
    images: [],
  });

  // Reset removedFiles when the full-screen panel is closed
  useEffect(() => {
    if (!context?.isOpenFullScreenPanel?.open) {
      setRemovedFiles([]);
      console.log("Removed files reset due to panel close.");
    }
  }, [context?.isOpenFullScreenPanel?.open]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    // Prevent duplicate file uploads
    const filteredFiles = newFiles.filter(
      (file) => !uploadedFiles.some((existingFile) => existingFile.name === file.name)
    );

    if (filteredFiles.length === 0) {
      toast.error("Duplicate files are not allowed.");
      return;
    }

    const newPreviewUrls = filteredFiles.map((file) => URL.createObjectURL(file));

    setPreviews((prev) => [...prev, ...newPreviewUrls]);
    setUploadedFiles((prev) => {
      console.log("Files uploaded:", [...prev, ...filteredFiles]);
      return [...prev, ...filteredFiles];
    });
  };

  const handleRemoveImage = (index) => {
    setRemovedFiles((prev) => {
      const updatedRemovedFiles = [...prev, uploadedFiles[index]];
      console.log("Files removed:", updatedRemovedFiles);
      return updatedRemovedFiles;
    });

    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });

    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  
  
  const handleSave = async () => {
    try {
        const productName = formFields.name.trim();
        if (!productName) {
            context.openAlertBox("error", "Product name is required.");
            return;
        }

        const userId = context?.userData?._id; // ✅ Get userId from context
        if (!userId) {
            toast.error("User ID not found. Please log in again.");
            return;
        }

        let formData = new FormData();

        // 🛑 Ensure files are being added to FormData correctly
        if (uploadedFiles.length === 0) {
            toast.error("At least one image is required.");
            return;
        }

        uploadedFiles.forEach((file, index) => {
            console.log(`📤 Appending file ${index + 1}:`, file.name);
            formData.append("images", file);
        });

        formData.append("name", productName);
        formData.append("userId", userId); // ✅ Attach userId to request

        // ✅ Debugging: Log FormData content
        for (let pair of formData.entries()) {
            console.log(`📝 FormData -> ${pair[0]}:`, pair[1]);
        }

        const result = await toast.promise(
            postData("/api/betaProduct/create-product", formData),
            {
                loading: "Saving product... Please wait.",
                success: (res) => {
                    if (res?.success) {
                        context?.forceUpdate();
                        setTimeout(() => {
                            context.setIsOpenFullScreenPanel({ open: false, model: "Product Details" });
                        }, 500);
                        return res.message || "Product saved successfully!";
                    } else {
                        throw new Error(res?.message || "An unexpected error occurred.");
                    }
                },
                error: (err) => err?.response?.data?.message || err.message || "Failed to save product. Please try again.",
            }
        );

        console.log("✅ Result:", result);
    } catch (err) {
        console.error("❌ Error:", err);
        toast.error(err?.message || "An unexpected error occurred.");
    }
};

  

  


  return (
    <section className="p-8">
      <form className="form py-3 p-0">
        <h3 className="text-[24px] font-bold mb-2">Create Product</h3>

        {/* Product Name Input */}
        <div className="flex flex-col gap-4 border-2 border-dashed border-gray-300 bg-white rounded-md p-5 mb-5">
          <h3 className="text-[14px] font-medium text-gray-700">Product Name</h3>
          <input
            type="text"
            className="w-full h-[40px] border border-gray-300 focus:outline-none rounded-md p-3 text-sm"
            placeholder="Product title"
            name="name"
            value={formFields.name}
            onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
          />
        </div>

        {/* Image Upload Section */}
        <div className="w-full px-0">
          <h3 className="text-[18px] font-bold mb-2">Media & Images</h3>
          <div className="grid grid-cols-8 gap-2 border-2 border-dashed border-gray-300 rounded-md p-5 pt-1 mb-4">
            <span className="opacity-50 col-span-full text-[14px]">
              Choose a product photo or drag and drop
            </span>

            {uploadedFiles.map((file, index) => (
              <div
                key={file.name}
                className="border p-2 rounded-md flex flex-col items-center bg-white h-[150px] relative"
              >
                <span
                  className="absolute -top-[5px] -right-[5px] bg-white w-[15px] h-[15px] rounded-full border border-red-600 flex items-center justify-center cursor-pointer hover:scale-125 transition-all"
                  onClick={() => handleRemoveImage(index)}
                >
                  <IoClose className="text-[15px] text-red-600" />
                </span>
                <div className="w-full h-[100px]">
                  <img
                    src={previews[index]}
                    alt={`uploaded-${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <p className="text-[14px] text-center mt-2 line-clamp-1 overflow-hidden">
                  {file.name}
                </p>
              </div>
            ))}

            {/* Upload Box */}
            <div className={uploadedFiles.length > 0 ? "" : "col-span-8"}>
              <UploadBoxBeta multiple={true} onFileChange={handleFileChange} />
            </div>

            {/* File Status */}
            <p className="text-sm mt-2 text-gray-600 col-span-full">
              {uploadedFiles.length > 0
                ? `Files uploaded: ${uploadedFiles.length}`
                : "No files uploaded yet."}
            </p>
          </div>
        </div>

        {/* Save & Discard Buttons */}
        <div className="w-full h-[70px] fixed bottom-0 right-0 bg-white flex items-center justify-end px-10 gap-4 z-[49] border-t border-gray-300">
          <Button className="!bg-red-500 !text-white w-[150px] h-[40px]">
            <FaCloudUploadAlt className="text-[20px]" />
            Discard
          </Button>
          <Button onClick={handleSave} className="custom-btn w-[150px] h-[40px]">
            <FaCloudUploadAlt className="text-[20px]" />
            Save
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddingProducts;
