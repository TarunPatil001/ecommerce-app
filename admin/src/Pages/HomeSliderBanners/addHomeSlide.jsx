import { Button } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { IoClose } from 'react-icons/io5'
import UploadBox from '../../Components/UploadBox'

const AddHomeSlide = () => {

  const formRef = useRef(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Handle file upload and log the new files
  const handleFileUpload = (files) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...files];
      console.log("Files added:", files); // Log the new files
      console.log("Updated uploadedFiles:", updatedFiles); // Log the updated state
      return updatedFiles;
    });
  };

  // Remove a file by its index
  const handleRemoveFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      console.log(`File at index ${index} removed.`); // Log removal
      console.log("Updated uploadedFiles:", updatedFiles); // Log updated state
      return updatedFiles;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle your form submission logic here

    // Optionally handle the submission here (e.g., make API calls)

    // Reset form state and uploaded files after successful submission
    formRef.current.reset(); // Reset the form elements
    setUploadedFiles([]); // Reset uploaded files state
  };

  const handleDiscard = () => {
    // Reset the form elements and uploaded files
    formRef.current.reset();
    setUploadedFiles([]);
  };

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [uploadedFiles]);

  return (
    <div>
      <section className='p-8'>
        <form action="#"
          ref={formRef}
          onSubmit={handleFormSubmit}
          className='form py-3'>
          <h3 className='text-[24px] font-bold mb-2'>Create Home Slide Banner</h3>

          <h3 className="text-[18px] font-bold mb-2">Media & Images</h3>

          <div className="grid grid-cols-4 gap-2 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 pt-1 mb-4">
            <span className='opacity-50 col-span-full text-[14px]'>Choose a banner photo or simply drag and drop</span>
            {/* Preview images column */}
            {uploadedFiles.map((file, index) => (
              <div key={index} className="border p-2 rounded-md flex flex-col items-center bg-white h-[150px] relative">
                <span className='absolute -top-[5px] -right-[5px] bg-white w-[15px] h-[15px] rounded-full border border-red-600 flex items-center justify-center cursor-pointer hover:scale-125 transition-all' onClick={() => handleRemoveFile(index)}><IoClose className='text-[15px] text-red-600 bg' /></span>
                <div className='w-full h-[100px]'>
                  <LazyLoadImage
                    alt={`uploaded-${index}`}
                    effect="blur"
                    wrapperProps={{
                      // If you need to, you can tweak the effect transition using the wrapper style.
                      style: { transitionDelay: "1s" },
                    }}
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover rounded-md" />

                </div>
                <p className="text-[14px] text-center mt-2 line-clamp-1 overflow-hidden text-ellipsis whitespace-wrap">{file.name}</p>
              </div>
            ))}

            {/* UploadBox column */}
            {/* UploadBox column */}
            <div className={uploadedFiles.length > 0 ? 'col-span-1' : 'col-span-8'}>
              <UploadBox multiple={true} onDrop={handleFileUpload} />
            </div>

          </div>

          <div className='!overflow-x-hidden w-full h-[70px] fixed bottom-0 right-0 bg-white flex items-center justify-end px-10 gap-4 z-[49] border-t border-[rgba(0,0,0,0.1)] custom-shadow'>
            <Button type="reset" onClick={handleDiscard} className='!bg-red-500 !text-white w-[150px] h-[40px] flex items-center justify-center gap-2 '><FaCloudUploadAlt className='text-[20px]' />Discard</Button>
            <Button type="submit" className='custom-btn w-[150px] h-[40px] flex items-center justify-center gap-2'><FaCloudUploadAlt className='text-[20px]' />Create</Button>
          </div>
        </form>
      </section>

    </div>
  )
}

export default AddHomeSlide
