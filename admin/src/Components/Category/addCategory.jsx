import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import UploadBox from '../UploadBox';
import { IoClose } from 'react-icons/io5';

const AddCategory = () => {
  const formRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null); // Use a single state to store the uploaded file

  // Handle file upload and log the new file
  const handleFileUpload = (files) => {
    if (files.length > 0) {
      console.log("File added:", files[0]);
      // Only allow 1 image upload, reset the state before adding the new file
      setUploadedFile(files[0]);
    }
  };

  // Remove the uploaded file and log the removal
  const handleRemoveFile = () => {
    console.log("File removed:", uploadedFile);
    setUploadedFile(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle your form submission logic here
    console.log("Form submitted with file:", uploadedFile);

    // Optionally handle the submission here (e.g., make API calls)

    // Reset form state and uploaded file after successful submission
    formRef.current.reset(); // Reset the form elements
    setUploadedFile(null); // Reset the uploaded file state
  };

  const handleDiscard = () => {
    // Reset the form elements and uploaded file
    console.log("Discard action, file cleared.");
    formRef.current.reset();
    setUploadedFile(null);
  };

  // Clean up object URL on component unmount
  useEffect(() => {
    return () => {
      if (uploadedFile) {
        console.log("Clean up: File URL revoked");
        URL.revokeObjectURL(uploadedFile);
      }
    };
  }, [uploadedFile]);

  return (
    <div>
      <section className='p-8'>
        <form
          action="#"
          ref={formRef}
          onSubmit={handleFormSubmit}
          className='form py-3'>
          <h3 className='text-[24px] font-bold mb-2'>Create New Category</h3>

          <h3 className='text-[18px] font-bold mb-2'>Basic Information</h3>
          <div className="grid grid-cols-1 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 pt-1 mb-4">
            <div className='col w-[50%]'>
              <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Category Name</h3>
              <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Category title' />
            </div>
          </div>


          <h3 className="text-[18px] font-bold mb-2">Media & Images</h3>
          <div className="grid grid-cols-6 gap-2 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 pt-1 mb-4">
            <span className='opacity-50 col-span-full text-[14px]'>
              Choose a category photo or simply drag and drop
            </span>

            {/* Preview the uploaded file */}
            {uploadedFile && (
              <div className="border p-2 rounded-md flex flex-col items-center bg-white h-[200px] relative">
                <span
                  className='absolute -top-[5px] -right-[5px] bg-white w-[15px] h-[15px] rounded-full border border-red-600 flex items-center justify-center cursor-pointer hover:scale-125 transition-all'
                  onClick={handleRemoveFile}
                >
                  <IoClose className='text-[15px] text-red-600 bg' />
                </span>
                <div className='w-full h-[150px]'>
                  <LazyLoadImage
                    alt="uploaded-banner"
                    effect="blur"
                    src={URL.createObjectURL(uploadedFile)}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <p className="text-[14px] text-center mt-2 line-clamp-1 overflow-hidden text-ellipsis whitespace-wrap">{uploadedFile.name}</p>
              </div>
            )}

            {/* Only show UploadBox if no file is uploaded */}
            {!uploadedFile && (
              <div className="col-span-8">
                <UploadBox multiple={false} onDrop={handleFileUpload} />
              </div>
            )}
          </div>

          <div className='!overflow-x-hidden w-full h-[70px] fixed bottom-0 right-0 bg-white flex items-center justify-end px-10 gap-4 z-[49] border-t border-[rgba(0,0,0,0.1)] custom-shadow'>
            <Button
              type="reset"
              onClick={handleDiscard}
              className='!bg-red-500 !text-white w-[150px] h-[40px] flex items-center justify-center gap-2 '
            >
              <FaCloudUploadAlt className='text-[20px]' />Discard
            </Button>
            <Button
              type="submit"
              className='custom-btn w-[150px] h-[40px] flex items-center justify-center gap-2'
            >
              <FaCloudUploadAlt className='text-[20px]' />Create
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddCategory;
