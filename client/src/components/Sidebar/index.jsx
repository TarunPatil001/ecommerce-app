import { useContext, useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import "./styles.css"
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Collapse } from 'react-collapse';
import Button from '@mui/material/Button';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';
import { useLocation } from 'react-router-dom';
import { postData } from '../../utils/api';
import PropTypes from 'prop-types';

const Sidebar = (props) => {

    const context = useContext(MyContext);
    const [isOpenCategoryFilter1, setIsOpenCategoryFilter1] = useState(true);
    // const [isOpenInnerCategoryFilter1, setIsOpenInnerCategoryFilter1] = useState(false);
    // const [isOpenCategoryFilter2, setIsOpenCategoryFilter2] = useState(true);
    // const [isOpenCategoryFilter3, setIsOpenCategoryFilter3] = useState(true);
    const [isOpenCategoryFilter4, setIsOpenCategoryFilter4] = useState(true);
    const [isOpenCategoryFilter5, setIsOpenCategoryFilter5] = useState(true);
    const ratings = [5, 4, 3, 2, 1];




    const [filters, setFilters] = useState({
        categoryId: [],
        subCategoryId: [],
        thirdSubCategoryId: [],
        minPrice: '',
        maxPrice: '',
        size: '',
        rating: '',
        page: 1,
        limit: 25,
    })

    const [price, setPrice] = useState([100, 400000]);
    const location = useLocation();


    const handleCheckBoxChange = (field, value) => {
        setFilters((prev) => {
            let updatedValues = prev[field] || [];

            if (updatedValues.includes(value)) {
                // Remove if already selected
                updatedValues = updatedValues.filter((item) => item !== value);
            } else {
                // Add and sort in descending order (highest rating first)
                updatedValues = [...updatedValues, value].sort((a, b) => b - a);
            }

            return {
                ...prev,
                [field]: updatedValues,
                ...(field === "categoryId" && { subCategoryId: [], thirdSubCategoryId: [] }), // Reset subcategories if category is changed
            };
        });
    };



    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search);

        const categoryId = queryParameters.get('categoryId');
        const subCategoryId = queryParameters.get('subCategoryId');
        const thirdSubCategoryId = queryParameters.get('thirdSubCategoryId');

        // ✅ Update filters state properly
        setFilters({
            categoryId: categoryId ? [categoryId] : [],
            subCategoryId: subCategoryId ? [subCategoryId] : [],
            thirdSubCategoryId: thirdSubCategoryId ? [thirdSubCategoryId] : [],
            rating: [],
            page: 1
        });

    }, [location.search]); // Runs when URL search params change


    useEffect(() => {
        let selectedName = "All Categories"; // Default name

        if (context?.catData?.length > 0) {
            // Search for thirdSubCategory first
            context.catData.forEach(category => {
                category?.children?.forEach(subCat => {
                    subCat?.children?.forEach(thirdSubCat => {
                        if (thirdSubCat._id === filters.thirdSubCategoryId[0]) {
                            selectedName = thirdSubCat.name; // ✅ Set thirdSubCategoryName if found
                        }
                    });

                    if (subCat._id === filters.subCategoryId[0] && filters.thirdSubCategoryId.length === 0) {
                        selectedName = subCat.name; // ✅ Set subCategoryName if no thirdSubCategoryId
                    }
                });

                if (category._id === filters.categoryId[0] && filters.subCategoryId.length === 0 && filters.thirdSubCategoryId.length === 0) {
                    selectedName = category.name; // ✅ Set categoryName only if subCategoryId & thirdSubCategoryId are empty
                }
            });
        }

        props?.setSelectedName(selectedName);
    }, [filters.categoryId, filters.subCategoryId, filters.thirdSubCategoryId, context?.catData]); // Runs when filters/context data changes


    const filtersData = () => {
        props?.setIsLoading(true);
        postData(`/api/product/filters`, filters).then((res) => {
            props?.setProductsData(res);  // ✅ Correct function to update state
            props?.setIsLoading(false);
            props?.setTotalPages(res?.totalPages);
            props?.setTotal(res?.total);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 300);
        })
    }


    useEffect(() => {
        filters.page = props.page;
        filtersData();
    }, [filters, props.page]);

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            minPrice: price[0],
            maxPrice: price[1]
        }))
    }, [price])





    return (
        <aside className="sidebar">
            <div className="p-1 border-x border-t rounded-t-md">
                <h3 className="p-2 px-4 text-[18px] font-semibold uppercase">Filters</h3>
            </div>

            <div className="box border">
                <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
                    Categories
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter1(!isOpenCategoryFilter1) }}> {isOpenCategoryFilter1 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter1}>
                    <div className="relative flex flex-col w-full mb-1">
                        <div className="px-4 flex flex-col w-full mb-2 capitalize">
                            {context?.catData?.length !== 0 &&
                                context?.catData.map((item, index) => (
                                    <FormControlLabel
                                        key={index}
                                        value={item?._id}
                                        control={<Checkbox size="small" />}
                                        checked={filters?.categoryId?.includes(item?._id)} // ✅ Ensures correct checked state
                                        label={item?.name}
                                        onChange={() => handleCheckBoxChange("categoryId", item?._id)}
                                        className="link w-full"
                                    />
                                ))}
                        </div>

                    </div>
                </Collapse>


            </div>

            {/* <div className="box border-x border-b">
                <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
                    Availability
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter2(!isOpenCategoryFilter2) }}> {isOpenCategoryFilter2 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter2}>
                    <div className="relative flex flex-col mb-1">

                        <div className="px-5  flex flex-col w-full mb-2 capitalize">

                            <div className="flex items-center">
                                <FormControlLabel control={<Checkbox size="small" />} label="Available" className="link" />
                                <span className='text-gray-400 text-[10px]'>(1700)</span>
                            </div>
                            <div className="flex items-center">
                                <FormControlLabel control={<Checkbox size="small" />} label="In Stock" className="link" />
                                <span className='text-gray-400 text-[10px]'>(1700)</span>
                            </div>
                            <div className="flex items-center">
                                <FormControlLabel control={<Checkbox size="small" />} label="Not Available" className="link" />
                                <span className='text-gray-400 text-[10px]'>(1700)</span>
                            </div>

                        </div>
                    </div>
                </Collapse>
            </div> */}

            {/* <div className="box border-x border-b">
                <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
                    Size
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter3(!isOpenCategoryFilter3) }}> {isOpenCategoryFilter3 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter3}>
                    <div className="relative flex flex-col mb-1">

                        <div className="px-5  flex flex-col w-full mb-2 capitalize">
                            <div className="flex items-center">
                                <FormControlLabel control={<Checkbox size="small" />} label={"S"} className="link" />
                                <span className='text-gray-400 text-[10px]'>(1700)</span>
                            </div>
                            <div className="flex items-center">
                                <FormControlLabel control={<Checkbox size="small" />} label={"M"} className="link" />
                                <span className='text-gray-400 text-[10px]'>(2607)</span>
                            </div>
                        </div>
                    </div>
                </Collapse>
            </div> */}

            <div className="box border-x border-b">
                <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
                    Price
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter4(!isOpenCategoryFilter4) }}> {isOpenCategoryFilter4 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter4}>
                    <div className="p-5  flex flex-col w-full capitalize">
                        <RangeSlider
                            value={price}
                            onInput={setPrice}
                            min={100}
                            max={400000}
                            step={10}
                        />

                        <div className="py-4 px-0 text-[12px] flex items-center justify-between priceRange">
                            <span>low: <span className="rupee">₹</span><span className="font-semibold text-[13px]">{new Intl.NumberFormat('en-IN').format(`${price[0]}`)}</span></span>
                            <span>high: <span className="rupee">₹</span><span className="font-semibold text-[13px]">{new Intl.NumberFormat('en-IN').format(`${price[1]}`)}</span></span>
                        </div>
                    </div>
                </Collapse>
            </div>

            <div className="box border-x border-b rounded-b-md ">
                <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
                    Rating
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter5(!isOpenCategoryFilter5) }}> {isOpenCategoryFilter5 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter5}>
                    <div className="p-5 pt-0  flex flex-col w-full lowercase">
                        {ratings.map((rating) => (
                            <FormControlLabel
                                key={rating}
                                className="link w-full"
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={filters?.rating?.includes(rating)}
                                        onChange={() => handleCheckBoxChange("rating", rating)}
                                    />
                                }
                                label={
                                    <div className="flex items-center gap-2">
                                        <Rating
                                            name={`rating-${rating}`}
                                            defaultValue={rating}
                                            precision={0.5}
                                            size="small"
                                            readOnly
                                        />
                                        <span>& above</span>
                                    </div>
                                }
                            />
                        ))}

                    </div>
                </Collapse>
            </div>

        </aside >
    );
};

// ✅ Define propTypes for validation
Sidebar.propTypes = {
    setSelectedName: PropTypes.func.isRequired,  // Function to update selected name
    setIsLoading: PropTypes.func.isRequired,    // Function to set loading state
    setProductsData: PropTypes.func.isRequired, // Function to update product data
    setTotalPages: PropTypes.func.isRequired,   // Function to set total number of pages
    setTotal: PropTypes.func.isRequired,        // Function to update total product count
    page: PropTypes.number.isRequired,          // Current page number
    filtersData: PropTypes.object,              // Filters data (add a shape if needed)
};

export default Sidebar;
