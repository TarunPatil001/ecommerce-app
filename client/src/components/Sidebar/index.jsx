// import { useCallback, useContext, useEffect, useRef, useState } from 'react';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import "./styles.css"
// import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
// import { Collapse } from 'react-collapse';
// import Button from '@mui/material/Button';
// import RangeSlider from 'react-range-slider-input';
// import 'react-range-slider-input/dist/style.css';
// import Rating from '@mui/material/Rating';
// import { MyContext } from '../../App';
// import { useLocation } from 'react-router-dom';
// import { postData } from '../../utils/api';
// import PropTypes from 'prop-types';

// const Sidebar = (props) => {

//     const context = useContext(MyContext);
//     const [isOpenCategoryFilter1, setIsOpenCategoryFilter1] = useState(true);
//     const [isOpenCategoryFilter4, setIsOpenCategoryFilter4] = useState(true);
//     const [isOpenCategoryFilter5, setIsOpenCategoryFilter5] = useState(true);
//     const ratings = [5, 4, 3, 2, 1];
//     const location = useLocation();
//     const isFirstRender = useRef(true);

//     const [filters, setFilters] = useState({
//         categoryId: [],
//         subCategoryId: [],
//         thirdSubCategoryId: [],
//         minPrice: '',
//         maxPrice: '',
//         size: '',
//         rating: '',
//         page: 1,
//         limit: 25,
//     });

//     const [price, setPrice] = useState([100, 400000]);

//     const handleCheckBoxChange = (field, value) => {
//         setFilters((prev) => {
//             let updatedValues = prev[field] || [];

//             if (updatedValues.includes(value)) {
//                 updatedValues = updatedValues.filter((item) => item !== value);
//             } else {
//                 updatedValues = [...updatedValues, value].sort((a, b) => b - a);
//             }

//             return {
//                 ...prev,
//                 [field]: updatedValues,
//                 ...(field === "categoryId" && { subCategoryId: [], thirdSubCategoryId: [] }),
//             };
//         });
//     };

//     // ✅ 1️⃣ Update filters when URL params change
//     useEffect(() => {
//         const queryParameters = new URLSearchParams(location.search);

//         const categoryId = queryParameters.get("categoryId");
//         const subCategoryId = queryParameters.get("subCategoryId");
//         const thirdSubCategoryId = queryParameters.get("thirdSubCategoryId");

//         setFilters((prev) => ({
//             ...prev,
//             categoryId: categoryId ? [categoryId] : [],
//             subCategoryId: subCategoryId ? [subCategoryId] : [],
//             thirdSubCategoryId: thirdSubCategoryId ? [thirdSubCategoryId] : [],
//             rating: [],
//             page: 1,
//         }));

//         context?.setSearchData([]);
//     }, [location.search]);

//     // ✅ 2️⃣ Set Selected Category Name based on Filters
//     useEffect(() => {
//         let selectedName = "All Categories";

//         if (context?.catData?.length > 0) {
//             context.catData.forEach(category => {
//                 category?.children?.forEach(subCat => {
//                     subCat?.children?.forEach(thirdSubCat => {
//                         if (thirdSubCat._id === filters.thirdSubCategoryId[0]) {
//                             selectedName = thirdSubCat.name;
//                         }
//                     });

//                     if (subCat._id === filters.subCategoryId[0] && filters.thirdSubCategoryId.length === 0) {
//                         selectedName = subCat.name;
//                     }
//                 });

//                 if (category._id === filters.categoryId[0] && filters.subCategoryId.length === 0 && filters.thirdSubCategoryId.length === 0) {
//                     selectedName = category.name;
//                 }
//             });
//         }

//         props?.setSelectedName?.(selectedName);
//     }, [filters.categoryId, filters.subCategoryId, filters.thirdSubCategoryId, context?.catData]);



//     const filtersData = async () => {
//         props?.setIsLoading?.(true);

//         // ✅ Check if `searchData` exists and use it
//         if (context?.searchData?.data?.length > 0) {
//             props?.setProductsData?.(context?.searchData);
//             console.log("✅ Using SearchData:", context?.searchData);
//             props?.setTotalPages?.(context?.searchData?.totalPages || 1);
//             props?.setTotal?.(context?.searchData?.totalResults || 0);
//             props?.setIsLoading?.(false);
//             setTimeout(() => window.scrollTo(0, 0), 300);
//         } else {
//             // ✅ If `searchData` is empty, fetch filtered data
//             const res = await postData(`/api/product/filters`, filters);
//             console.log("🌐 API Called for Filter Data:", res);
//             props?.setProductsData?.(res || []);
//             props?.setTotalPages?.(res?.totalPages || 1);
//             props?.setTotal?.(res?.total || 0);
//             props?.setIsLoading?.(false);
//             setTimeout(() => window.scrollTo(0, 0), 300);
//         }
//     };

//     // ✅ Trigger `filtersData()` only when `searchData` is empty
//     useEffect(() => {
//         if (context?.searchData?.data?.length > 0) {
//             console.log("🟢 Applying SearchData to UI:", context?.searchData);
//             props?.setProductsData?.(context?.searchData);
//             filtersData();
//         } else {
//             filtersData();
//         }
//     }, [context?.searchData, filters]);

//     // ✅ Update filters when the price changes
//     useEffect(() => {
//         setFilters((prev) => ({
//             ...prev,
//             minPrice: price[0],
//             maxPrice: price[1],
//         }));
//     }, [price]);



//     return (
//         <aside className="sidebar">

//             <div className="p-1 border-x border-t rounded-t-md">
//                 <h3 className="p-2 px-4 text-[18px] font-semibold uppercase">Filters</h3>
//             </div>

//             <div className="box border">
//                 <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
//                     Categories
//                     <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter1(!isOpenCategoryFilter1) }}> {isOpenCategoryFilter1 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
//                 </h3>
//                 <Collapse isOpened={isOpenCategoryFilter1}>
//                     <div className="relative flex flex-col w-full mb-1">
//                         <div className="px-4 flex flex-col w-full mb-2 capitalize">
//                             {context?.catData?.length !== 0 &&
//                                 context?.catData.map((item, index) => (
//                                     <FormControlLabel
//                                         key={index}
//                                         value={item?._id}
//                                         control={<Checkbox size="small" />}
//                                         checked={filters?.categoryId?.includes(item?._id)} // ✅ Ensures correct checked state
//                                         label={item?.name}
//                                         onChange={() => handleCheckBoxChange("categoryId", item?._id)}
//                                         className="link w-full"
//                                     />
//                                 ))}
//                         </div>

//                     </div>
//                 </Collapse>
//             </div>


//             <div className="box border-x border-b">
//                 <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
//                     Price
//                     <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter4(!isOpenCategoryFilter4) }}> {isOpenCategoryFilter4 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
//                 </h3>
//                 <Collapse isOpened={isOpenCategoryFilter4}>
//                     <div className="p-5  flex flex-col w-full capitalize">
//                         <RangeSlider
//                             value={price}
//                             onInput={setPrice}
//                             min={100}
//                             max={400000}
//                             step={10}
//                         />

//                         <div className="py-4 px-0 text-[12px] flex items-center justify-between priceRange">
//                             <span>low: <span className="rupee">₹</span><span className="font-semibold text-[13px]">{new Intl.NumberFormat('en-IN').format(`${price[0]}`)}</span></span>
//                             <span>high: <span className="rupee">₹</span><span className="font-semibold text-[13px]">{new Intl.NumberFormat('en-IN').format(`${price[1]}`)}</span></span>
//                         </div>
//                     </div>
//                 </Collapse>
//             </div>

//             <div className="box border-x border-b rounded-b-md ">
//                 <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
//                     Rating
//                     <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter5(!isOpenCategoryFilter5) }}> {isOpenCategoryFilter5 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
//                 </h3>
//                 <Collapse isOpened={isOpenCategoryFilter5}>
//                     <div className="p-5 pt-0  flex flex-col w-full lowercase">
//                         {ratings.map((rating) => (
//                             <FormControlLabel
//                                 key={rating}
//                                 className="link w-full"
//                                 control={
//                                     <Checkbox
//                                         size="small"
//                                         checked={filters?.rating?.includes(rating)}
//                                         onChange={() => handleCheckBoxChange("rating", rating)}
//                                     />
//                                 }
//                                 label={
//                                     <div className="flex items-center gap-2">
//                                         <Rating
//                                             name={`rating-${rating}`}
//                                             defaultValue={rating}
//                                             precision={0.5}
//                                             size="small"
//                                             readOnly
//                                         />
//                                         <span>& above</span>
//                                     </div>
//                                 }
//                             />
//                         ))}

//                     </div>
//                 </Collapse>
//             </div>

//         </aside >
//     );
// };

// // ✅ Define propTypes for validation
// Sidebar.propTypes = {
//     setSelectedName: PropTypes.func.isRequired,  // Function to update selected name
//     setIsLoading: PropTypes.func.isRequired,    // Function to set loading state
//     setProductsData: PropTypes.func.isRequired, // Function to update product data
//     setTotalPages: PropTypes.func.isRequired,   // Function to set total number of pages
//     setTotal: PropTypes.func.isRequired,        // Function to update total product count
//     page: PropTypes.number.isRequired,          // Current page number
//     filtersData: PropTypes.object,              // Filters data (add a shape if needed)
// };

// export default Sidebar;


import { useCallback, useContext, useEffect, useRef, useState } from 'react';
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

// const Sidebar = (props) => {

//     const context = useContext(MyContext);
//     const location = useLocation();

//     const [isOpenCategoryFilter1, setIsOpenCategoryFilter1] = useState(true);
//     const [isOpenCategoryFilter4, setIsOpenCategoryFilter4] = useState(true);
//     const [isOpenCategoryFilter5, setIsOpenCategoryFilter5] = useState(true);

//     const [price, setPrice] = useState([100, 400000]);

//     const [filters, setFilters] = useState({
//         categoryId: [],
//         subCategoryId: [],
//         thirdSubCategoryId: [],
//         minPrice: "",
//         maxPrice: "",
//         size: "",
//         rating: "",
//         page: 1,
//         limit: 25,
//     });


//     const ratings = [5, 4, 3, 2, 1];

//     const handleCheckBoxChange = (field, value) => {
//         context?.setSearchData([]);
//         const currentValues = filters[field] || [];
//         const updatedValues = currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value];
//         setFilters((prevFilters) => ({ ...prevFilters, [field]: updatedValues }));

//         if (field === "categoryId") {
//             setFilters((prevFilters) => {
//                 return {
//                     ...prevFilters, subCategoryId: [], thirdSubCategoryId: []
//                 }
//             })
//         }
//     };

//     useEffect(() => {
//         setFilters((prevFilters) => ({
//             ...prevFilters,
//             minPrice: price[0],
//             maxPrice: price[1],
//         }));
//     }, [price]);

//     useEffect(() => {

//         const url = window.location.href;
//         const queryParameters = new URLSearchParams(location.search);

//         if (url.includes("categoryId")) {
//             const categoryId = queryParameters.get("categoryId");
//             const categoryArr = [];
//             categoryArr.push(categoryId);
//             filters.categoryId = categoryArr;
//             filters.subCategoryId = [];
//             filters.thirdSubCategoryId = [];
//             filters.rating = [];
//             context?.setSearchData([]);
//         }

//         if (url.includes("subCategoryId")) {
//             const subCategoryId = queryParameters.get("subCategoryId");
//             const subCategoryArr = [];
//             subCategoryArr.push(subCategoryId);
//             filters.categoryId = [];
//             filters.subCategoryId = subCategoryArr;
//             filters.thirdSubCategoryId = [];
//             filters.rating = [];
//             context?.setSearchData([]);
//         }

//         if (url.includes("thirdSubCategoryId")) {
//             const thirdSubCategoryId = queryParameters.get("thirdSubCategoryId");
//             const thirdSubCategoryArr = [];
//             thirdSubCategoryArr.push(thirdSubCategoryId);
//             filters.categoryId = [];
//             filters.subCategoryId = [];
//             filters.thirdSubCategoryId = thirdSubCategoryArr;
//             filters.rating = [];
//             context?.setSearchData([]);
//         }

//         filters.page = 1;

//         setTimeout(() => {
//             filtersData();
//         }, 200);


//     }, [location.search]);

//     useEffect(() => {
//         let selectedName = "All Categories";
//         if (context?.catData?.length > 0) {
//             context.catData.forEach((category) => {
//                 category?.children?.forEach((subCat) => {
//                     subCat?.children?.forEach((thirdSubCat) => {
//                         if (thirdSubCat._id === filters.thirdSubCategoryId[0]) selectedName = thirdSubCat.name;
//                     });

//                     if (subCat._id === filters.subCategoryId[0] && !filters.thirdSubCategoryId.length) {
//                         selectedName = subCat.name;
//                     }
//                 });

//                 if (category._id === filters.categoryId[0] && !filters.subCategoryId.length && !filters.thirdSubCategoryId.length) {
//                     selectedName = category.name;
//                 }
//             });
//         }

//         props?.setSelectedName?.(selectedName);
//     }, [filters.categoryId, filters.subCategoryId, filters.thirdSubCategoryId, context?.catData]);


//     const filtersData = async () => {
//         props?.setIsLoading(true);

//         if (context?.searchData?.data?.length > 0) {
//             props?.setProductsData(context?.searchData);
//             props?.setIsLoading(false);
//             props?.setTotalPages(context?.searchData?.totalPages || 1);
//             props?.setTotal(context?.searchData?.total || 0);
//             window.scrollTo(0, 0);
//         } else {
//             postData(`/api/product/filters`, filters).then((res) => {
//                 props?.setProductsData(res);
//                 props?.setIsLoading(false);
//                 props?.setTotalPages(res?.totalPages || 1);
//                 props?.setTotal(res?.total || 0);
//                 window.scrollTo(0, 0);

//             })
//         }
//     }


//     useEffect(() => {
//         setTimeout(() => {
//             filtersData();
//         }, 100);
//     }, [filters, context?.searchQuery, context?.searchData, price]);


// const Sidebar = (props) => {

//     const context = useContext(MyContext);
//     const location = useLocation();

//     const [isOpenCategoryFilter1, setIsOpenCategoryFilter1] = useState(true);
//     const [isOpenCategoryFilter4, setIsOpenCategoryFilter4] = useState(true);
//     const [isOpenCategoryFilter5, setIsOpenCategoryFilter5] = useState(true);

//     const [price, setPrice] = useState([100, 400000]);


//     const [filters, setFilters] = useState({
//         categoryId: [],
//         subCategoryId: [],
//         thirdSubCategoryId: [],
//         minPrice: "",
//         maxPrice: "",
//         size: "",
//         rating: "",
//         page: 1,
//         limit: 25,
//         searchData: context?.searchData || [], // ✅ Added searchData
//     });

//     const ratings = [5, 4, 3, 2, 1];


//     const handleCheckBoxChange = (field, value) => {
//         context?.setSearchData([]);

//         const currentValues = filters[field] || [];
//         let updatedValues;

//         if (field === "rating") {
//             updatedValues = currentValues.includes(value)
//                 ? currentValues.filter((item) => item !== value) // ✅ Remove if already selected
//                 : [...currentValues, value]; // ✅ Allow multiple selections
//         } else {
//             updatedValues = currentValues.includes(value)
//                 ? currentValues.filter((item) => item !== value)
//                 : [...currentValues, value];
//         }

//         setFilters((prevFilters) => ({ ...prevFilters, [field]: updatedValues }));

//         if (field === "categoryId") {
//             setFilters((prevFilters) => ({
//                 ...prevFilters,
//                 subCategoryId: [],
//                 thirdSubCategoryId: [],
//             }));
//         }
//     };




//     useEffect(() => {
//         setFilters((prevFilters) => ({
//             ...prevFilters,
//             minPrice: price[0],
//             maxPrice: price[1],
//         }));
//     }, [price]);

//     useEffect(() => {
//         setFilters((prevFilters) => ({
//             ...prevFilters,
//             rating: filters.rating, // Ensure rating updates correctly
//         }));
//     }, [filters.rating]); 


//     useEffect(() => {
//         const url = window.location.href;
//         const queryParameters = new URLSearchParams(location.search);

//         if (url.includes("categoryId")) {
//             const categoryId = queryParameters.get("categoryId");
//             filters.categoryId = [categoryId];
//             filters.subCategoryId = [];
//             filters.thirdSubCategoryId = [];
//             filters.rating = [];
//             context?.setSearchData([]);
//         }

//         if (url.includes("subCategoryId")) {
//             const subCategoryId = queryParameters.get("subCategoryId");
//             filters.categoryId = [];
//             filters.subCategoryId = [subCategoryId];
//             filters.thirdSubCategoryId = [];
//             filters.rating = [];
//             context?.setSearchData([]);
//         }

//         if (url.includes("thirdSubCategoryId")) {
//             const thirdSubCategoryId = queryParameters.get("thirdSubCategoryId");
//             filters.categoryId = [];
//             filters.subCategoryId = [];
//             filters.thirdSubCategoryId = [thirdSubCategoryId];
//             filters.rating = [];
//             context?.setSearchData([]);
//         }

//         filters.page = 1;

//         setTimeout(() => {
//             filtersData();
//         }, 200);
//     }, [location.search]);

//     useEffect(() => {
//         let selectedName = "All Categories";
//         if (context?.catData?.length > 0) {
//             context.catData.forEach((category) => {
//                 category?.children?.forEach((subCat) => {
//                     subCat?.children?.forEach((thirdSubCat) => {
//                         if (thirdSubCat._id === filters.thirdSubCategoryId[0]) selectedName = thirdSubCat.name;
//                     });

//                     if (subCat._id === filters.subCategoryId[0] && !filters.thirdSubCategoryId.length) {
//                         selectedName = subCat.name;
//                     }
//                 });

//                 if (category._id === filters.categoryId[0] && !filters.subCategoryId.length && !filters.thirdSubCategoryId.length) {
//                     selectedName = category.name;
//                 }
//             });
//         }

//         props?.setSelectedName?.(selectedName);
//     }, [filters.categoryId, filters.subCategoryId, filters.thirdSubCategoryId, context?.catData]);

//     // const filtersData = async () => {
//     //     props?.setIsLoading(true);

//     //     if (context?.searchData?.data?.length > 0) {
//     //         props?.setProductsData(context?.searchData);
//     //         props?.setIsLoading(false);
//     //         props?.setTotalPages(context?.searchData?.totalPages || 1);
//     //         props?.setTotal(context?.searchData?.total || 0);
//     //         window.scrollTo(0, 0);
//     //     } else {
//     //         postData(`/api/product/filters`, filters).then((res) => {
//     //             props?.setProductsData(res);
//     //             props?.setIsLoading(false);
//     //             props?.setTotalPages(res?.totalPages || 1);
//     //             props?.setTotal(res?.total || 0);
//     //             window.scrollTo(0, 0);
//     //         });
//     //     }
//     // };

//     const filtersData = async () => {
//         props?.setIsLoading(true);

//         if (context?.searchData?.data?.length > 0) {
//             // ✅ Apply price AND rating filters to searchData
//             let filteredData = context?.searchData?.data.filter((product) => {
//                 return (
//                     product.price >= filters.minPrice &&
//                     product.price <= filters.maxPrice &&
//                     (filters.rating.length === 0 || filters.rating.includes(product.rating)) // ✅ Apply rating correctly
//                 );
//             });

//             // ✅ Update UI with filtered search data
//             props?.setProductsData({ ...context?.searchData, data: filteredData });
//             props?.setIsLoading(false);
//             props?.setTotalPages(Math.ceil(filteredData.length / filters.limit) || 1);
//             props?.setTotal(filteredData.length || 0);
//             window.scrollTo(0, 0);
//         } else {
//             // ✅ Fetch new data if searchData is empty
//             postData(`/api/product/filters`, filters).then((res) => {
//                 props?.setProductsData(res);
//                 props?.setIsLoading(false);
//                 props?.setTotalPages(res?.totalPages || 1);
//                 props?.setTotal(res?.total || 0);
//                 window.scrollTo(0, 0);
//             });
//         }
//     };


//     useEffect(() => {
//         setTimeout(() => {
//             filtersData();
//         }, 200);
//     }, [filters, context?.searchQuery, context?.searchData, price, filters.rating]); // ✅ Added filters.rating


//     // ✅ Ensure filters update when searchData changes
//     useEffect(() => {
//         setFilters((prevFilters) => ({
//             ...prevFilters,
//             searchData: context?.searchData || [],
//         }));
//     }, [context?.searchData]);


const Sidebar = (props) => {
    const context = useContext(MyContext);
    const location = useLocation();

    const [isOpenCategoryFilter1, setIsOpenCategoryFilter1] = useState(true);
    const [isOpenCategoryFilter4, setIsOpenCategoryFilter4] = useState(true);
    const [isOpenCategoryFilter5, setIsOpenCategoryFilter5] = useState(true);

    const [price, setPrice] = useState([100, 400000]);

    const [filters, setFilters] = useState({
        categoryId: [],
        subCategoryId: [],
        thirdSubCategoryId: [],
        minPrice: 100,
        maxPrice: 400000,
        size: "",
        rating: [],
        page: props.page || 1, // Start with props.page
        limit: 30,
        searchData: context?.searchData || [],
    });

    const ratings = [5, 4, 3, 2, 1];

    const handleCheckBoxChange = (field, value) => {
        const currentValues = filters[field] || [];
        let updatedValues;

        if (field === "rating") {
            updatedValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];
        } else {
            updatedValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];

            // Clear search data when category filters change
            if (['categoryId', 'subCategoryId', 'thirdSubCategoryId'].includes(field)) {
                context?.setSearchData([]);
            }
        }

        setFilters(prevFilters => ({
            ...prevFilters,
            [field]: updatedValues,
            page: 1 // Reset to first page when filters change
        }));

        if (field === "categoryId") {
            setFilters(prevFilters => ({
                ...prevFilters,
                subCategoryId: [],
                thirdSubCategoryId: [],
            }));
        }
    };


    useEffect(() => {
        setFilters(prevFilters => ({
            ...prevFilters,
            minPrice: price[0],
            maxPrice: price[1],
            page: 1 // Reset to first page when price changes
        }));
    }, [price]);

     // Sync filters.page with parent's page
     useEffect(() => {
        setFilters(prev => ({
            ...prev,
            page: props.page || 1
        }));
    }, [props.page]);

    // When filters change (including page), update parent's page
    useEffect(() => {
        if (filters.page !== props.page) {
            props.setPage(filters.page);
        }
    }, [filters.page]);


    useEffect(() => {
        const url = window.location.href;
        const queryParameters = new URLSearchParams(location.search);

        const newFilters = {
            ...filters,
            page: 1,
            rating: [] // Reset rating when category changes
        };

        if (url.includes("categoryId")) {
            const categoryId = queryParameters.get("categoryId");
            newFilters.categoryId = [categoryId];
            newFilters.subCategoryId = [];
            newFilters.thirdSubCategoryId = [];
            context?.setSearchData([]);
        }

        if (url.includes("subCategoryId")) {
            const subCategoryId = queryParameters.get("subCategoryId");
            newFilters.categoryId = [];
            newFilters.subCategoryId = [subCategoryId];
            newFilters.thirdSubCategoryId = [];
            context?.setSearchData([]);
        }

        if (url.includes("thirdSubCategoryId")) {
            const thirdSubCategoryId = queryParameters.get("thirdSubCategoryId");
            newFilters.categoryId = [];
            newFilters.subCategoryId = [];
            newFilters.thirdSubCategoryId = [thirdSubCategoryId];
            context?.setSearchData([]);
        }

        setFilters(newFilters);
        props.setPage(1);
    }, [location.search]);

    // ... keep your selectedName effect the same ...


    const filtersData = async () => {
        props.setIsLoading(true);
        try {
            let totalItems = 0;
            let totalPages = 1;
            let currentPage = filters.page;
            let paginatedData = [];
    
            if (context?.searchData?.data?.length > 0) {
                // Apply filters to search results
                const filteredData = context.searchData.data.filter(product => {
                    return (
                        product.price >= filters.minPrice &&
                        product.price <= filters.maxPrice &&
                        (filters.rating.length === 0 || filters.rating.some(rating => Math.floor(product.rating) >= rating))
                    );
                });
    
                totalItems = filteredData.length; // Update total count after filtering
                totalPages = Math.ceil(totalItems / filters.limit) || 1;
    
                // Ensure the current page does not exceed the new total pages
                currentPage = Math.min(currentPage, totalPages);
                if (currentPage !== props.page) {
                    props.setPage(currentPage);
                }
    
                // Calculate pagination indices
                const startIndex = (currentPage - 1) * filters.limit + 1;
                const endIndex = Math.min(currentPage * filters.limit, totalItems);
    
                // Pass startIndex and endIndex to parent
                props.setIndex({ startIndex, endIndex });
    
                // Paginate filtered data
                const startIdx = (currentPage - 1) * filters.limit;
                paginatedData = filteredData.slice(startIdx, startIdx + filters.limit);
            } else {
                // Fetch from API to get correct total count and total pages
                const res = await postData(`/api/product/filters`, { ...filters, page: currentPage });
    
                totalItems = res?.total || 0;
                totalPages = res?.totalPages || Math.ceil(totalItems / filters.limit) || 1;
                currentPage = Math.min(currentPage, totalPages);
                paginatedData = res?.data || [];
    
                // Calculate and pass pagination indices
                const startIndex = (currentPage - 1) * filters.limit + 1;
                const endIndex = Math.min(currentPage * filters.limit, totalItems);
    
                props.setIndex({ startIndex, endIndex });
            }
    
            // Update state with full total count and paginated data
            props.setProductsData({
                data: paginatedData,
                total: totalItems, // Ensure UI knows the real total count
            });
            props.setTotalPages(totalPages);
            props.setTotal(totalItems);
    
            if (currentPage !== props.page) {
                props.setPage(currentPage);
            }
        } catch (error) {
            console.error("Filter error:", error);
            props.setPage(1);
        } finally {
            props.setIsLoading(false);
            window.scrollTo(0, 0);
        }
    };
    
    
    
    // Trigger API call when filters or page changes
    useEffect(() => {
        props.setIsLoading(true); // Set loading before starting the API call
    
        const timer = setTimeout(() => {
            filtersData();
        }, 300);
    
        return () => clearTimeout(timer);
    }, [filters, context?.searchData, filters.page]);
    
    
    

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
                                        checked={filters?.categoryId?.includes(item?._id)} // Ensures correct checked state
                                        label={item?.name}
                                        onChange={() => handleCheckBoxChange("categoryId", item?._id)}
                                        className="link w-full"
                                    />
                                ))}
                        </div>
                    </div>
                </Collapse>
            </div>

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
                            <span>low: <span className="rupee">₹</span><span className="font-semibold text-[13px]">{new Intl.NumberFormat('en-IN').format(price[0])}</span></span>
                            <span>high: <span className="rupee">₹</span><span className="font-semibold text-[13px]">{new Intl.NumberFormat('en-IN').format(price[1])}</span></span>
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
                                labelPlacement="end" // Ensure the label is placed after the checkbox
                            />
                        ))}
                    </div>
                </Collapse>
            </div>
        </aside>
    );
};

// Define propTypes for validation
Sidebar.propTypes = {
    setSelectedName: PropTypes.func.isRequired,  // Function to update selected name
    setIsLoading: PropTypes.func.isRequired,    // Function to set loading state
    setProductsData: PropTypes.func.isRequired, // Function to update product data
    setTotalPages: PropTypes.func.isRequired,   // Function to set total number of pages
    setTotal: PropTypes.func.isRequired,        // Function to update total product count
    page: PropTypes.number.isRequired,          // Current page number
    setPage: PropTypes.number.isRequired,          // Current page number
    setIndex: PropTypes.number.isRequired,          // Current page number
    filtersData: PropTypes.object,              // Filters data (add a shape if needed)
};

export default Sidebar;