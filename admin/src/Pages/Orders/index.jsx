import React, { useContext, useState } from 'react'
import Badge from '../../Components/Badge'
import { Button } from '@mui/material'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import SearchBox from '../../Components/SearchBox';
import { editData, fetchDataFromApi } from '../../utils/api';
import { useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { MyContext } from '../../App';

const Orders = () => {

    const context = useContext(MyContext);
    const [isOpenOrder, setIsOpenOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatus] = useState({});


    const handleChange = (event, itemId) => {
        const newStatus = event.target.value;

        // Update state for only the specific order
        setOrderStatus((prevStatuses) => ({
            ...prevStatuses,
            [itemId]: newStatus, // Updates only the specific order ID
        }));

        const obj = {
            id: itemId,
            order_status: newStatus,
        };

        editData(`/api/order/order-status/${itemId}`, obj)
            .then((res) => {
                console.log("API Response:", res);

                if (res?.error === false) {
                    context?.openAlertBox("success", res?.message);
                    getOrderDetails();
                } else {
                    console.error("Unexpected API response:", res);
                }
            })
            .catch((err) => {
                console.error("Error updating order status:", err);
            });

    };


    const isShowOrderedProduct = (index) => {
        if (isOpenOrder === index) {
            setIsOpenOrder(null);
        } else {
            setIsOpenOrder(index);
        }
    }

    const getOrderDetails = () => {
        fetchDataFromApi(`/api/order/order-list`).then((res) => {
            if (res?.error === false) {
                // console.log(res?.data);
                setOrders(res?.data);
            }
        })
    }

    useEffect(() => {
        getOrderDetails();
    }, [])

    return (
        <div className="card my-4 bg-white border rounded-md px-1 min-h-[600px] h-full">
            {
                orders?.length !== 0 ?
                    <>
                        <div className='flex items-center justify-between p-5'>
                            <h2 className='text-[20px] font-bold'>Recent Orders</h2>
                            <div className='w-[40%]'><SearchBox searchName="orders" /></div>
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
                                        <th scope="col" className="px-6 py-3 text-left w-[400px] min-w-[400px]">Address</th>
                                        <th scope="col" className="px-6 py-3 text-left">Pin Code</th>
                                        <th scope="col" className="px-6 py-3 text-left">Email</th>
                                        <th scope="col" className="px-6 py-3 text-left">Total Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left">User Id</th>
                                        <th scope="col" className="px-6 py-3 text-left">Order Status</th>
                                        <th scope="col" className="px-6 py-3 text-left">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orders?.length !== 0 && orders?.map((item, index) => {
                                            return (
                                                <>
                                                    <tr key={index} className="bg-white border-b hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            <Button
                                                                className="!text-black !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1] flex items-center justify-center"
                                                                onClick={() => isShowOrderedProduct(index)}
                                                            >
                                                                {isOpenOrder === (index) ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                                            </Button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            <span className="text-[var(--bg-primary)] font-semibold">
                                                                {item?._id}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            <span className="text-[var(--bg-primary)] font-semibold">
                                                                {item?.paymentId ? item?.paymentId : "CASH ON DELIVERY"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            {item?.delivery_address?.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            {item?.delivery_address?.mobile
                                                                ? String(item?.delivery_address?.mobile).replace(/^(\d{2})(\d{5})(\d{5})$/, '+$1 $2 $3')
                                                                : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 text-left whitespace-normal break-words">
                                                            {[
                                                                item?.delivery_address?.address_line1,
                                                                item?.delivery_address?.landmark,
                                                                item?.delivery_address?.city,
                                                                item?.delivery_address?.state,
                                                                item?.delivery_address?.pincode,
                                                                item?.delivery_address?.country
                                                            ].filter(Boolean).join(', ')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            {item?.delivery_address?.pincode}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            {item?.userId?.email}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            {item?.totalAmt ? item.totalAmt.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '₹0'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left ">
                                                            {item?.userId?._id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                                <Select
                                                                    value={orderStatus[item?._id] ?? item?.order_status ?? ''}
                                                                    onChange={(e) => handleChange(e, item?._id)}
                                                                    displayEmpty
                                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                                    sx={{
                                                                        '&.MuiOutlinedInput-root': {
                                                                            backgroundColor: `${(orderStatus[item._id] ?? item?.order_status) === 'pending' ? 'red' :
                                                                                (orderStatus[item._id] ?? item?.order_status) === 'confirm' ? 'blue' :
                                                                                    (orderStatus[item._id] ?? item?.order_status) === 'delivered' ? 'green' : 'white'
                                                                                } !important`,
                                                                        },
                                                                        '& .MuiSelect-select': {
                                                                            backgroundColor: `${(orderStatus[item._id] ?? item?.order_status) === 'pending' ? 'red' :
                                                                                (orderStatus[item._id] ?? item?.order_status) === 'confirm' ? 'blue' :
                                                                                    (orderStatus[item._id] ?? item?.order_status) === 'delivered' ? 'green' : 'white'
                                                                                } !important`,
                                                                            color: 'white !important',
                                                                            padding: '8px 12px',
                                                                        },
                                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: 'transparent !important', // Hide the border
                                                                        },
                                                                        '& .MuiSvgIcon-root': { color: 'white !important' }, // Change dropdown arrow color
                                                                    }}
                                                                    MenuProps={{
                                                                        PaperProps: {
                                                                            sx: {
                                                                                bgcolor: 'white', // Keeps the dropdown background white
                                                                                '& .MuiMenuItem-root': { color: 'black' }, // Default black text
                                                                                '& .MuiMenuItem-root[data-value="pending"]': { color: 'red' }, // Pending text color
                                                                                '& .MuiMenuItem-root[data-value="confirm"]': { color: 'blue' }, // Confirm text color
                                                                                '& .MuiMenuItem-root[data-value="delivered"]': { color: 'green' }, // Delivered text color
                                                                            },
                                                                        },
                                                                    }}
                                                                >
                                                                    <MenuItem value={'pending'}>Pending</MenuItem>
                                                                    <MenuItem value={'confirm'}>Confirm</MenuItem>
                                                                    <MenuItem value={'delivered'}>Delivered</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-left ">
                                                            {item?.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-') : 'N/A'}
                                                        </td>
                                                    </tr>
                                                    {
                                                        isOpenOrder === index && (
                                                            <tr>
                                                                <td colSpan="6" className="p-0">
                                                                    <div className="customScroll relative overflow-x-auto my-2 px-20">
                                                                        <table className="w-full text-[14px] text-left rtl:text-right text-[var(--text-light)]">
                                                                            <thead className="text-[14px] text-gray-700 uppercase bg-gray-100 whitespace-nowrap">
                                                                                <tr>
                                                                                    <th scope="col" className="px-6 py-3 text-left w-[200px] min-w-[200px]">Product Id</th>
                                                                                    <th scope="col" className="px-6 py-3 text-left w-[300px] min-w-[300px]">Product Title</th>
                                                                                    <th scope="col" className="px-6 py-3 text-left w-[100px] min-w-[100px]">Image</th>
                                                                                    <th scope="col" className="px-6 py-3 text-left w-[100px] min-w-[100px]">Quantity</th>
                                                                                    <th scope="col" className="px-6 py-3 text-left w-[100px] min-w-[100px]">Price</th>
                                                                                    <th scope="col" className="px-6 py-3 text-left w-[100px] min-w-[100px]">SubTotal</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {
                                                                                    item?.products?.map((productItem, index) => (
                                                                                        <tr key={index} className="bg-white border-b hover:bg-gray-50 transition">
                                                                                            <td className="px-6 py-4 whitespace-nowrap text-left">
                                                                                                {productItem?.productId}
                                                                                            </td>
                                                                                            <td className="px-6 py-4 whitespace-normal break-words text-left">
                                                                                                {productItem?.productTitle}
                                                                                            </td>
                                                                                            <td className="px-6 py-4 whitespace-nowrap text-left">
                                                                                                <div className="!w-[50px] !h-[50px]">
                                                                                                    <img
                                                                                                        src={productItem?.image}
                                                                                                        alt=""
                                                                                                        className="w-full h-full object-cover"
                                                                                                    />
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="px-6 py-4 whitespace-nowrap text-left">{productItem?.quantity}</td>
                                                                                            <td className="px-6 py-4 whitespace-nowrap text-left">
                                                                                                {productItem?.price ? productItem.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '₹0'}
                                                                                            </td>
                                                                                            <td className="px-6 py-4 whitespace-nowrap text-left">
                                                                                                {productItem?.subTotal ? productItem.subTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '₹0'}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
                    :
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076484.png"
                            alt="Empty Orders"
                            className="w-32 h-32 mb-4 opacity-70"
                        />
                        <h2 className="text-xl font-semibold text-gray-700">No Orders Received Yet</h2>
                        <p className="text-gray-500">Looks like orders are not placed yet.</p>
                    </div>
            }
        </div>
    )
}

export default Orders
