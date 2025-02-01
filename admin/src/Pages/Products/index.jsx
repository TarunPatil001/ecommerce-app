import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { GoPlus } from 'react-icons/go'
import { RiDeleteBin6Line, RiDownloadCloud2Line } from 'react-icons/ri'
import { Link, useParams } from 'react-router-dom'
import ProgressBar from '../../Components/ProgressBar'
import { MdOutlineEdit } from 'react-icons/md'
import { IoEyeOutline } from 'react-icons/io5'
import SearchBox from '../../Components/SearchBox'
import { MyContext } from '../../App'
import { deleteData, fetchDataFromApi } from '../../utils/api'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import toast from 'react-hot-toast'


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
    { id: 'product', label: 'PRODUCT', minWidth: 150, align: 'left' },
    { id: 'category', label: 'BROAD CATEGORY', minWidth: 150, align: 'left' },
    {
        id: 'subCategory',
        label: 'SUB CATEGORY',
        minWidth: 150,
        align: 'left'
    },
    {
        id: 'subCategory',
        label: 'SPECIFIC CATEGORY',
        minWidth: 150,
        align: 'left'
    },
    {
        id: 'price',
        label: 'PRICE',
        minWidth: 160,
        align: 'center',
        format: (value) => `$${value.toFixed(2)}`,
    },
    { id: 'sales', label: 'SALES', minWidth: 130, align: 'center' },
    { id: 'action', label: 'ACTION', minWidth: 130, align: 'center' },
];

const Products = () => {

    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [productData, setProductData] = useState([]);
    const [categoryFilterValue, setCategoryFilterValue] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { id } = useParams();


    useEffect(() => {
        getAllProduct();
    }, [context?.isReducer])
    

    const getAllProduct = () => {
        fetchDataFromApi("/api/product/get-all-products").then((res) => {
            console.log(res);
            if (res.error === false) {
                setProductData(res?.data);
            } else {
                console.log(res.error);
            }
        })
    }


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






    return (
        <>
            <div className='flex items-center justify-between px-5 pt-3'>
                <h2 className='text-[20px] font-bold'>Products <span className="font-normal text-[12px]">Material UI</span></h2>
                <div className='col w-[25%] ml-auto flex items-center justify-end gap-3'>
                    <Button className='!bg-green-600 !px-3 !text-white flex items-center gap-1 !capitalize'><RiDownloadCloud2Line className='text-[18px]' />Export</Button>
                    <Button className='!bg-[var(--bg-primary)] !px-3 !text-white flex items-center gap-1 !capitalize' onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Product Details' })}><GoPlus className='text-[20px]' />Add Product</Button>
                </div>
            </div>

            <div className="card my-4 bg-white border rounded-md px-1 pt-5">

                <div className='flex items-center w-full px-5 justify-between'>
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
                                <MenuItem value={10}>T-Shirt</MenuItem>
                                <MenuItem value={20}>Jeans</MenuItem>
                                <MenuItem value={30}>Jurkins</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className='col w-[20%]'>
                        <SearchBox searchName="products" />
                    </div>

                </div>

                <TableContainer className='max-h-[440px] customScroll mt-5'>
                    <Table stickyHeader aria-label="sticky table">

                        <TableHead>
                            <TableRow>
                                <TableCell className="px-6 py-2 text-left">
                                    <Checkbox {...label} size='small' />
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
                            {
                                productData?.length !== 0 && productData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Apply pagination
                                    .map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <Checkbox {...label} size='small' />
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex items-start gap-4 w-[350px]">
                                                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                                                        <Link to={`/product/${product?._id}`}>
                                                            <LazyLoadImage
                                                                alt="product_img"
                                                                effect="blur"
                                                                src={product.images[0]}
                                                                className='w-full h-full object-cover hover:scale-110 !transition-all !duration-300'
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                                                        <Link to={`/product/${product?._id}`}>
                                                            <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>{product?.name}</h3>
                                                        </Link>
                                                        <span className='text-[12px]'>{product?.brand}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                {product?.categoryName}
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                {product?.subCategoryName}
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                {product?.thirdSubCategoryName}
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex flex-col items-center">
                                                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                                        &#8377;<span>{new Intl.NumberFormat('en-IN').format(product?.price)}</span>
                                                    </span>
                                                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                                        &#8377;<span>{new Intl.NumberFormat('en-IN').format(product?.oldPrice)}</span>
                                                    </span>
                                                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">({product?.discount}% OFF)</span>
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p className='text-[14px] flex flex-col gap-1 justify-center text-center'>
                                                    <span><span className='font-bold'>{product?.sale}</span> sold</span>
                                                    <ProgressBar value={(product?.sale / product?.countInStock) * 100} type="success" />
                                                    <span><span className='text-[14px] font-bold'>{product?.countInStock - product?.sale}</span> remain</span>
                                                </p>
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className='flex items-center gap-2'>
                                                    <Tooltip title="Edit Product" arrow placement="top">
                                                        <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow' onClick={() => { handleEditCategory(product?._id, product?.name); }}>
                                                            <MdOutlineEdit className='text-[35px]' />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="View Product" arrow placement="top">
                                                        <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'>
                                                            <IoEyeOutline className='text-[35px]' />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Product" arrow placement="top">
                                                        <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow' onClick={(e) => handleDeleteProduct(e, product?._id)}>
                                                            <RiDeleteBin6Line className='text-[35px]' />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }

                            {productData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <span className="text-[var(--text-light)] text-[14px] font-regular flex items-center justify-center gap-2">
                                            &#128193; No Records Available
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}

                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={8}>
                                    </TableCell>
                                </TableRow>
                            )}


                        </TableBody>

                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={productData?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />




            </div>

        </>
    )
}

export default Products
