import React, { useState } from 'react'

import Sidebar from "../../components/Sidebar"
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import { GrNext } from "react-icons/gr";
import ProductItem from './../../components/ProductItem/index';
import Button from "@mui/material/Button";
import { IoGridSharp } from "react-icons/io5";
import { TfiLayoutListThumbAlt } from "react-icons/tfi";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { BsSortAlphaDown, BsSortAlphaUp } from 'react-icons/bs';
import { BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import { PiTargetLight } from 'react-icons/pi';
import { HiBarsArrowDown } from 'react-icons/hi2';
import ProductItemListView from '../../components/ProductItemListview';
import Pagination from '@mui/material/Pagination';


function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

const ProductListing = () => {

  const [selectedOption, setSelectedOption] = useState("Sales: highest to lowest");
  const [itemView, setItemView] = useState('grid');

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" onClick={handleClick} className="link transition">
      Home
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="/material-ui/getting-started/installation/"
      onClick={handleClick}
      className="link transition"
    >
      Fashion
    </Link>,
    <Link
      underline="hover"
      key="3"
      color="inherit"
      href="/material-ui/getting-started/installation/"
      onClick={handleClick}
      className="link transition"
    >
      Men
    </Link>,
    <Typography key="4" className="text-black !font-medium !font-poppins">
      Shirt
    </Typography>,
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option) => {
    setSelectedOption(option); // Update the selected option
    handleDropdownClose(); // Close the menu
  };

  return (
    <section className="py-0 pb-0">
      
      <div className="bg-white p-5 border-b">
        <div className="container px-3 flex items-center bg-white">
          <Breadcrumbs separator={<GrNext fontSize="small" />} aria-label="breadcrumb" className="!font-poppins">
            {breadcrumbs}
          </Breadcrumbs>
        </div>
      </div>

      <div className="bg-white p-3">
        <div className="container flex gap-3">
          <div className="sidebarWrapper w-[20%] h-full bg-white p-3 sticky top-0">
            <Sidebar />
          </div>


          <div className="rightContent w-[80%] flex flex-col gap-2 py-3 mb-4">
            <div className="bg-[#f1f1f1] p-2 w-full mb-3 rounded-md flex items-center justify-between pr-5">
              <div className="col1 flex items-center gap-1">
                {/* grid view */}
                <Button onClick={() => setItemView('grid')} className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.8)] ${itemView === 'grid' ? '!bg-[rgb(255,255,255)]' : '!bg-[rgba(0,0,0,0)]'}`}
                ><IoGridSharp className={`text-[20px] ${itemView === 'grid' ? '!text-[var(--bg-primary)]' : '!text-[rgba(0,0,0,0.5)]'}`} /></Button>

                {/* list view */}
                <Button onClick={() => setItemView('list')} className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.8)] ${itemView === 'list' ? '!bg-[rgb(255,255,255)]' : '!bg-[rgba(0,0,0,0)]'}`}
                ><TfiLayoutListThumbAlt className={`text-[20px] ${itemView === 'list' ? '!text-[var(--bg-primary)]' : '!text-[rgba(0,0,0,0.5)]'}`} /></Button>

                <span className="text-[14px] font-medium pl-3 text-[rgba(0,0,0,0.7)]">There are 27 products.</span>
              </div>

              <div className="col2 ml-auto flex items-center justify-end gap-2">
                <span className="text-[14px] font-medium pl-3 text-[rgba(0,0,0,0.7)]">Sort By:</span>
                <span>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleDropdownClick}
                    className="!bg-[var(--bg-primary)] !text-white !capitalize !h-8 !text-[14px] !w-[200px] flex !justify-start"
                  >
                    {selectedOption}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleDropdownClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={() => { handleDropdownClose(); handleMenuItemClick("Sales: highest to lowest"); }} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><HiBarsArrowDown />Sales: highest to lowest</MenuItem>
                    <MenuItem onClick={() => { handleDropdownClose(); handleMenuItemClick("Relevance"); }} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><PiTargetLight />Relevance</MenuItem>
                    <MenuItem onClick={() => { handleDropdownClose(); handleMenuItemClick("Name: A to Z"); }} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BsSortAlphaDown />Name: A to Z</MenuItem>
                    <MenuItem onClick={() => { handleDropdownClose(); handleMenuItemClick("Name: Z to A"); }} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BsSortAlphaUp />Name: Z to A</MenuItem>
                    <MenuItem onClick={() => { handleDropdownClose(); handleMenuItemClick("Price: low to high"); }} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BiTrendingUp />Price: low to high</MenuItem>
                    <MenuItem onClick={() => { handleDropdownClose(); handleMenuItemClick("Price: high to low"); }} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BiTrendingDown />Price: high to low</MenuItem>
                  </Menu>
                </span>
              </div>
            </div>

            <div className={`grid ${itemView === 'grid' ? "grid-cols-4 md:grid-cols-4" : "grid-cols-1 md:grid-cols-1"} gap-4`}>

              {
                itemView === 'grid' ?
                  <>
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                  </>

                  :

                  <>
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                  </>
              }
            </div>

            <div className="bottomPagination py-10 flex items-center justify-center">
              <Pagination defaultPage={1} count={10} showFirstButton showLastButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListing
