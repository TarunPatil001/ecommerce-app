import { Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import { useContext, useState } from 'react'
import { GoPlus } from 'react-icons/go'
import { RiDeleteBin6Line, RiDownloadCloud2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { MdOutlineEdit } from 'react-icons/md'
import { IoEyeOutline } from 'react-icons/io5'
import { MyContext } from '../../App'


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
    { id: 'image', label: 'IMAGE', minWidth: 250, align: 'left' },
    { id: 'action', label: 'Action', minWidth: 100, align: 'left' },
];

const HomeSliderBanners = () => {

    const context = useContext(MyContext);
    const totalStock = 250;
    const currentSales = 241;

    // Calculate percentage
    const salePercentage = (currentSales / totalStock) * 100;
    const remainStock = totalStock - currentSales;

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
                <h2 className='text-[20px] font-bold'>Home Slider Banners <span className="font-normal text-[12px]">Material UI</span></h2>
                <div className='col w-[25%] ml-auto flex items-center justify-end gap-3'>
                    <Button className='!bg-green-600 !px-3 !text-white flex items-center gap-1 !capitalize'><RiDownloadCloud2Line className='text-[18px]' />Export</Button>
                    <Button className='!bg-[var(--bg-primary)] !px-3 !text-white flex items-center gap-1 !capitalize' onClick={()=>context.setIsOpenFullScreenPanel({open:true,model:'Add Home Slide'})}><GoPlus className='text-[20px]' />Add Home Slide</Button>
                </div>
            </div>

            <div className="card my-4 bg-white border rounded-md px-1 pt-1">

                <TableContainer className='max-h-[440px] customScroll'>
                    <Table stickyHeader aria-label="sticky table">

                        <TableHead>
                            <TableRow>
                                <TableCell className="px-6 py-2 text-left w-[60px]">
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        width={column.minWidth}
                                        key={column.id}
                                        align={column.align}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            <TableRow>
                                <TableCell>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell width={300}>
                                    <div className="flex items-start gap-4 w-[300px]">
                                        <div className='img w-full h-auto overflow-hidden rounded-md shadow-md group'>
                                            <Link to="/product/458457">
                                                <img src="https://api.spicezgold.com/download/file_1734524930884_NewProject(6).jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                                            </Link>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell width={100}>
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

export default HomeSliderBanners
