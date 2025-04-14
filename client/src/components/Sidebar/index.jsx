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
import { useLocation, useNavigate } from 'react-router-dom';
import { postData } from '../../utils/api';
import PropTypes from 'prop-types';
import { LuFilterX } from 'react-icons/lu';



const Sidebar = (props) => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
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

    const sidebar = useRef(null);

    const ratings = [5, 4, 3, 2, 1];



    // const handleCheckBoxChange = (field, value) => {
    //     const currentValues = filters[field] || [];
    //     let updatedValues;

    //     if (field === "rating") {
    //         updatedValues = currentValues.includes(value)
    //             ? currentValues.filter((item) => item !== value)
    //             : [...currentValues, value];
    //     } else {
    //         updatedValues = currentValues.includes(value)
    //             ? currentValues.filter((item) => item !== value)
    //             : [...currentValues, value];

    //         // Clear search data when category filters change
    //         if (['categoryId', 'subCategoryId', 'thirdSubCategoryId'].includes(field)) {
    //             context?.setSearchData([]);
    //         }
    //     }

    //     setFilters(prevFilters => ({
    //         ...prevFilters,
    //         [field]: updatedValues,
    //         page: 1 // Reset to first page when filters change
    //     }));

    //     if (field === "categoryId") {
    //         setFilters(prevFilters => ({
    //             ...prevFilters,
    //             subCategoryId: [],
    //             thirdSubCategoryId: [],
    //         }));
    //     }
    // };


    // // Preserve state when URL changes
    // useEffect(() => {
    //     const url = window.location.href;
    //     const queryParameters = new URLSearchParams(location.search);

    //     const newFilters = {
    //         ...filters,
    //         page: 1,
    //         rating: [] // Reset rating when category changes
    //     };


    //     if (url.includes("categoryId")) {
    //         const categoryId = queryParameters.get("categoryId");
    //         newFilters.categoryId = [categoryId];
    //         newFilters.subCategoryId = [];
    //         newFilters.thirdSubCategoryId = [];
    //         context?.setSearchData([]);
    //         context?.setIsSearch('')
    //     }

    //     if (url.includes("subCategoryId")) {
    //         const subCategoryId = queryParameters.get("subCategoryId");
    //         newFilters.categoryId = [];
    //         newFilters.subCategoryId = [subCategoryId];
    //         newFilters.thirdSubCategoryId = [];
    //         context?.setSearchData([]);
    //         context?.setIsSearch('')
    //     }

    //     if (url.includes("thirdSubCategoryId")) {
    //         const thirdSubCategoryId = queryParameters.get("thirdSubCategoryId");
    //         newFilters.categoryId = [];
    //         newFilters.subCategoryId = [];
    //         newFilters.thirdSubCategoryId = [thirdSubCategoryId];
    //         context?.setSearchData([]);
    //         context?.setIsSearch('')
    //     }

    //     setFilters(newFilters);
    //     props.setPage(1);
    // }, [location.search]);


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
                context?.setSearchQuery('');  // <-- Reset search query
                context?.setIsSearch('');
                context?.setIsFilterApplied(false);

                navigate("/search"); // Update URL to "/search"
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

    //     // Sync selected names for UI display
    // const handleCheckBoxChange = (field, value) => {
    //     const currentValues = filters[field] || [];
    //     let updatedValues = currentValues.includes(value)
    //         ? currentValues.filter((item) => item !== value)
    //         : [...currentValues, value];

    //     // Clear search data when category filters change
    //     if (["categoryId", "subCategoryId", "thirdSubCategoryId"].includes(field)) {
    //         context?.setSearchData([]);
    //         context?.setIsSearch('');
    //         context?.setSearchQuery('');  // <-- Reset search query
    //         navigate("/search"); // Update URL to "/search"
    //     }

    //     // Update filters immediately
    //     const newFilters = {
    //         ...filters,
    //         [field]: updatedValues,
    //         page: 1, // Reset to first page when filters change
    //     };

    //     // Reset subcategories if category changes
    //     if (field === "categoryId") {
    //         newFilters.subCategoryId = [];
    //         newFilters.thirdSubCategoryId = [];
    //     }

    //     setFilters(newFilters);
    // };

    // Compute selected names for UI display
    useEffect(() => {
        let selectedNames = [];

        // If search is active, set selectedNames based on search results
        if (context?.isSearch && context?.searchData?.length > 0) {
            selectedNames = context.searchData.map(item => item.name);
        } else {
            // Reset to default if no filters are applied
            const isFiltersEmpty =
                (!filters.categoryId || filters.categoryId.length === 0) &&
                (!filters.subCategoryId || filters.subCategoryId.length === 0) &&
                (!filters.thirdSubCategoryId || filters.thirdSubCategoryId.length === 0);

            if (isFiltersEmpty) {
                selectedNames = ["All Categories"];
            } else if (context?.catData?.length > 0) {
                filters.categoryId?.forEach(categoryId => {
                    const category = context.catData.find(cat => cat._id === categoryId);
                    if (category) {
                        const hasSelectedSubcategories = category.children?.some(subCat =>
                            filters.subCategoryId?.includes(subCat._id)
                        );

                        if (!hasSelectedSubcategories) {
                            selectedNames.push(category.name);
                        }

                        category.children?.forEach(subCat => {
                            if (filters.subCategoryId?.includes(subCat._id)) {
                                const hasSelectedThirdSubcategories = subCat.children?.some(thirdCat =>
                                    filters.thirdSubCategoryId?.includes(thirdCat._id)
                                );

                                if (!hasSelectedThirdSubcategories) {
                                    selectedNames.push(subCat.name);
                                }

                                subCat.children?.forEach(thirdSubCat => {
                                    if (filters.thirdSubCategoryId?.includes(thirdSubCat._id)) {
                                        selectedNames.push(thirdSubCat.name);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }

        // Default to "All Categories" if nothing is selected
        if (selectedNames.length === 0) {
            selectedNames = ["All Categories"];
        }

        console.log("Selected names:", selectedNames); // Debugging
        props?.setSelectedName?.(selectedNames.join(" + "));
    }, [filters, context?.catData, context?.isSearch, context?.searchData]);


    // Sync filters with URL changes
    useEffect(() => {
        const queryParameters = new URLSearchParams(location.search);

        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };

            if (location.search.includes("categoryId")) {
                newFilters.categoryId = queryParameters.get("categoryId") ? [queryParameters.get("categoryId")] : [];
                newFilters.subCategoryId = [];
                newFilters.thirdSubCategoryId = [];
                context?.setSearchData([]);
                context?.setIsSearch('');
            }

            if (location.search.includes("subCategoryId")) {
                newFilters.subCategoryId = queryParameters.get("subCategoryId") ? [queryParameters.get("subCategoryId")] : [];
                newFilters.thirdSubCategoryId = [];
                context?.setSearchData([]);
                context?.setIsSearch('');
            }

            if (location.search.includes("thirdSubCategoryId")) {
                newFilters.thirdSubCategoryId = queryParameters.get("thirdSubCategoryId") ? [queryParameters.get("thirdSubCategoryId")] : [];
                context?.setSearchData([]);
                context?.setIsSearch('');
            }

            return newFilters;
        });

        props.setPage(1);
    }, [location.search]);



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


    // Effect to sync page changes between filters and props
    useEffect(() => {
        // Only update parent page if it's different from filters.page
        if (props.page !== undefined && filters.page !== props.page) {
            props.setPage?.(filters.page);
        }
    }, [filters.page]); // Only runs when filters.page changes



    // const filtersData = async () => {
    //     props.setIsLoading(true);
    //     try {
    //         let totalItems = 0;
    //         let totalPages = 1;
    //         let currentPage = filters.page;
    //         let paginatedData = [];

    //         // Check data availability and active filters
    //         const hasSearchData = Array.isArray(context?.searchData?.data) && context.searchData.data.length > 0;
    //         const hasFilteredData = Array.isArray(context?.filteredProductData?.data) && context.filteredProductData.data.length > 0;
    //         const hasActiveFilters = filters.categoryId.length > 0 || 
    //                                filters.subCategoryId.length > 0 || 
    //                                filters.thirdSubCategoryId.length > 0 ||
    //                                filters.price || 
    //                                filters.rating.length > 0;

    //         // 1. Handle fresh filter applications (API call)
    //         if (hasActiveFilters) {
    //             console.log("Fetching fresh filtered data from API...");
    //             const res = await postData(`/api/product/filters`, { 
    //                 ...filters, 
    //                 page: 1,
    //                 limit: Number.MAX_SAFE_INTEGER 
    //             });

    //             context?.setFilteredProductData({
    //                 data: res,
    //                 total: res.total,
    //                 isFresh: true
    //             });
    //             return; // Exit early for active filters, will re-run after state update
    //         }

    //         // 2. Handle search data (client-side filtering)
    //         if (hasSearchData) {
    //             console.log("Using local search data for filtering...");

    //             // Reset price & rating filters for new searches
    //             if (filters.searchData.length > 0) {
    //                 setFilters(prev => ({
    //                     ...prev,
    //                     minPrice: null,
    //                     maxPrice: null,
    //                     rating: [],
    //                 }));
    //             }

    //             const filteredData = context.searchData.data.filter(product => {
    //                 const priceMatch = (!filters.minPrice || product.price >= filters.minPrice) && 
    //                                  (!filters.maxPrice || product.price <= filters.maxPrice);
    //                 const ratingMatch = filters.rating.length === 0 || 
    //                                     filters.rating.some(r => Math.floor(product.rating) >= r);
    //                 return priceMatch && ratingMatch;
    //             });

    //             totalItems = filteredData.length;
    //             totalPages = Math.max(1, Math.ceil(totalItems / filters.limit));
    //             currentPage = Math.min(currentPage, totalPages);

    //             if (currentPage !== props.page) {
    //                 props.setPage(currentPage);
    //             }

    //             const startIdx = (currentPage - 1) * filters.limit;
    //             paginatedData = filteredData.slice(startIdx, startIdx + filters.limit);
    //         } 
    //         // 3. Handle filtered product data (from previous API calls)
    //         else if (hasFilteredData) {
    //             console.log("Using existing filtered data...");

    //             totalItems = context.filteredProductData.total;
    //             totalPages = Math.max(1, Math.ceil(totalItems / filters.limit));
    //             currentPage = Math.min(currentPage, totalPages);

    //             const startIdx = (currentPage - 1) * filters.limit;
    //             paginatedData = context.filteredProductData.data.slice(startIdx, startIdx + filters.limit);
    //         }
    //         // 4. Initial load - fetch default products when both states are empty
    //         else {
    //             console.log("Initial load - fetching default products...");
    //             const res = await postData(`/api/product/filters`, { 
    //                 page: 1,
    //                 limit: Number.MAX_SAFE_INTEGER 
    //             });

    //             context?.setFilteredProductData({
    //                 data: res,
    //                 total: res.total,
    //                 isFresh: true
    //             });
    //             return; // Exit early, will re-run after state update
    //         }

    //         // Update display data in real-time
    //         updateDisplayData(paginatedData, totalItems, totalPages, currentPage);

    //     } catch (error) {
    //         console.error("Filter error:", error);
    //         handleError();
    //     } finally {
    //         props.setIsLoading(false);
    //         window.scrollTo(0, 0);
    //     }
    // };

    // // Helper function to update display data
    // const updateDisplayData = (data, total, pages, currentPage) => {
    //     const startIndex = (currentPage - 1) * filters.limit + 1;
    //     const endIndex = Math.min(currentPage * filters.limit, total);

    //     props.setIndex({ startIndex, endIndex });
    //     props.setProductsData({ data, total });
    //     props.setTotalPages(pages);
    //     props.setTotal(total);

    //     if (data.length === 0) {
    //         props.setPage(1);
    //     }

    //     console.log("Filtering completed:", {
    //         currentPage,
    //         totalPages: pages,
    //         totalItems: total,
    //         items: data.length
    //     });
    // };

    // // Error handling function
    // const handleError = () => {
    //     props.setPage(1);
    //     props.setProductsData({ data: [], total: 0 });
    //     props.setTotalPages(0);
    // };


    const filtersData = async () => {
        props.setIsLoading(true);
        try {
            let totalItems = 0;
            let totalPages = 1;
            let currentPage = filters.page;
            let paginatedData = [];

            console.log("Context searchData Data: ", context.searchData); // Debugging log
            console.log("Context filteredProductData Data: ", context.filteredProductData); // Debugging log

            if (Array.isArray(context?.searchData?.data) && context.searchData.data.length > 0) {
                console.log("Using local search data for filtering...");
                props.setSelectedSortValue('');
                // 🔹 If it's a new search, remove price & rating filters
                if (filters.searchData.length > 0) {
                    setFilters((prevFilters) => ({
                        ...prevFilters,
                        minPrice: null,
                        maxPrice: null,
                        rating: [],
                    }));
                }

                // const filteredData = context.searchData.data.filter(product => {
                //     return (
                //         product.price >= filters.minPrice &&
                //         product.price <= filters.maxPrice &&
                //         (filters.rating.length === 0 || filters.rating.some(rating => Math.floor(product.rating) >= rating))
                //     );
                // });

                const filteredData = Array.isArray(context.searchData.data)
                    ? context.searchData.data.filter(product => {
                        return (
                            (filters.minPrice === null || product.price >= filters.minPrice) &&
                            (filters.maxPrice === null || product.price <= filters.maxPrice) &&
                            (filters.rating.length === 0 || filters.rating.some(rating => Math.floor(product.rating) >= rating))
                        );
                    })
                    : [];

                totalItems = filteredData.length;
                totalPages = Math.max(1, Math.ceil(totalItems / filters.limit));

                currentPage = Math.min(currentPage, totalPages);
                if (currentPage !== props.page) {
                    props.setPage(currentPage);
                }

                const startIndex = (currentPage - 1) * filters.limit + 1;
                const endIndex = Math.min(currentPage * filters.limit, totalItems);
                props.setIndex({ startIndex, endIndex });

                const startIdx = (currentPage - 1) * filters.limit;
                paginatedData = filteredData.slice(startIdx, startIdx + filters.limit);
            } else {
                console.log("Using filtered data for filtering...");

                // context?.setIsFilterApplied(true);

                // Apply filters to product data
                // const filteredData = context.filteredProductData.data.filter(product => {
                //     return (
                //         (filters.minPrice === null || product.price >= filters.minPrice) &&
                //         (filters.maxPrice === null || product.price <= filters.maxPrice) &&
                //         (filters.rating.length === 0 || filters.rating.some(rating => Math.floor(product.rating) >= rating))
                //     );
                // });

                const filteredData = Array.isArray(context?.filteredProductData?.data)
                    ? context.filteredProductData.data.filter(product => {
                        return (
                            (filters.minPrice === null || product.price >= filters.minPrice) &&
                            (filters.maxPrice === null || product.price <= filters.maxPrice) &&
                            (filters.rating.length === 0 || filters.rating.some(rating => Math.floor(product.rating) >= rating))
                        );
                    })
                    : [];

                totalItems = filteredData.length;
                totalPages = Math.max(1, Math.ceil(totalItems / filters.limit));

                currentPage = Math.min(currentPage, totalPages);
                if (currentPage !== props.page) {
                    props.setPage(currentPage);
                }

                const startIndex = (currentPage - 1) * filters.limit + 1;
                const endIndex = Math.min(currentPage * filters.limit, totalItems);
                props.setIndex({ startIndex, endIndex });

                const startIdx = (currentPage - 1) * filters.limit;
                paginatedData = filteredData.slice(startIdx, startIdx + filters.limit);
            }

            // 🔹 Update `productsData` with the results
            props.setProductsData({
                data: paginatedData,
                total: totalItems,
            });

            props.setTotalPages(totalPages);
            props.setTotal(totalItems);

            // 🔹 Reset page to 1 if no data is found
            if (paginatedData.length === 0) {
                props.setPage(1);
                props.setTotalPages(1); // Changed from 0 to 1 to avoid potential issues
            }

            console.log("Final Products Data: ", paginatedData); // Debugging log

        } catch (error) {
            console.error("Filter error:", error);
            props.setPage(1);
            // Consider setting some error state here
        } finally {
            props.setIsLoading(false);
            window.scrollTo(0, 0);
        }
    };

    useEffect(() => {
        const fetchFilteredData = async () => {
            console.warn("Fetching from API due to empty searchData...");

            if (filters) {
                try {
                    const res = await postData(`/api/product/filters`, {
                        ...filters,
                        page: 1,
                        limit: Number.MAX_SAFE_INTEGER // Use the actual limit
                    });
                    context?.setFilteredProductData(res);
                    // props.setSelectedSortValue('');
                } catch (error) {
                    console.error("Error fetching filtered data:", error);
                }
            }
        };

        fetchFilteredData();
    }, [filters.minPrice, filters.maxPrice, filters.rating, filters.searchData, filters.categoryId, filters.subCategoryId, filters.thirdSubCategoryId]); // Dependency array ensures the effect runs when `filters` change


    // Trigger API call when filters or page changes
    useEffect(() => {
        props.setIsLoading(true); // Set loading before starting the API call

        const timer = setTimeout(() => {
            filtersData();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters, context?.searchData, context?.filteredProductData, filters.page]);

    // Step 1: Fetch filtered data when filters change
// useEffect(() => {
//     const fetchFilteredData = async () => {
//         console.warn("Fetching from API due to filter change...");
//         try {
//             const res = await postData(`/api/product/filters`, {
//                 ...filters,
//                 page: 1,
//                 limit: Number.MAX_SAFE_INTEGER,
//             });
//             context?.setFilteredProductData(res);
//         } catch (error) {
//             console.error("Error fetching filtered data:", error);
//         }
//     };

//     fetchFilteredData();
// }, [filters.minPrice, filters.maxPrice, filters.rating, filters.searchData, filters.categoryId, filters.subCategoryId, filters.thirdSubCategoryId]);


// // Step 2: Apply filtering only when filteredProductData is updated
// useEffect(() => {
//     props.setIsLoading(true);
//     const timer = setTimeout(() => {
//         filtersData();
//     }, 300);

//     return () => clearTimeout(timer);
// }, [context.filteredProductData, filters.page]);

    
    


    return (
        // <aside className="sidebar">
        //     <div className="p-1 border-x border-t rounded-t-md">
        //         <h3 className="p-2 px-4 text-[18px] font-semibold uppercase">Filters</h3>
        //     </div>

        //     <div className="box border">
        //         <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
        //             Categories
        //             <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter1(!isOpenCategoryFilter1) }}> {isOpenCategoryFilter1 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
        //         </h3>
        //         <Collapse isOpened={isOpenCategoryFilter1}>
        //             <div className="relative flex flex-col w-full mb-1">
        //                 <div className="px-4 flex flex-col w-full mb-2 capitalize">
        //                     {context?.catData?.length !== 0 &&
        //                         context?.catData.map((item, index) => (
        //                             <FormControlLabel
        //                                 key={index}
        //                                 value={item?._id}
        //                                 control={<Checkbox size="small" />}
        //                                 checked={filters?.categoryId?.includes(item?._id)} // Ensures correct checked state
        //                                 label={item?.name}
        //                                 onChange={() => handleCheckBoxChange("categoryId", item?._id)}
        //                                 className="link w-full"
        //                             />
        //                         ))}
        //                 </div>
        //             </div>
        //         </Collapse>
        //     </div>

        //     <div className="box border-x border-b">
        //         <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
        //             Price
        //             <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter4(!isOpenCategoryFilter4) }}> {isOpenCategoryFilter4 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
        //         </h3>
        //         <Collapse isOpened={isOpenCategoryFilter4}>
        //             <div className="p-5  flex flex-col w-full capitalize">
        //                 <RangeSlider
        //                     value={price}
        //                     onInput={setPrice}
        //                     min={100}
        //                     max={400000}
        //                     step={10}
        //                 />

        //                 <div className="py-4 px-0 text-[12px] flex items-center justify-between priceRange">
        //                     <span>low: <span className="rupee">₹</span><span className="font-semibold text-[13px]">{new Intl.NumberFormat('en-IN').format(price[0])}</span></span>
        //                     <span>high: <span className="rupee">₹</span><span className="font-semibold text-[13px]">{new Intl.NumberFormat('en-IN').format(price[1])}</span></span>
        //                 </div>
        //             </div>
        //         </Collapse>
        //     </div>

        //     <div className="box border-x border-b rounded-b-md ">
        //         <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
        //             Rating
        //             <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter5(!isOpenCategoryFilter5) }}> {isOpenCategoryFilter5 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
        //         </h3>
        //         <Collapse isOpened={isOpenCategoryFilter5}>
        //             <div className="p-5 pt-0  flex flex-col w-full lowercase">
        //                 {ratings.map((rating) => (
        //                     <FormControlLabel
        //                         key={rating}
        //                         className="link w-full"
        //                         control={
        //                             <Checkbox
        //                                 size="small"
        //                                 checked={filters?.rating?.includes(rating)}
        //                                 onChange={() => handleCheckBoxChange("rating", rating)}
        //                             />
        //                         }
        //                         label={
        //                             <div className="flex items-center gap-2">
        //                                 <Rating
        //                                     name={`rating-${rating}`}
        //                                     defaultValue={rating}
        //                                     precision={0.5}
        //                                     size="small"
        //                                     readOnly
        //                                 />
        //                                 <span>& above</span>
        //                             </div>
        //                         }
        //                         labelPlacement="end" // Ensure the label is placed after the checkbox
        //                     />
        //                 ))}
        //             </div>
        //         </Collapse>
        //     </div>
        // </aside>

        <aside className="sidebar relative bg-white">
            {/* Filters Header */}
            <div className="sticky -top-3 z-10 w-full p-1 border-x border-t shadow bg-white rounded-t-md flex justify-between items-center pr-2">
                {/* <div className="sticky top-0 z-[50] w-full p-1 border-x border-t rounded-t-md"> */}
                <h3 className="p-2 px-4 text-lg font-semibold uppercase">Filters</h3>
                {
                    context?.isFilterApplied &&
                    <Button className='!bg-primary !text-white !text-[18px] !w-[35px] !min-w-[35px] !h-[35px] !rounded-full' ><LuFilterX /></Button>
                }
            </div>

            {/* Categories Filter */}
            <div className="border-x border-t">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="text-base font-semibold uppercase">Categories</h3>
                    <button
                        className="w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpenCategoryFilter1(!isOpenCategoryFilter1)}
                    >
                        {isOpenCategoryFilter1 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                </div>
                <Collapse isOpened={isOpenCategoryFilter1}>
                    <div className="px-4 py-2 space-y-2">
                        {context?.catData?.length > 0 && context.catData.map((item, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={filters?.categoryId?.includes(item?._id)}
                                        onChange={() => handleCheckBoxChange("categoryId", item?._id)}
                                    />
                                }
                                label={item?.name}
                                className="w-full m-0 capitalize"
                            />
                        ))}
                    </div>
                </Collapse>
            </div>

            {/* Price Filter */}
            <div className="border-x  border-t">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="text-base font-semibold uppercase">Price</h3>
                    <button
                        className="w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpenCategoryFilter4(!isOpenCategoryFilter4)}
                    >
                        {isOpenCategoryFilter4 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                </div>
                <Collapse isOpened={isOpenCategoryFilter4}>
                    <div className="p-4 space-y-4">
                        <RangeSlider
                            value={price}
                            onInput={setPrice}
                            min={100}
                            max={400000}
                            step={10}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">
                                Low: ₹{new Intl.NumberFormat('en-IN').format(price[0])}
                            </span>
                            <span className="font-medium">
                                High: ₹{new Intl.NumberFormat('en-IN').format(price[1])}
                            </span>
                        </div>
                    </div>
                </Collapse>
            </div>

            {/* Rating Filter */}
            <div className="border-x  border-t border-b rounded-b-md">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="text-base font-semibold uppercase">Rating</h3>
                    <button
                        className="w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpenCategoryFilter5(!isOpenCategoryFilter5)}
                    >
                        {isOpenCategoryFilter5 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                </div>
                <Collapse isOpened={isOpenCategoryFilter5}>
                    <div className="px-4 py-2 space-y-2">
                        {ratings.map((rating) => (
                            <FormControlLabel
                                key={rating}
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
                                            value={rating}
                                            precision={0.5}
                                            size="small"
                                            readOnly
                                        />
                                        <span className="text-sm lowercase">& above</span>
                                    </div>
                                }
                                className="w-full m-0"
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
    setSelectedSortValue: PropTypes.func.isRequired,        // Function to update total product count
};

export default Sidebar;