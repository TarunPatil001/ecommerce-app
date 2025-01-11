import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBox from '../../Components/SearchBox'
import { MdOutlineMarkEmailRead, MdPhone } from 'react-icons/md';
import { SlCalender } from "react-icons/sl";


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
    { id: 'userImg', label: 'USER IMAGE', minWidth: 200, align: 'left' },
    { id: 'userName', label: 'USER NAME', minWidth: 150, align: 'left' },
    {
        id: 'userEmail',
        label: 'USER EMAIL',
        minWidth: 150,
        align: 'left'
    },
    {
        id: 'userPhoneNo',
        label: 'USER PHONE NO',
        minWidth: 160,
        align: 'left',
    },
    {
        id: 'createdDate',
        label: 'CREATED ON',
        minWidth: 160,
        align: 'left',
    },
];

const Users = () => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <div className="card my-4 bg-white border rounded-md px-1 pt-5">

                <div className='flex items-center w-full px-5 justify-between'>
                    <div className='col w-[40%]'>
                        <h2 className='text-[20px] font-bold'>Users List <span className="font-normal text-[12px]">Material UI</span></h2>
                    </div>

                    <div className='col w-[40%]'>
                        <SearchBox searchName="user email" />
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
                                <TableCell width={100}>
                                    <div className="flex items-start gap-4 w-[100px]">
                                        <div className='img w-[45px] h-[45px] overflow-hidden rounded-md shadow-md group'>
                                            <Link to="">
                                                <img src="https://mui.com/static/images/avatar/1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                                            </Link>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Raj Patel
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><MdOutlineMarkEmailRead className='text-[20px]' />rajpatel59958@gmail.com</span>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><MdPhone className='text-[20px]' />+91-8956232356</span>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><SlCalender className='text-[18px]' />11-01-2025</span>
                                </TableCell>
                               
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell width={100}>
                                    <div className="flex items-start gap-4 w-[100px]">
                                        <div className='img w-[45px] h-[45px] overflow-hidden rounded-md shadow-md group'>
                                            <Link to="">
                                                <img src="https://mui.com/static/images/avatar/1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                                            </Link>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Raj Patel
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><MdOutlineMarkEmailRead className='text-[20px]' />rajpatel59958@gmail.com</span>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><MdPhone className='text-[20px]' />+91-8956232356</span>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><SlCalender className='text-[18px]' />11-01-2025</span>
                                </TableCell>
                               
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell width={100}>
                                    <div className="flex items-start gap-4 w-[100px]">
                                        <div className='img w-[45px] h-[45px] overflow-hidden rounded-md shadow-md group'>
                                            <Link to="">
                                                <img src="https://mui.com/static/images/avatar/1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                                            </Link>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Raj Patel
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><MdOutlineMarkEmailRead className='text-[20px]' />rajpatel59958@gmail.com</span>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><MdPhone className='text-[20px]' />+91-8956232356</span>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><SlCalender className='text-[18px]' />11-01-2025</span>
                                </TableCell>
                               
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell width={100}>
                                    <div className="flex items-start gap-4 w-[100px]">
                                        <div className='img w-[45px] h-[45px] overflow-hidden rounded-md shadow-md group'>
                                            <Link to="">
                                                <img src="https://mui.com/static/images/avatar/1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                                            </Link>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Raj Patel
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><MdOutlineMarkEmailRead className='text-[20px]' />rajpatel59958@gmail.com</span>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><MdPhone className='text-[20px]' />+91-8956232356</span>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><SlCalender className='text-[18px]' />11-01-2025</span>
                                </TableCell>
                               
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Checkbox {...label} size='small' />
                                </TableCell>
                                <TableCell width={100}>
                                    <div className="flex items-start gap-4 w-[100px]">
                                        <div className='img w-[45px] h-[45px] overflow-hidden rounded-md shadow-md group'>
                                            <Link to="">
                                                <img src="https://mui.com/static/images/avatar/1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                                            </Link>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    Raj Patel
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><MdOutlineMarkEmailRead className='text-[20px]' />rajpatel59958@gmail.com</span>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><MdPhone className='text-[20px]' />+91-8956232356</span>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <span className='flex items-center gap-1'><SlCalender className='text-[18px]' />11-01-2025</span>
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

export default Users
