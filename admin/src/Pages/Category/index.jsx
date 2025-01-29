import { Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import { useContext, useState } from 'react'
import { GoPlus } from 'react-icons/go'
import { RiDeleteBin6Line, RiDownloadCloud2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { MdOutlineEdit } from 'react-icons/md'
import { IoEyeOutline } from 'react-icons/io5'
import { MyContext } from '../../App'
import { useEffect } from 'react'
import { deleteData, editData, fetchDataFromApi } from '../../utils/api'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import toast from 'react-hot-toast'


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
    { id: 'image', label: 'IMAGE', minWidth: 150, align: 'left' },
    { id: 'categoryName', label: 'CATEGORY NAME', minWidth: 150, align: 'left' },
    { id: 'action', label: 'Action', minWidth: 100, align: 'left' },
];

const CategoryList = () => {

    const context = useContext(MyContext);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleEditCategory = (categoryId, categoryName) => {
        console.log("CatListPage - Category ID :", categoryId);
        console.log("CatListPage - Category Name :", categoryName);

        context.setIsOpenFullScreenPanel({
            open: true,
            model: "Category Details",
            categoryId: categoryId,
            categoryName: categoryName,
        });
    };

    const handleDeleteCategory = async (e, categoryId) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await toast.promise(
                deleteData(`/api/category/${categoryId}`),
                {
                    loading: "Deleting category... Please wait.",
                    success: (res) => {
                        if (res?.success) {
                            fetchDataFromApi("/api/category").then((updatedData) => {
                                context?.setCatData(updatedData?.data);
                            });
                            return res.message || "Category deleted successfully!";
                        } else {
                            throw new Error(res?.message || "An unexpected error occurred.");
                        }
                    },
                    error: (err) => {
                        return err?.response?.data?.message || err.message || "Failed to delete category. Please try again.";
                    },
                }
            );

            console.log("Delete Result:", result);
        } catch (err) {
            console.error("Error in handleDeleteCategory:", err);
            toast.error(err?.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <div className='flex items-center justify-between px-5 pt-3'>
                <h2 className='text-[20px] font-bold'>Category List<span className="font-normal text-[12px]">Material UI</span></h2>
                <div className='col w-[30%] ml-auto flex items-center justify-end gap-3'>
                    <Button className='!bg-green-600 !px-3 !text-white flex items-center gap-1 !capitalize'><RiDownloadCloud2Line className='text-[18px]' />Export</Button>
                    <Button className='!bg-[var(--bg-primary)] !px-3 !text-white flex items-center gap-1 !capitalize' onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Category Details' })}><GoPlus className='text-[20px]' />Category Details</Button>
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

                            {
                                context?.catData?.length !== 0 && context?.catData?.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Checkbox {...label} size='small' />
                                            </TableCell>
                                            <TableCell width={100}>
                                                <div className='shadow w-[80px] h-[80px] overflow-hidden rounded-md flex items-center justify-center'>
                                                    <Link to="/product/458457">
                                                        <div className='flex items-center justify-center'>
                                                            <LazyLoadImage
                                                                alt="product_img"
                                                                effect="blur"
                                                                src={item.images[0]}
                                                                className='w-full h-full object-cover hover:scale-110 !transition-all !duration-300'
                                                            />
                                                        </div>
                                                    </Link>
                                                </div>
                                            </TableCell>

                                            <TableCell width={100}>
                                                <span>{item?.name}</span>
                                            </TableCell>

                                            <TableCell width={100}>
                                                <div className='flex items-center gap-2'>
                                                    <Tooltip title="Edit Product" arrow placement="top">
                                                        <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow' onClick={() => { handleEditCategory(item?._id, item?.name); }}><MdOutlineEdit className='text-[35px]' /></Button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Product" arrow placement="top">
                                                        <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow' onClick={(e) => { handleDeleteCategory(e, item?._id) }}><RiDeleteBin6Line className='text-[35px]' /></Button>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }



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

export default CategoryList
