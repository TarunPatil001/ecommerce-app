import { Button, MenuItem, Select } from '@mui/material';
import React, { useRef, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

const AddSubCategory = () => {
  const formRef = useRef(null);
  const [subCategory, setSubCategory] = useState('');

  const handleChangeSubCategory = (event) => {
    setSubCategory(event.target.value);
  };


  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle your form submission logic here

    // Optionally handle the submission here (e.g., make API calls)

    // Reset form state and uploaded file after successful submission
    formRef.current.reset(); // Reset the form elements\
    setSubCategory('');
  };

  const handleDiscard = () => {
    setSubCategory('');
    // Reset the form elements and uploaded file
    console.log("Discard action, file cleared.");
    formRef.current.reset();
  };

  return (
    <div>
      <section className='p-8'>
        <form
          action="#"
          ref={formRef}
          onSubmit={handleFormSubmit}
          className='form py-3'>
          <h3 className='text-[24px] font-bold mb-2'>Create New SubCategory</h3>

          <h3 className='text-[18px] font-bold mb-2'>Basic Information</h3>
          <div className="grid grid-cols-2 gap-4 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 pt-1 mb-4">
            <div className='col'>
              <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Category</h3>
              <Select
                labelId="productCategoryDropDownLabel"
                id="productCategoryDropDown"
                size="small"
                value={subCategory}
                onChange={handleChangeSubCategory}
                className="w-full !text-[14px]"
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="" disabled>
                  Select product category
                </MenuItem>
                <MenuItem value={10}>Fashion</MenuItem>
                <MenuItem value={20}>Beauty</MenuItem>
                <MenuItem value={30}>Wellness</MenuItem>
              </Select>
            </div>
            <div className='col'>
              <h3 className='text-[14px] font-medium mb-1 text-gray-700'>SubCategory Name</h3>
              <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='SubCategory title' />
            </div>
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

export default AddSubCategory;
