import React, { useContext, useEffect, useState } from 'react'
import { Badge, Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import { GoPlus } from 'react-icons/go'
import { RiDeleteBin6Line, RiDownloadCloud2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { MdOutlineEdit } from 'react-icons/md'
import { IoCloseOutline, IoEyeOutline } from 'react-icons/io5'
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { MyContext } from '../../App'


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
    { id: 'image', label: 'CATEGORY IMAGE', minWidth: 250, align: 'left' },
    { id: 'categoryName', label: 'CATEGORY NAME', minWidth: 250, align: 'left' },
    { id: 'subCategoryName', label: 'SUB CATEGORY NAME', minWidth: 400, align: 'left' },
    { id: 'action', label: 'Action', minWidth: 100, align: 'left' },
];

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const SubCategoryList = () => {

    const context = useContext(MyContext);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [chipData, setChipData] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    // Simulate fetching data using mock data
    useEffect(() => {
        const fetchData = () => {
            // Mock data (Replace with your real data later)
            const mockData = [
                { key: 0, label: 'React' },
                { key: 1, label: 'JavaScript' },
                { key: 2, label: 'CSS' },
                { key: 3, label: 'HTML' },
                { key: 4, label: 'HTML' },
            ];

            // Set the mock data to chipData state
            setChipData(mockData);
        };

        fetchData(); // Call the simulated fetch function
    }, []); // Empty dependency array means this will run once when the component mounts

    // Handle the delete action
    const handleDelete = (data) => () => {
        setChipData((prevChipData) => prevChipData.filter((item) => item.key !== data.key));
    };

    return (
        <>
            <div className='flex items-center justify-between px-5 pt-3'>
                <h2 className='text-[20px] font-bold'>Sub Category List<span className="font-normal text-[12px]">Material UI</span></h2>
                <div className='col w-[30%] ml-auto flex items-center justify-end gap-3'>
                    <Button className='!bg-green-600 !px-3 !text-white flex items-center gap-1 !capitalize'><RiDownloadCloud2Line className='text-[18px]' />Export</Button>
                    <Button className='!bg-[var(--bg-primary)] !px-3 !text-white flex items-center gap-1 !capitalize' onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Add New SubCategory' })}><GoPlus className='text-[20px]' />Add New SubCategory</Button>
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

                                <TableCell width={100}>
                                    <div className="flex items-start gap-4 w-[80px]">
                                        <div className='img w-full h-auto overflow-hidden rounded-md shadow-md group'>
                                            <Link to="/product/458457">
                                                <img src="https://api.spicezgold.com/download/file_1734525239704_foot.png" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                                            </Link>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <span className='inline-block rounded-md px-2 bg-slate-100 text-[14px] p-1'>Men</span>
                                </TableCell>

                                <TableCell>
                                    <span className='flex flex-wrap'>
                                        {chipData.map((data) => {
                                            let icon;
                                            // You can define your icon based on data or other conditions
                                            return (
                                                <ListItem key={data.key} className='list-none'>
                                                    <Chip
                                                        icon={icon}
                                                        label={data.label}
                                                        onDelete={handleDelete(data)}
                                                        className={`!bg-[var(--bg-primary)] !text-white`}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </span>
                                </TableCell>

                                <TableCell width={100}>
                                    <div className='flex items-center gap-2'>
                                        <Tooltip title="Edit Product" arrow placement="top">
                                            <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
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

export default SubCategoryList
