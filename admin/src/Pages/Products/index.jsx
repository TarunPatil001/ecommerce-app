import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import React, { useContext, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiPlus } from 'react-icons/fi'
import { GoPlus } from 'react-icons/go'
import { RiDeleteBin6Line, RiDownloadCloud2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import ProgressBar from '../../Components/ProgressBar'
import { MdOutlineEdit } from 'react-icons/md'
import { IoEyeOutline } from 'react-icons/io5'
import SearchBox from '../../Components/SearchBox'
import { MyContext } from '../../App'


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
    { id: 'product', label: 'PRODUCT', minWidth: 150, align: 'left' },
    { id: 'category', label: 'CATEGORY', minWidth: 150, align: 'left' },
    {
        id: 'subCategory',
        label: 'SUB CATEGORY',
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
    const [isOpenOrder, setIsOpenOrder] = useState(null);
    const totalStock = 250;
    const currentSales = 241;

    // Calculate percentage
    const salePercentage = (currentSales / totalStock) * 100;
    const remainStock = totalStock - currentSales;

    const isShowOrderedProduct = (index) => {
        if (isOpenOrder === index) {
            setIsOpenOrder(null);
        } else {
            setIsOpenOrder(index);
        }
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [categoryFilterValue, setCategoryFilterValue] = useState("");

    const handleChangeCategoryFilterValue = (event) => {
        setCategoryFilterValue(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <div className='flex items-center justify-between px-5 pt-3'>
                <h2 className='text-[20px] font-bold'>Products <span className="font-normal text-[12px]">Material UI</span></h2>
                <div className='col w-[25%] ml-auto flex items-center justify-end gap-3'>
                    <Button className='!bg-green-600 !px-3 !text-white flex items-center gap-1 !capitalize'><RiDownloadCloud2Line className='text-[18px]' />Export</Button>
                    <Button className='!bg-[var(--bg-primary)] !px-3 !text-white flex items-center gap-1 !capitalize' onClick={()=>context.setIsOpenFullScreenPanel({open:true,model:'Add Product'})}><GoPlus className='text-[20px]' />Add Product</Button>
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
                        <SearchBox/>
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

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Women Clothing
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex flex-col items-center">
                                        <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                                        </span>
                                        <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                                            ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                                        </span>
                                        <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
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
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={10}
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
