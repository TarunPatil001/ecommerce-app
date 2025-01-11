import React, { useState } from 'react'
import Badge from '../../Components/Badge'
import { Button } from '@mui/material'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import SearchBox from '../../Components/SearchBox';

const Orders = () => {

    const [isOpenOrder, setIsOpenOrder] = useState(null);

    const isShowOrderedProduct = (index) => {
        if (isOpenOrder === index) {
          setIsOpenOrder(null);
        } else {
          setIsOpenOrder(index);
        }
      }

    return (
        <div className="card my-4 bg-white border rounded-md px-1">
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
    )
}

export default Orders
