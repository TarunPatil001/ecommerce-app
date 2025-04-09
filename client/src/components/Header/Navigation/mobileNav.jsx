import React from 'react'
import { Button } from '@mui/material';
import { RiAccountCircleLine, RiHome2Line } from "react-icons/ri";
import { FiSearch } from 'react-icons/fi';
import { IoMdHeartEmpty } from 'react-icons/io';
import { IoBagCheckOutline } from 'react-icons/io5';
import { MdAccountCircle } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

const MobileNav = () => {
  return (
    <div className='mobileNav bg-white p-1 w-full grid grid-cols-5 fixed bottom-0 left-0 place-items-center z-[1001]'>

      <NavLink to="/" exact={true} activeClassName='isActive'>
        <Button className='flex flex-col !capitalize !text-[12px] !w-[40px] !min-w-[40px] !text-gray-700'>
          <RiHome2Line size={18} />
          <span className='text-[12px]'>Home</span>
        </Button>
      </NavLink>

      <NavLink to="/search" exact={true} activeClassName='isActive'>
        <Button className='flex flex-col !capitalize !text-[12px] !w-[40px] !min-w-[40px] !text-gray-700'>
          <FiSearch size={18} />
          <span className='text-[12px]'>Search</span>
        </Button>
      </NavLink>

      <NavLink to="/my-wishlist" exact={true} activeClassName='isActive'>
        <Button className='flex flex-col !capitalize !text-[12px] !w-[40px] !min-w-[40px] !text-gray-700'>
          <IoMdHeartEmpty size={18} />
          <span className='text-[12px]'>Wishlist</span>
        </Button>
      </NavLink>

      <NavLink to="/my-orders" exact={true} activeClassName='isActive'>
        <Button className='flex flex-col !capitalize !text-[12px] !w-[40px] !min-w-[40px] !text-gray-700'>
          <IoBagCheckOutline size={18} />
          <span className='text-[12px]'>Orders</span>
        </Button>
      </NavLink>

      <NavLink to="/my-account" exact={true} activeClassName='isActive'>
        <Button className='flex flex-col !capitalize !text-[12px] !w-[40px] !min-w-[40px] !text-gray-700'>
          <RiAccountCircleLine size={18} />
          <span className='text-[12px]'>Account</span>
        </Button>
      </NavLink>
    </div>
  )
}

export default MobileNav
