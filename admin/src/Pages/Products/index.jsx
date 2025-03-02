import { Button, Checkbox, CircularProgress, FormControl, InputLabel, ListItemText, MenuItem, Rating, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import { useCallback, useContext, useEffect, useState } from 'react'
import { GoPlus } from 'react-icons/go'
import { RiDeleteBin6Line, RiDownloadCloud2Line, RiResetLeftFill } from 'react-icons/ri'
import { Link, useParams } from 'react-router-dom'
import ProgressBar from '../../Components/ProgressBar'
import { MdOutlineEdit, MdOutlineFilterListOff } from 'react-icons/md'
import { IoEyeOutline } from 'react-icons/io5'
import SearchBox from '../../Components/SearchBox'
import { MyContext } from '../../App'
import { deleteData, deleteMultipleData, fetchDataFromApi } from '../../utils/api'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import toast from 'react-hot-toast'




const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
    {
        id: 'product',
        label: 'PRODUCT',
        minWidth: 150,
        align: 'left'
    },
    {
        id: 'category',
        label: 'BROAD CATEGORY',
        minWidth: 170,
        align: 'left'
    },
    {
        id: 'subCategory',
        label: 'SUB CATEGORY',
        minWidth: 150,
        align: 'left'
    },
    {
        id: 'subCategory',
        label: 'SPECIFIC CATEGORY',
        minWidth: 180,
        align: 'left'
    },
    {
        id: 'price',
        label: 'PRICE',
        minWidth: 100,
        align: 'left',
        format: (value) => `$${value.toFixed(2)}`,
    },
    {
        id: 'sales',
        label: 'SALES',
        minWidth: 130,
        align: 'center'
    },
    {
        id: 'rating',
        label: 'RATING',
        minWidth: 100,
        align: 'center'
    },
    {
        id: 'action',
        label: 'ACTION',
        minWidth: 130,
        align: 'center'
    },
];


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: "auto",
        },
    },
};



const Products = () => {

    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryFilterValue, setCategoryFilterValue] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const [refreshData, setRefreshData] = useState(false); 

    const [productData, setProductData] = useState([]);
    // State to manage the selected categories for each level
    const [productCategory, setProductCategory] = useState([]);
    const [productCategory2, setProductCategory2] = useState([]);
    const [productCategory3, setProductCategory3] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [thirdLevelCategories, setThirdLevelCategories] = useState([]);

    // States to manage selected rows and select all functionality
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);



    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Construct query parameters dynamically
            const queryParams = new URLSearchParams();

            // Append category, subcategory, and thirdSubCategory filters if they exist
            if (productCategory.length > 0) {
                queryParams.append("categoryIds", productCategory.join(","));
            }
            if (productCategory2.length > 0) {
                queryParams.append("subCategoryIds", productCategory2.join(","));
            }
            if (productCategory3.length > 0) {
                queryParams.append("thirdSubCategoryIds", productCategory3.join(","));
            }

            // Edge case: No categories selected, fetch all products
            let query = "/api/product/get-all-products";

            // Apply filters only when any category type is selected
            if (queryParams.toString().length > 0) {
                query = `/api/product/get-all-filtered-products?${queryParams.toString()}`;
            }

            // Append pagination and other filtering parameters
            queryParams.append("page", page);
            queryParams.append("perPage", rowsPerPage);
            if (categoryFilterValue) {
                queryParams.append("categoryFilter", categoryFilterValue);
            }

            // Fetch filtered data
            const res = await fetchDataFromApi(query);
            setProductData(res?.data || []);
        } catch (error) {
            console.error("Error fetching product data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch products when categories or filters change
        fetchProducts();
    }, [productCategory, productCategory2, productCategory3, page, rowsPerPage, categoryFilterValue, context?.isReducer]);


    // Handle Category Change
    const handleChangeProductCategory = (event) => {
        const selectedCategories = event.target.value;
        setProductCategory(selectedCategories);

        // If a category is removed, reset subcategories and third-level categories
        if (selectedCategories.length === 0) {
            setProductCategory2([]);
            setProductCategory3([]);
            setSubCategories([]);
            setThirdLevelCategories([]);
        } else {
            // Filter subcategories based on the selected categories
            const newSubCategories = filterSubCategories(selectedCategories);
            setSubCategories(newSubCategories);

            // If no subcategories are found, reset subcategory and third-level category selections
            if (newSubCategories.length === 0) {
                setProductCategory2([]);
                setProductCategory3([]);
                setThirdLevelCategories([]);
            } else {
                // Reset third-level categories if the selected subcategories are no longer valid
                const validSubCategories = productCategory2.filter((subCatId) =>
                    newSubCategories.some((subCat) => subCat._id === subCatId)
                );
                setProductCategory2(validSubCategories);

                if (validSubCategories.length === 0) {
                    setProductCategory3([]);
                    setThirdLevelCategories([]);
                } else {
                    // Filter third-level categories based on the valid subcategories
                    const newThirdLevelCategories = filterThirdLevelCategories(validSubCategories);
                    setThirdLevelCategories(newThirdLevelCategories);

                    // If no third-level categories are found, reset third-level category selections
                    if (newThirdLevelCategories.length === 0) {
                        setProductCategory3([]);
                    } else {
                        // Reset third-level categories if the selected third-level categories are no longer valid
                        const validThirdLevelCategories = productCategory3.filter((thirdCatId) =>
                            newThirdLevelCategories.some((thirdCat) => thirdCat._id === thirdCatId)
                        );
                        setProductCategory3(validThirdLevelCategories);
                    }
                }
            }
        }
    };

    // Handle Subcategory Change
    const handleChangeProductCategory2 = (event) => {
        const selectedSubCategories = event.target.value;
        setProductCategory2(selectedSubCategories);

        // If a subcategory is removed, reset third-level categories
        if (selectedSubCategories.length === 0) {
            setProductCategory3([]);
            setThirdLevelCategories([]);
        } else {
            // Filter third-level categories based on the selected subcategories
            const newThirdLevelCategories = filterThirdLevelCategories(selectedSubCategories);
            setThirdLevelCategories(newThirdLevelCategories);

            // If no third-level categories are found, reset third-level category selections
            if (newThirdLevelCategories.length === 0) {
                setProductCategory3([]);
            } else {
                // Reset third-level categories if the selected third-level categories are no longer valid
                const validThirdLevelCategories = productCategory3.filter((thirdCatId) =>
                    newThirdLevelCategories.some((thirdCat) => thirdCat._id === thirdCatId)
                );
                setProductCategory3(validThirdLevelCategories);
            }
        }
    };

    // Handle Third-level Category Change
    const handleChangeProductCategory3 = (event) => {
        const selectedThirdLevelCategories = event.target.value;
        setProductCategory3(selectedThirdLevelCategories);
    };

    // Filter Subcategories based on Category Selection
    const filterSubCategories = (categoryIds) => {
        if (!context?.catData) return [];
        return context.catData
            .filter((cat) => categoryIds.includes(cat._id))
            .flatMap((cat) => cat.children || []);
    };

    // Filter Third-Level Categories based on Subcategory Selection
    const filterThirdLevelCategories = (subCategoryIds) => {
        if (!context?.catData) return [];
        return context.catData
            .flatMap((cat) => cat.children || [])
            .filter((subCat) => subCategoryIds.includes(subCat._id))
            .flatMap((subCat) => subCat.children || []);
    };

    // Reset filters function
    const resetFilters = () => {
        setProductCategory([]); // Reset selected categories
        setProductCategory2([]); // Reset selected subcategories
        setProductCategory3([]); // Reset selected third-level categories
        setSubCategories([]); // Clear subcategories
        setThirdLevelCategories([]); // Clear third-level categories
    };


    // Handle Select All
    const handleSelectAll = () => {
        console.log("Select All Clicked: ", selectAll);
        if (selectAll) {
            setSelectedRows([]); // Uncheck all, clear selected rows array
            console.log("Unchecking all rows");
        } else {
            // Select all rows in the current page by storing only the _id
            const allRows = productData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(product => product._id);
            setSelectedRows(allRows); // Select all rows
            console.log("Selecting all rows with IDs: ", allRows);
        }
        setSelectAll(!selectAll); // Toggle selectAll state
    };


    // Handle Row Select or Deselect
    const handleRowCheckboxChange = (product) => {
        console.log("Row Checkbox clicked for product: ", product);
        const isProductSelected = selectedRows.includes(product._id);
        console.log("Is Product Selected? ", isProductSelected);

        const newSelectedRows = isProductSelected
            ? selectedRows.filter(id => id !== product._id) // Remove product _id from selection
            : [...selectedRows, product._id]; // Add product _id to selection

        setSelectedRows(newSelectedRows);
        console.log("Updated selected rows (IDs): ", newSelectedRows);

        // Check if all rows are selected manually
        if (newSelectedRows.length === productData.length) {
            setSelectAll(true); // All rows are selected
            console.log("All rows selected");
        } else {
            setSelectAll(false); // Not all rows selected
            console.log("Not all rows selected");
        }
    };


    // Handle the rendering of individual row checkboxes
    const isRowSelected = (product) => selectedRows.includes(product._id);

    useEffect(() => {
        console.log("Selected rows (IDs) updated: ", selectedRows);
    }, [selectedRows]);

    useEffect(() => {
        console.log("Select All status changed: ", selectAll);
    }, [selectAll]);

    useEffect(() => {
        console.log("Product Data: ", productData);
    }, [productData]);

    useEffect(() => {
        console.log("Page: ", page, "Rows Per Page: ", rowsPerPage);
    }, [page, rowsPerPage]);




    const handleChangeCategoryFilterValue = (event) => {
        setCategoryFilterValue(event.target.value);
        setPage(0); // Reset to first page on category change
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filteredProductData = categoryFilterValue
        ? productData.filter((product) => product.categoryName === categoryFilterValue)
        : productData;

    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - filteredProductData.length)
            : 0;


    const handleEditCategory = (productId, productName) => {
        console.log("ProductListPage - Product ID :", productId);
        console.log("ProductListPage - Product Name :", productName);

        context.setIsOpenFullScreenPanel({
            open: true,
            model: "Product Details",
            productId: productId,
            productName: productName,
        });
    };



    const handleDeleteProduct = async (e, productId) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await toast.promise(
                deleteData(`/api/product/${productId}`),
                {
                    loading: "Deleting category... Please wait.",
                    success: (res) => {
                        if (res?.success) {
                            setProductData((prevData) => prevData.filter(product => product._id !== productId));
                            return res.message || "Product deleted successfully!";
                        } else {
                            throw new Error(res?.message || "An unexpected error occurred.");
                        }
                    },
                    error: (err) => {
                        return err?.response?.data?.message || err.message || "Failed to delete product. Please try again.";
                    },
                }
            );

            console.log("Delete Result:", result);
        } catch (err) {
            console.error("Error in handleDeleteProduct:", err);
            toast.error(err?.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };



    const handleDeleteSelectedRow = async (e, selectedRows) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log("Selected Rows:", selectedRows);

            // Validate selectedRows
            if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
                throw new Error("Invalid product IDs.");
            }

            // Convert array to comma-separated string
            const idsQueryParam = selectedRows.join(',');

            // Make DELETE request with query parameters
            const result = await toast.promise(
                deleteMultipleData(`/api/product/delete-multiple-products?ids=${idsQueryParam}`),
                {
                    loading: "Deleting product(s)... Please wait.",
                    success: (response) => {  // Removed async from here
                        if (response.success) {
                            // Update UI to remove the deleted products
                            setProductData((prevData) =>
                                prevData.filter((product) => !selectedRows.includes(product._id))
                            );
                            setSelectedRows([]); // Clear selected rows after successful deletion
                            setSelectAll(false); // Uncheck "Select All" checkbox
                            return response.message || "Product(s) deleted successfully!";
                        } else {
                            throw new Error(response.message || "An unexpected error occurred.");
                        }
                    },
                    error: (err) => {
                        return err.message || "Failed to delete product(s). Please try again.";
                    },
                }
            );

            console.log("Delete Result:", result);
        } catch (err) {
            console.error("Error in handleDeleteSelectedRow:", err);
            toast.error(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };









    return (
        <>

            <div className="card my-4 bg-white border rounded-md px-1">

                <div className='sticky top-0 left-0 z-10 mt-0 pt-16 flex w-full items-end justify-between rounded-md border border-gray-200 bg-gray-0 px-5 py-3.5 text-gray-900 shadow bg-white gap-4'>
                    <div className='flex items-center justify-between px-5 absolute left-2 top-2'>
                        <h2 className='text-[20px] font-bold'>Products <span className="font-normal text-[12px]">Material UI</span></h2>
                    </div>
                    <div className='col ml-auto flex items-center justify-end gap-3 absolute right-2 top-2'>
                        <Button className='!bg-green-600 !px-3 !text-white flex items-center gap-1 !capitalize' onClick={resetFilters}><MdOutlineFilterListOff className='text-[18px]' />Reset Filters</Button>
                        <Button className='!bg-[var(--bg-primary)] !px-3 !text-white flex items-center gap-1 !capitalize' onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Product Details' })}><GoPlus className='text-[20px]' />Add Product</Button>
                    </div>

                    <div className='col w-[35%]'>
                        <SearchBox searchName="products" />
                    </div>

                    {/* Category Dropdown */}
                    <div className='col w-[20%] ml-auto'>
                        <h4 className='font-bold text-[14px] mb-2'>Broad Category By</h4>
                        <FormControl fullWidth size="small">
                            <Select
                                multiple
                                labelId="productCategoryDropDownLabel"
                                id="productCategoryDropDown"
                                value={Array.isArray(productCategory) ? productCategory : []}
                                onChange={handleChangeProductCategory}
                                displayEmpty
                                MenuProps={MenuProps}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return <em>Sort by broad category</em>;
                                    }
                                    return selected
                                        .map((id) => {
                                            const item = context.catData.find((cat) => cat._id === id);
                                            return item ? item.name : "";
                                        })
                                        .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
                                        .join(", ");
                                }}
                            >
                                {context?.catData && context.catData.length > 0 ? (
                                    context.catData
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((item) => (
                                            <MenuItem key={item._id} value={item._id}>
                                                <Checkbox checked={productCategory.includes(item._id)} />
                                                <ListItemText primary={item.name} />
                                            </MenuItem>
                                        ))
                                ) : (
                                    <MenuItem disabled>No Data Available!</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </div>

                    {/* Subcategory Dropdown */}
                    <div className='col w-[20%]'>
                        <h4 className='font-bold text-[14px] mb-2'>Sub-Category By</h4>
                        <FormControl fullWidth size="small">
                            <Select
                                multiple
                                labelId="productSubCategoryDropDownLabel"
                                id="productSubCategoryDropDown"
                                value={Array.isArray(productCategory2) ? productCategory2 : []}
                                onChange={handleChangeProductCategory2}
                                displayEmpty
                                MenuProps={MenuProps}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return <em>Sort by subcategory</em>;
                                    }
                                    const selectedNames = selected
                                        .map((id) => {
                                            const item = subCategories.find((subCat) => subCat._id === id);
                                            return item ? item.name : null;
                                        })
                                        .filter((name) => name !== null);
                                    return selectedNames.length > 0 ? selectedNames.sort().join(", ") : <em>Sort by subcategory</em>;
                                }}
                            >
                                {subCategories.length > 0 ? (
                                    subCategories.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            <Checkbox checked={productCategory2.includes(item._id)} />
                                            <ListItemText primary={item.name} />
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No Data Available!</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </div>

                    {/* Third-level Category Dropdown */}
                    <div className='col w-[20%]'>
                        <h4 className='font-bold text-[14px] mb-2'>Specific Category By</h4>
                        <FormControl fullWidth size="small">
                            <Select
                                multiple
                                labelId="productThirdCategoryDropDownLabel"
                                id="productThirdCategoryDropDown"
                                value={Array.isArray(productCategory3) ? productCategory3 : []}
                                onChange={handleChangeProductCategory3}
                                displayEmpty
                                MenuProps={MenuProps}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return <em>Sort by third-level category</em>;
                                    }
                                    const selectedNames = selected
                                        .map((id) => {
                                            const item = thirdLevelCategories.find((thirdLevel) => thirdLevel._id === id);
                                            return item ? item.name : null;
                                        })
                                        .filter((name) => name !== null);
                                    return selectedNames.length > 0 ? selectedNames.sort().join(", ") : <em>Sort by third-level category</em>;
                                }}
                            >
                                {thirdLevelCategories.length > 0 ? (
                                    thirdLevelCategories.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            <Checkbox checked={productCategory3.includes(item._id)} />
                                            <ListItemText primary={item.name} />
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No Data Available!</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </div>


                </div>

                <TableContainer className='customScroll mt-5'>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="px-6 py-2 text-left">
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>


                            {loading ? (
                                <>

                                    {/* //Skeleton UI when loading */}

                                    {Array.from({ length: rowsPerPage }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="table-cell"><div className='flex items-center justify-center'><Skeleton variant="rectangular" width={18} height={18} /></div></TableCell>
                                            <TableCell className="table-cell">
                                                <div className="flex items-start gap-4 w-[350px]">
                                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group">
                                                        <Skeleton variant="rectangular" width={50} height={50} />
                                                    </div>
                                                    <div className="info w-[75%] flex flex-col items-start gap-1">
                                                        <Skeleton variant="text" width="100%" />
                                                        <Skeleton variant="text" width="50%" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="table-cell"><Skeleton variant="text" width="100%" /></TableCell>
                                            <TableCell className="table-cell"><Skeleton variant="text" width="100%" /></TableCell>
                                            <TableCell className="table-cell"><Skeleton variant="text" width="100%" /></TableCell>
                                            <TableCell className="table-cell">
                                                <div className="flex flex-col items-start justify-center gap-1">
                                                    <Skeleton variant="text" width="60%" />
                                                    <Skeleton variant="text" width="80%" />
                                                    <Skeleton variant="text" width="60%" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="table-cell">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <Skeleton variant="text" width="60%" />
                                                    <Skeleton variant="text" sx={{ fontSize: '5px' }} width="100%" />
                                                    <Skeleton variant="text" width="60%" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="table-cell">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Skeleton variant="circular" width="15px" height="15px" />
                                                    <Skeleton variant="circular" width="15px" height="15px" />
                                                    <Skeleton variant="circular" width="15px" height="15px" />
                                                    <Skeleton variant="circular" width="15px" height="15px" />
                                                    <Skeleton variant="circular" width="15px" height="15px" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton variant="rectangular" width={35} height={35} />
                                                    <Skeleton variant="rectangular" width={35} height={35} />
                                                    <Skeleton variant="rectangular" width={35} height={35} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>

                            ) : productData?.length === 0 ? (
                                // No Records Available message after data is loaded but no data exists
                                <TableRow>
                                    <TableCell colSpan={8} align="center" style={{ height: 300 }}>
                                        <span className="text-[var(--text-light)] text-[14px] font-regular flex items-center justify-center gap-2">
                                            &#128193; No Records Available
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                // Actual data rendering
                                productData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="table-cell">
                                            <Checkbox checked={isRowSelected(product)} onChange={() => handleRowCheckboxChange(product)} />
                                        </TableCell>
                                        <TableCell className="table-cell">
                                            <div className="flex items-start gap-4 w-[350px]">
                                                <div className="img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group">
                                                    <Link to={`/product/${product?._id}`}>
                                                        <LazyLoadImage
                                                            alt="product_img"
                                                            effect="blur"
                                                            src={product.images[0]}
                                                            className="w-full h-full object-cover hover:scale-110 transition-all duration-300"
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="info w-[75%] flex flex-col items-start gap-1">
                                                    <Link to={`/product/${product?._id}`}>
                                                        <h3 className="text-[12px] font-bold leading-4 hover:text-[var(--text-active)]">
                                                            {product?.name}
                                                        </h3>
                                                    </Link>
                                                    <span className="text-[12px]">{product?.brand}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="table-cell">{product?.categoryName}</TableCell>
                                        <TableCell className="table-cell">{product?.subCategoryName}</TableCell>
                                        <TableCell className="table-cell">{product?.thirdSubCategoryName}</TableCell>
                                        <TableCell className="table-cell">
                                            <div className="flex flex-col items-start justify-center gap-1">
                                                <span className="price text-[14px] font-bold flex items-center">
                                                    &#8377;<span>{new Intl.NumberFormat("en-IN").format(product?.price)}</span>
                                                </span>
                                                <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                                                    &#8377;<span>{new Intl.NumberFormat("en-IN").format(product?.oldPrice)}</span>
                                                </span>
                                                <span className="text-[12px] text-[var(--off-color)] font-medium">{product?.discount}% off</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="table-cell">
                                            <p className="text-[14px] flex flex-col gap-1 justify-center text-center">
                                                <span>
                                                    <span className="font-bold">{product?.sale}</span> sold
                                                </span>
                                                <ProgressBar value={(product?.sale / product?.countInStock) * 100} type="success" />
                                                <span>
                                                    <span className="text-[14px] font-bold">
                                                        {product?.countInStock}
                                                    </span> remain
                                                </span>
                                            </p>
                                        </TableCell>
                                        <TableCell className="table-cell">
                                            <p className="text-[14px] flex flex-col gap-1 justify-center text-center">
                                                <Rating name="rating" size='small' defaultValue={product?.rating} max={5} readOnly />
                                            </p>
                                        </TableCell>
                                        <TableCell className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <Tooltip title="Edit Product" arrow placement="top">
                                                    <Button className="!h-[35px] !w-[35px] !min-w-[35px] !bg-blue-500 !text-white shadow" onClick={() => handleEditCategory(product?._id, product?.name)}>
                                                        <MdOutlineEdit className="text-[35px]" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="View Product" arrow placement="top">
                                                    <Link to={`/product/${product?._id}`}>
                                                        <Button className="!h-[35px] !w-[35px] !min-w-[35px] !bg-yellow-400 !text-white shadow">
                                                            <IoEyeOutline className="text-[35px]" />
                                                        </Button>
                                                    </Link>
                                                </Tooltip>
                                                <Tooltip title="Delete Product" arrow placement="top">
                                                    <Button className="!h-[35px] !w-[35px] !min-w-[35px] !bg-red-500 !text-white shadow" onClick={(e) => handleDeleteProduct(e, product?._id)}>
                                                        <RiDeleteBin6Line className="text-[35px]" />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))

                            )

                            }


                            {emptyRows > 0 && (
                                <TableRow style={{ height: 15 * emptyRows }}>
                                    <TableCell colSpan={8}>
                                    </TableCell>
                                </TableRow>
                            )}


                        </TableBody>

                    </Table>
                </TableContainer>


                {
                    selectedRows.length > 0 &&

                    <div className='sticky bottom-0 left-0 z-10 mt-2.5 flex w-full items-center justify-between rounded-md border border-gray-200 bg-gray-0 px-5 py-3.5 text-gray-900 shadow bg-white gap-4'>
                        {selectedRows.length > 0 && (
                            <span>
                                <span className='font-bold'>{selectedRows.length}</span> product{selectedRows.length > 1 ? 's' : ''} selected
                            </span>
                        )}
                        <Button
                            type="reset"
                            onClick={(e) => handleDeleteSelectedRow(e, selectedRows)}
                            className='!bg-red-500 !text-white w-[150px] h-[40px] flex items-center justify-center gap-2'
                        >
                            <RiDeleteBin6Line className='text-[20px]' />Delete
                        </Button>
                    </div>

                }

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={productData?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    MenuProps={MenuProps}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />




            </div>

        </>
    )
}

export default Products
