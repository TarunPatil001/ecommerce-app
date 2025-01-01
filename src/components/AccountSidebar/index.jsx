import React from 'react'
import { Button } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { FiUpload } from 'react-icons/fi'
import { FaUserCircle } from 'react-icons/fa'
import { IoMdHeart } from 'react-icons/io'
import { IoBagCheck } from 'react-icons/io5'
import { TbLogout } from 'react-icons/tb'

const AccountSidebar = () => {
    return (
        <>
            <div className="col-1 w-[20%]">
                <div className="card bg-white shadow-md rounded-md sticky top-20">
                    <div className="w-full p-5 flex items-center justify-center flex-col">
                        <div className="w-[110px] h-[110px] overflow-hidden rounded-full mb-4 relative group">
                            <img src={`https://static.vecteezy.com/system/resources/thumbnails/028/794/707/small_2x/cartoon-cute-school-boy-photo.jpg`} alt="profile image" className="w-full h-full object-cover" />
                            <div className="overlay w-full h-full absolute top-0 left-0 z-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center hover:scale-125 opacity-0 transition-all rounded-full group-hover:opacity-100">
                                <FiUpload className="text-white text-[22px]" />
                                <input type="file" name="" id="" className="absolute top-0 left-0 w-full h-full opacity-0 rounded-full cursor-pointer" />
                            </div>
                        </div>
                        <h3 className="font-bold text-[16px] line-clamp-1">Elon Musk</h3>
                        <h6 className="text-[13px] font-medium">elonmusk123@gmail.com</h6>
                    </div>
                    <ul className="list-none pb-5 bg-[#f1f1f1] myAccountTabs">
                        <li className="w-full">
                            <NavLink to="/my-account" exact={true} activeClassName="isActive">
                                <Button className="!py-2 flex items-center !text-left !justify-start gap-2 w-full !rounded-none !capitalize !text-[rgba(0,0,0,0.8)] !text-[16px]"><FaUserCircle className="text-[20px]" />My Account</Button>
                            </NavLink>
                        </li>
                        <li className="w-full">
                            <NavLink to="/my-orders" exact={true} activeClassName="isActive">
                                <Button className="!py-2 flex items-center !text-left !justify-start gap-2 w-full !rounded-none !capitalize !text-[rgba(0,0,0,0.8)] !text-[16px]"><IoBagCheck className="text-[20px]" />Orders</Button>
                            </NavLink>
                        </li>
                        <li className="w-full">
                            <NavLink to="/my-wishlist" exact={true} activeClassName="isActive">
                                <Button className="!py-2 flex items-center !text-left !justify-start gap-2 w-full !rounded-none !capitalize !text-[rgba(0,0,0,0.8)] !text-[16px]"><IoMdHeart className="text-[20px]" />Wishlist</Button>
                            </NavLink>
                        </li>
                        <li className="w-full">
                            <Button className="!py-2 flex items-center !text-left !justify-start gap-2 w-full !rounded-none !capitalize !text-[rgba(0,0,0,0.8)] !text-[16px]"><TbLogout className="text-[20px]" />Logout</Button>
                        </li>

                    </ul>
                </div>
            </div>
        </>
    )
}

export default AccountSidebar
