import { Button } from '@mui/material'
import React, { useState } from 'react'
import { MdDashboard, MdOutlineLogout } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { TbSlideshow } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { Collapse } from 'react-collapse';
import { GoDotFill } from "react-icons/go";

const Sidebar = () => {

  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const [subMenuIndex1, setSubMenuIndex1] = useState(false);
  const [subMenuIndex2, setSubMenuIndex2] = useState(false);
  const [subMenuIndex3, setSubMenuIndex3] = useState(false);

  return (
    <>
      <div className="sidebar fixed top-0 left-0 bg-[#fff] w-[18%] h-full border-r p-2">
        <div className="py-2 w-full px-4">
          <Link to="/">
            <img src="https://ecme-react.themenate.net/img/logo/logo-light-full.png" alt="logo" className='w-[120px]' />
          </Link>
        </div>

        <ul className='mt-4'>

          <li>
            <Link to="/">
              <Button className={`!w-full !capitalize flex !justify-start !items-center gap-3 text-[14px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Dashboard' ? "!bg-[var(--bg-active)] !text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Dashboard')}><MdDashboard className='text-[25px]' />
                <span>Dashboard</span>
              </Button>
            </Link>
          </li>

          <li>
            <Button className={`!w-full !capitalize flex !justify-start !items-center gap-3 text-[14px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Home Banners List' || selectedMenu === 'Add Home Banners' ? "!bg-[var(--bg-active)] !text-[var(--text-active)]" : ""}`} onClick={() => { setSubMenuIndex1(!subMenuIndex1) }}><TbSlideshow className='text-[25px]' />
              <span>Home Slides</span>
              <span className={`ml-auto w-[30px] h-[30px] flex !items-center !justify-center transform transition-transform duration-300 ${subMenuIndex1 ? "-rotate-180" : "rotate-0"}`}><FaAngleDown /></span>
            </Button>


            <Collapse isOpened={subMenuIndex1}>
              <ul className='w-full'>
                <li className='w-full'>
                  <Link to="/">
                    <Button className={`!w-full !capitalize !pl-10 flex !justify-start !items-center gap-3 !text-[13px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Home Banners List' ? "!text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Home Banners List')}>
                      <GoDotFill />
                      <span>Home Banners List</span>
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>
                  <Link to="/">
                    <Button className={`!w-full !capitalize !pl-10 flex !justify-start !items-center gap-3 !text-[13px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Add Home Banners' ? "!text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Add Home Banners')}>
                      <GoDotFill />
                      <span>Add Home Banner</span>
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>

          </li>

          <li>
            <Link to="/users">
              <Button className={`!w-full !capitalize flex !justify-start !items-center gap-3 text-[14px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Users' ? "!bg-[var(--bg-active)] !text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Users')}><LuUsers className='text-[25px]' />
                <span>Users</span>
              </Button>
            </Link>
          </li>

          <li>
            <Button className={`!w-full !capitalize flex !justify-start !items-center gap-3 text-[14px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Product List' || selectedMenu === 'Product Upload' ? "!bg-[var(--bg-active)] !text-[var(--text-active)]" : ""}`} onClick={() => { setSubMenuIndex2(!subMenuIndex2) }}><RiProductHuntLine className='text-[25px]' />
              <span>Products</span>
              <span className={`ml-auto w-[30px] h-[30px] flex items-center justify-center transform transition-transform duration-300 ${subMenuIndex2 ? "-rotate-180" : "rotate-0"}`}><FaAngleDown /></span>
            </Button>

            <Collapse isOpened={subMenuIndex2}>
              <ul className='w-full'>
                <li className='w-full'>
                  <Link to="/products">
                    <Button className={`!w-full !capitalize !pl-10 flex !justify-start !items-center gap-3 !text-[13px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Product List' ? "!text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Product List')}>
                      <GoDotFill />
                      <span>Product List</span>
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>
                  <Link to="/product/upload">
                    <Button className={`!w-full !capitalize !pl-10 flex !justify-start !items-center gap-3 !text-[13px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Product Upload' ? "!text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Product Upload')}>
                      <GoDotFill />
                      <span>Product Upload</span>
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>

          </li>

          <li>
            <Button className={`!w-full !capitalize flex !justify-start !items-center gap-3 text-[14px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Categories List' || selectedMenu === 'Add a Category' || selectedMenu === 'Sub-Categories List' || selectedMenu === 'Add a Sub-Category' ? "!bg-[var(--bg-active)] !text-[var(--text-active)]" : ""}`} onClick={() => { setSubMenuIndex3(!subMenuIndex3) }}><TbCategory className='text-[25px]' />
              <span>Categories</span>
              <span className={`ml-auto w-[30px] h-[30px] flex items-center justify-center transform transition-transform duration-300 ${subMenuIndex3 ? "-rotate-180" : "rotate-0"}`}><FaAngleDown /></span>
            </Button>

            <Collapse isOpened={subMenuIndex3}>
              <ul className='w-full'>
                <li className='w-full'>
                  <Link to="/category">
                    <Button className={`!w-full !capitalize !pl-10 flex !justify-start !items-center gap-3 !text-[13px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Categories List' ? "!text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Categories List')}>
                      <GoDotFill />
                      <span>Categories List</span>
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>
                  <Link to="/category/add">
                    <Button className={`!w-full !normal-case !pl-10 flex !justify-start !items-center gap-3 !text-[13px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Add a Category' ? "!text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Add a Category')}>
                      <GoDotFill />
                      <span>Add a Category</span>
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>
                  <Link to="/category/subCategory">
                    <Button className={`!w-full !capitalize !pl-10 flex !justify-start !items-center gap-3 !text-[13px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Sub-Categories List' ? "!text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Sub-Categories List')}>
                      <GoDotFill />
                      <span>Sub-Categories List</span>
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>
                  <Link to="/category/subCategory/add">
                    <Button className={`!w-full !normal-case !pl-10 flex !justify-start !items-center gap-3 !text-[13px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Add a Sub-Category' ? "!text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Add a Sub-Category')}>
                      <GoDotFill />
                      <span>Add a Sub-Category</span>
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>

          </li>

          <li>
            <Link to="/orders">
              <Button className={`!w-full !capitalize flex !justify-start !items-center gap-3 text-[14px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Orders' ? "!bg-[var(--bg-active)] !text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Orders')}><IoBagCheckOutline className='text-[25px]' />
                <span>Orders</span>
              </Button>
            </Link>
          </li>

          <li>
            <Link to="/logout">
              <Button className={`!w-full !capitalize flex !justify-start !items-center gap-3 text-[14px] !text-[rgba(0,0,0,0.7)] !font-bold !py-2 hover:!bg-[var(--bg-light-hover)] ${selectedMenu === 'Logout' ? "!bg-[var(--bg-active)] !text-[var(--text-active)]" : ""}`} onClick={() => setSelectedMenu('Logout')}><MdOutlineLogout className='text-[25px]' />
                <span>Logout</span>
              </Button>
            </Link>
          </li>

        </ul>
      </div >
    </>
  )
}

export default Sidebar