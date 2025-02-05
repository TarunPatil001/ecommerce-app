import { useState, useContext } from 'react'
import { MyContext } from '../../App'
import DashboardBoxes from '../../Components/DashboardBoxes'
import { Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Pagination, Rating, Skeleton } from '@mui/material'
import { Tooltip } from '@mui/material'
import { FiPlus } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Badge from '../../Components/Badge';
import { Link, useNavigate } from 'react-router-dom';
import ProgressBar from '../../Components/ProgressBar';
import { MdOutlineEdit, MdOutlineFilterListOff } from 'react-icons/md';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBin6Line, RiDownloadCloud2Line } from "react-icons/ri";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import { GoDotFill, GoPlus } from "react-icons/go";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip as RechartTooltip, XAxis, YAxis } from 'recharts';
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { deleteData, deleteMultipleData, fetchDataFromApi } from '../../utils/api'
import SearchBox from '../../Components/SearchBox'
import { LazyLoadImage } from 'react-lazy-load-image-component'

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


const Dashboard = () => {

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [isOpenOrder, setIsOpenOrder] = useState(null);

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


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token !== undefined && token !== null && token !== '') {
      context?.setIsLogin(true);
    } else {
      navigate("/sign-in");
    }
  }, [context, navigate]);



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























  const isShowOrderedProduct = (index) => {
    if (isOpenOrder === index) {
      setIsOpenOrder(null);
    } else {
      setIsOpenOrder(index);
    }
  }


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
                        setSelectedRows([]);
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






  const [chartData1, setChartData1] = useState([
    {
      name: "JANUARY",
      Total_Users: 4000,
      Total_Sales: 2400,
      amt: 2400,
    },
    {
      name: "FEBRUARY",
      Total_Users: 3000,
      Total_Sales: 1398,
      amt: 2210,
    },
    {
      name: "MARCH",
      Total_Users: 2000,
      Total_Sales: 9800,
      amt: 2290,
    },
    {
      name: "APRIL",
      Total_Users: 2780,
      Total_Sales: 3908,
      amt: 2000,
    },
    {
      name: "MAY",
      Total_Users: 1890,
      Total_Sales: 4800,
      amt: 2181,
    },
    {
      name: "JUNE",
      Total_Users: 2390,
      Total_Sales: 3800,
      amt: 2500,
    },
    {
      name: "JULY",
      Total_Users: 3490,
      Total_Sales: 4300,
      amt: 2100,
    },
    {
      name: "AUGUST",
      Total_Users: 5490,
      Total_Sales: 4900,
      amt: 2100,
    },
    {
      name: "SEPTEMBER",
      Total_Users: 8490,
      Total_Sales: 4700,
      amt: 2100,
    },
    {
      name: "OCTOBER",
      Total_Users: 7490,
      Total_Sales: 6300,
      amt: 2100,
    },
    {
      name: "NOVEMBER",
      Total_Users: 9490,
      Total_Sales: 2300,
      amt: 2100,
    },
    {
      name: "DECEMBER",
      Total_Users: 5490,
      Total_Sales: 7300,
      amt: 2100,
    },
  ]
  );


  return (
    <>
      <div className={'w-full px-5 py-2 bg-white hover:bg-[var(--bg-hover-primary)] border border-[rgba(0,0,0,0.1)] flex items-center justify-between gap-8 mb-5 rounded-md'}>
        <div className="info">
          <h1 className='text-[30px] font-bold leading-9 mb-2'>Good Morning, <br /> Cameron &#128075;</h1>
          <p className='text-[16px] mb-10'>Here’s What happening on your store today. See the statistics at once.</p>
          <Button className='flex items-center gap-1 !capitalize !text-[14px] !font-medium !text-white !bg-[var(--text-active)] !p-2 !px-4' onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Product Details' })}><FiPlus className='text-[18px]' />Add Product</Button>
        </div>
        <img src="/shop-illustration.webp" alt="image" className='w-[250px] object-cover' />
      </div>
      <DashboardBoxes />

      {/* <div className="card my-4 bg-white border rounded-md px-1">
        <div className='flex items-center justify-between p-5'>
          <h2 className='text-[20px] font-bold'>Products <span className="font-normal text-[12px]">Tailwind(Css)</span></h2>
        </div>

        <div className='flex items-center w-full pl-5 justify-between pr-5'>
          <div className='col w-[20%]'>
            <h4 className='font-bold text-[14px] mb-2'>Category By</h4>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sort by category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryFilterValue}
                label="Sort by category"
                onChange={handleChangeCategoryFilterValue}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value={10}>Men</MenuItem>
                <MenuItem value={20}>Women</MenuItem>
                <MenuItem value={30}>Kids</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className='col w-[50%] flex items-center justify-end gap-3'>
            <Button className='!bg-green-600 !px-3 !text-white flex items-center gap-1 !capitalize'><RiDownloadCloud2Line className='text-[18px]' />Export</Button>
            <Button className='!bg-[var(--bg-primary)] !px-3 !text-white flex items-center gap-1 !capitalize' onClick={()=>context.setIsOpenFullScreenPanel({open:true,model:'Product Details'})}><GoPlus className='text-[20px]' />Add Product</Button>
          </div>
        </div>

        <div className="customScroll relative overflow-x-auto rounded-md mt-5 pb-5">
          <table className="w-full text-[14px] text-left rtl:text-right text-[var(--text-light)] rounded-md">
            <thead className="text-[14px] text-gray-700 uppercase bg-gray-100 whitespace-nowrap">
              <tr>
                <th scope="col" className="px-6 pr-2 py-3 text-left"><div className='w-[60px]'><Checkbox {...label} /></div></th>
                <th scope="col" className="px-0 py-3 text-left">Products</th>
                <th scope="col" className="px-6 py-3 text-left">Category</th>
                <th scope="col" className="px-6 py-3 text-left">Sub Category</th>
                <th scope="col" className="px-6 py-3 text-left">Price</th>
                <th scope="col" className="px-6 py-3 text-left">Sales</th>
                <th scope="col" className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>

              <tr className="odd:bg-gray-200 even:bg-gray-50 border-b dark:border-gray-400">
                <td className="px-6 pr-2 py-2 text-left">
                  <div className="w-[60px]">
                    <Checkbox {...label} />
                  </div>
                </td>
                <td className="px-0 py-2 text-left">
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  Women Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  <div className="flex flex-col items-center text-left">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal text">(17% OFF)</span>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  <p className='text-[14px] flex flex-col gap-1'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </td>

                <td className="px-6 py-2 text-left">
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </td>

              </tr>

              <tr className="odd:bg-gray-200 even:bg-gray-50 border-b dark:border-gray-400">
                <td className="px-6 pr-2 py-2 text-left">
                  <div className="w-[60px]">
                    <Checkbox {...label} />
                  </div>
                </td>
                <td className="px-0 py-2 text-left">
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  Women Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  <div className="flex flex-col items-center text-left">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal text">(17% OFF)</span>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  <p className='text-[14px] flex flex-col gap-1'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </td>

                <td className="px-6 py-2 text-left">
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </td>

              </tr>

              <tr className="odd:bg-gray-200 even:bg-gray-50 border-b dark:border-gray-400">
                <td className="px-6 pr-2 py-2 text-left">
                  <div className="w-[60px]">
                    <Checkbox {...label} />
                  </div>
                </td>
                <td className="px-0 py-2 text-left">
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  Women Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  <div className="flex flex-col items-center text-left">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal text">(17% OFF)</span>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  <p className='text-[14px] flex flex-col gap-1'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </td>

                <td className="px-6 py-2 text-left">
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </td>

              </tr>

              <tr className="odd:bg-gray-200 even:bg-gray-50 border-b dark:border-gray-400">
                <td className="px-6 pr-2 py-2 text-left">
                  <div className="w-[60px]">
                    <Checkbox {...label} />
                  </div>
                </td>
                <td className="px-0 py-2 text-left">
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  Women Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  <div className="flex flex-col items-center text-left">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal text">(17% OFF)</span>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  <p className='text-[14px] flex flex-col gap-1'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </td>

                <td className="px-6 py-2 text-left">
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </td>

              </tr>

              <tr className="odd:bg-gray-200 even:bg-gray-50 border-b dark:border-gray-400">
                <td className="px-6 pr-2 py-2 text-left">
                  <div className="w-[60px]">
                    <Checkbox {...label} />
                  </div>
                </td>
                <td className="px-0 py-2 text-left">
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  Women Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  <div className="flex flex-col items-center text-left">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal text">(17% OFF)</span>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  <p className='text-[14px] flex flex-col gap-1'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </td>

                <td className="px-6 py-2 text-left">
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </td>

              </tr>

            </tbody>
          </table>
        </div>
        <div className='flex items-center justify-end px-5 pb-5'>
          <Pagination count={10} />
        </div>
      </div > */}


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
                          <span className="text-[14px] font-bold">{product?.countInStock - product?.sale}</span> remain
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

      <div className="card my-4 bg-white border rounded-md px-1">
        <div className='flex items-center justify-between p-5'>
          <h2 className='text-[20px] font-bold'>Recent Orders</h2>
        </div>
        <div className="customScroll relative overflow-x-auto rounded-md pb-5">
          <table className="w-full text-[14px] text-left rtl:text-right text-[var(--text-light)] rounded-md">
            <thead className="text-[14px] text-gray-700 uppercase bg-gray-100 whitespace-nowrap">
              <tr>
                <th scope="col" className="px-6 py-3 text-left"></th>
                <th scope="col" className="px-6 py-3 text-left">Order Id</th>
                <th scope="col" className="px-6 py-3 text-left">Payment Id</th>
                <th scope="col" className="px-6 py-3 text-left">Name</th>
                <th scope="col" className="px-6 py-3 text-left">Mobile No.</th>
                <th scope="col" className="px-6 py-3 text-left">Address</th>
                <th scope="col" className="px-6 py-3 text-left">Pin Code</th>
                <th scope="col" className="px-6 py-3 text-left">Email</th>
                <th scope="col" className="px-6 py-3 text-left">Total Amount</th>
                <th scope="col" className="px-6 py-3 text-left">User Id</th>
                <th scope="col" className="px-6 py-3 text-left">Order Status</th>
                <th scope="col" className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <Button
                    className="!text-black !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1] flex items-center justify-center"
                    onClick={() => isShowOrderedProduct(0)}
                  >
                    {isOpenOrder === (0) ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </Button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <span className="text-[var(--bg-primary)] font-semibold">
                    685958547548455555555555
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <span className="text-[var(--bg-primary)] font-semibold">
                    685958547548455555555555
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  Lorem ipsum dolor sit amet Lorem, ipsum.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  999999999999
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, maiores.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  elonmusk12345@gmail.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">8484</td>
                <td className="px-6 py-4 whitespace-nowrap text-left ">
                  Lorem252556666ipsum
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <Badge status="rejected" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left ">
                  2025-01-01
                </td>
              </tr>
              {
                isOpenOrder === 0 && (
                  <tr>
                    <td colSpan="6" className="p-0">
                      <div className="customScroll relative overflow-x-auto my-2 px-20">
                        <table className="w-full text-[14px] text-left rtl:text-right text-[var(--text-light)]">
                          <thead className="text-[14px] text-gray-700 uppercase bg-gray-100 whitespace-nowrap">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left">Product Id</th>
                              <th scope="col" className="px-6 py-3 text-left">Product Title</th>
                              <th scope="col" className="px-6 py-3 text-left">Image</th>
                              <th scope="col" className="px-6 py-3 text-left">Quantity</th>
                              <th scope="col" className="px-6 py-3 text-left">Price</th>
                              <th scope="col" className="px-6 py-3 text-left">SubTotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )
              }
              <tr className="bg-white border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <Button
                    className="!text-black !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1] flex items-center justify-center"
                    onClick={() => isShowOrderedProduct(1)}
                  >
                    {isOpenOrder === (1) ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </Button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <span className="text-[var(--bg-primary)] font-semibold">
                    685958547548455555555555
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <span className="text-[var(--bg-primary)] font-semibold">
                    685958547548455555555555
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  Lorem ipsum dolor sit amet Lorem, ipsum.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  999999999999
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, maiores.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  elonmusk12345@gmail.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">8484</td>
                <td className="px-6 py-4 whitespace-nowrap text-left ">
                  Lorem252556666ipsum
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <Badge status="rejected" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left ">
                  2025-01-01
                </td>
              </tr>
              {
                isOpenOrder === 1 && (
                  <tr>
                    <td colSpan="6" className="p-0">
                      <div className="customScroll relative overflow-x-auto my-2 px-20">
                        <table className="w-full text-[14px] text-left rtl:text-right text-[var(--text-light)]">
                          <thead className="text-[14px] text-gray-700 uppercase bg-gray-100 whitespace-nowrap">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left">Product Id</th>
                              <th scope="col" className="px-6 py-3 text-left">Product Title</th>
                              <th scope="col" className="px-6 py-3 text-left">Image</th>
                              <th scope="col" className="px-6 py-3 text-left">Quantity</th>
                              <th scope="col" className="px-6 py-3 text-left">Price</th>
                              <th scope="col" className="px-6 py-3 text-left">SubTotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className="card my-4 bg-white border rounded-md px-1">
        <div className='flex items-center justify-between px-5 pb-2 pt-5'>
          <h2 className='text-[20px] font-bold'>Total Sales & Total Users</h2>
        </div>

        <div className='flex items-center justify-start px-5 pt-2 pb-5 gap-5'>
          <span className='flex items-center'><span><GoDotFill className='text-violet-500' /></span>Total Sales</span>
          <span className='flex items-center'><span><GoDotFill className='text-green-500' /></span>Total Users</span>
        </div>
        <div style={{ width: '100%', height: '500px' }}>
          <ResponsiveContainer>
            <LineChart
              width={1000}
              height={500}
              data={chartData1}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="none" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartTooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Total_Sales" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Total_Users" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


    </>
  )
}

export default Dashboard
