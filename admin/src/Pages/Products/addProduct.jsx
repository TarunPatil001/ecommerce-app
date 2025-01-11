import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Button, Rating } from '@mui/material';
import UploadBox from '../../Components/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDropzone } from 'react-dropzone';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoClose, IoCloseCircleOutline } from "react-icons/io5";
import { FaCloudUploadAlt } from 'react-icons/fa';


const AddProduct = () => {

    const [productCategory, setProductCategory] = useState('');
    const [productSubCategory, setProductSubCategory] = useState('');
    const [productFeatured, setProductFeatured] = useState('');
    const [productRams, setProductRams] = useState('');
    const [productWeight, setProductWeight] = useState('');
    const [productSize, setProductSize] = useState('');

    const handleChangeProductCategory = (event) => {
        setProductCategory(event.target.value);
    };

    const handleChangeProductSubCategory = (event) => {
        setProductSubCategory(event.target.value);
    };

    const handleChangeProductFeatured = (event) => {
        setProductFeatured(event.target.value);
    };

    const handleChangeProductRams = (event) => {
        setProductRams(event.target.value);
    };

    const handleChangeProductWeight = (event) => {
        setProductWeight(event.target.value);
    };

    const handleChangeProductSize = (event) => {
        setProductSize(event.target.value);
    };


    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Handle file upload and log the new files
    const handleFileUpload = (files) => {
        setUploadedFiles((prevFiles) => {
            const updatedFiles = [...prevFiles, ...files];
            return updatedFiles;
        });
    };

    // Remove a file by its index
    const handleRemoveFile = (index) => {
        setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <section className='p-8'>
            <form action="" className='form py-3 p-0'>
                <h3 className='text-[24px] font-bold mb-2'>Create Product</h3>

                <h3 className='text-[18px] font-bold mb-1 text-gray-700'>Basic Information</h3>
                <div className='flex flex-col gap-4 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 mb-5'>

                    <div className="grid grid-cols-1">

                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Name</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Product title' />
                        </div>
                    </div>
                    <div className="grid grid-cols-1">
                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Description</h3>
                            <textarea type="text" className='w-full h-[100px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Product description' />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 mb-3 gap-4">

                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Category</h3>
                            <Select
                                labelId="productCategoryDropDownLabel"
                                id="productCategoryDropDown"
                                size="small"
                                value={productCategory}
                                onChange={handleChangeProductCategory}
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
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Sub Category</h3>
                            <Select
                                labelId="productSubCategoryDropDownLabel"
                                id="productSubCategoryDropDown"
                                size="small"
                                value={productSubCategory}
                                onChange={handleChangeProductSubCategory}
                                className="w-full !text-[14px]"
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="" disabled>
                                    Select product sub category
                                </MenuItem>
                                <MenuItem value={10}>Men</MenuItem>
                                <MenuItem value={20}>Women</MenuItem>
                                <MenuItem value={30}>Kids</MenuItem>
                            </Select>
                        </div>

                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Is Featured?</h3>
                            <Select
                                labelId="productFeaturedDropDownLabel"
                                id="productFeaturedDropDown"
                                size="small"
                                value={productFeatured}
                                onChange={handleChangeProductFeatured}
                                className="w-full !text-[14px]"
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="" disabled>
                                    Select the choice
                                </MenuItem>
                                <MenuItem value={10}>True</MenuItem>
                                <MenuItem value={20}>False</MenuItem>
                            </Select>
                        </div>

                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Brand</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Product brand' />
                        </div>
                    </div>
                </div>


                {/* <div className='flex flex-col gap-4  mb-2'></div> */}
                <h3 className='text-[18px] font-bold mb-1 text-gray-700'>Pricing & Stock</h3>
                <div className="grid grid-cols-4 mb-3 gap-4 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5">

                    <div className='col'>
                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Price</h3>
                        <input
                            type="number"
                            className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                            placeholder="Product price"
                            min="0"
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <div className='col'>
                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Old Price</h3>
                        <input
                            type="number"
                            className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                            placeholder="Product old price"
                            min="0"
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    <div className='col'>
                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Discount</h3>
                        <input
                            type="number"
                            className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                            placeholder="Product discount"
                            min="0"
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    <div className='col'>
                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Stock</h3>
                        <input
                            type="number"
                            className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                            placeholder="Product stock"
                            min="0"
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                </div>

                <h3 className='text-[18px] font-bold mb-1 text-gray-700'>Size & Rating</h3>
                <div className="grid grid-cols-4 mb-3 gap-4 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5">
                    <div className='col'>
                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product RAMS</h3>
                        <Select
                            labelId="productRAMSDropDownLabel"
                            id="productRAMSDropDown"
                            size="small"
                            value={productRams}
                            onChange={handleChangeProductRams}
                            className="w-full !text-[14px]"
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="" disabled>
                                Select product rams
                            </MenuItem>
                            <MenuItem value={'4GB'}>4GB</MenuItem>
                            <MenuItem value={'8GB'}>8GB</MenuItem>
                            <MenuItem value={'16GB'}>16GB</MenuItem>
                        </Select>
                    </div>
                    <div className='col'>
                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Weight</h3>
                        <Select
                            labelId="productWeightDropDownLabel"
                            id="productWeightDropDown"
                            size="small"
                            value={productWeight}
                            onChange={handleChangeProductWeight}
                            className="w-full !text-[14px]"
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="" disabled>
                                Select product weight
                            </MenuItem>
                            <MenuItem value={'2KG'}>2KG</MenuItem>
                            <MenuItem value={'4KG'}>4KG</MenuItem>
                            <MenuItem value={'8KG'}>8KG</MenuItem>
                        </Select>
                    </div>
                    <div className='col'>
                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Size</h3>
                        <Select
                            labelId="productSizeDropDownLabel"
                            id="productSizeDropDown"
                            size="small"
                            value={productSize}
                            onChange={handleChangeProductSize}
                            className="w-full !text-[14px]"
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="" disabled>
                                Select product size
                            </MenuItem>
                            <MenuItem value={'S'}>S</MenuItem>
                            <MenuItem value={'M'}>M</MenuItem>
                            <MenuItem value={'L'}>L</MenuItem>
                            <MenuItem value={'XL'}>XL</MenuItem>
                            <MenuItem value={'XXL'}>XXL</MenuItem>
                            <MenuItem value={'XXXL'}>XXXL</MenuItem>
                        </Select>
                    </div>
                    <div className='col'>
                        <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Product Rating</h3>
                        <Rating name="half-rating" defaultValue={0} precision={0.5} />
                    </div>
                </div>

                <div className="col w-full px-0">
                    <h3 className="text-[18px] font-bold mb-2">Media & Images</h3>

                    <div className="grid grid-cols-8 gap-2 border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-md p-5 pt-1 mb-4">
                        <span className='opacity-50 col-span-full text-[14px]'>Choose a product photo or simply drag and drop</span>    
                        {/* Preview images column */}
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="border p-2 rounded-md flex flex-col items-center bg-white h-[150px] relative">
                                <span className='absolute -top-[5px] -right-[5px] bg-white w-[15px] h-[15px] rounded-full border border-red-600 flex items-center justify-center cursor-pointer hover:scale-125 transition-all' onClick={() => handleRemoveFile(index)}><IoClose className='text-[15px] text-red-600 bg' /></span>
                                <div className='w-full h-[100px]'>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`uploaded-${index}`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                                <p className="text-[14px] text-center mt-2 line-clamp-1 overflow-hidden text-ellipsis whitespace-wrap">{file.name}</p>
                            </div>
                        ))}

                        {/* UploadBox column */}
                        {
                            uploadedFiles.length > 0 ? (
                                <UploadBox multiple={true} onDrop={handleFileUpload} />
                            ) : (
                                <div className='col-span-8'>
                                    <UploadBox multiple={true} onDrop={handleFileUpload} />
                                </div>
                                )
                        
                            }
                    </div>
                </div>

                <br />

                <div className='w-full h-[70px] fixed bottom-0 right-0 bg-white flex items-center justify-end px-10 gap-4 z-[49] border-t border-[rgba(0,0,0,0.1)] custom-shadow'>
                    <Button type="submit" className='!bg-red-500 !text-white w-[150px] h-[40px] flex items-center justify-center gap-2 '><FaCloudUploadAlt className='text-[20px]' />Discard</Button>
                    <Button type="submit" className='custom-btn w-[150px] h-[40px] flex items-center justify-center gap-2'><FaCloudUploadAlt className='text-[20px]' />Create</Button>
                </div>
            </form>
        </section>
    )
}

export default AddProduct
