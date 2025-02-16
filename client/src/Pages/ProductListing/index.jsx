import React, { useEffect, useState } from 'react'

import Sidebar from "../../components/Sidebar"
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from "react-router-dom";
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
import ProductLoadingGrid from './productLoadingGrid';
import { fetchDataFromApi, postData } from '../../utils/api';


function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

const ProductListing = () => {

  const [itemView, setItemView] = useState('grid');

  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedName, setSelectedName] = useState('');
  const [selectedSortValue, setSelectedSortValue] = useState('Name: A to Z');


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value) => {
    setSelectedSortValue(value); // Update the selected value
    handleDropdownClose(); // Close the menu
  };

  const handleSortBy = (name, order, products, value) => {
    if (!Array.isArray(products)) {
      console.error("Invalid products data:", products);
      return;
    }

    setSelectedSortValue(value);

    postData(`/api/product/sortBy`, {
      data: products,
      sortBy: name,
      order: order,
    })
      .then((res) => {
        if (res.success) {
          setProductsData(res);
          setAnchorEl(null);
        } else {
          console.error("Failed to sort products:", res.message);
        }
      })
      .catch((error) => {
        console.error("Error sorting products:", error);
      });
  };



  return (
    <section className="py-0 pb-0">

      <div className="bg-white px-5 pb-2 py-5 border-b">
        <div className="container flex items-center bg-white">
          <Breadcrumbs separator={"/"} aria-label="breadcrumb" className="!text-[var(--text-dark)]">
            <Link
              underline="hover"
              key="1" color="inherit"
              href="/"
              onClick={handleClick}
              className="link transition capitalize text-[14px] hover:underline underline-offset-4">
              Home
            </Link>
            <Link
              underline="hover"
              key="2"
              color="inherit"
              href="/material-ui/getting-started/installation/"
              onClick={handleClick}
              className="link transition capitalize text-[14px] hover:underline underline-offset-4"
            >
              Fashion
            </Link>
            <Link
              underline="hover"
              key="3"
              color="inherit"
              href="/material-ui/getting-started/installation/"
              onClick={handleClick}
              className="link transition capitalize text-[14px] hover:underline underline-offset-4"
            >
              Men
            </Link>
            <Link
              underline="hover"
              key="4"
              color="inherit"
              href="/material-ui/getting-started/installation/"
              onClick={handleClick}
              className="link transition capitalize text-[14px] font-bold text-[var(--text-dark)] hover:underline underline-offset-4"
            >
              T-Shirt
            </Link>

          </Breadcrumbs>
        </div>
      </div>

      <div className="bg-white p-3">
        <div className="container flex gap-3">
          <div className="sidebarWrapper w-[20%] h-full bg-white p-3">
            <Sidebar
              productsData={productsData}
              setProductsData={setProductsData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              page={page}
              setTotalPages={setTotalPages}
              setTotal={setTotal}
              setSelectedName={setSelectedName}
            />
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

                <span className="text-[14px] font-medium pl-3 text-[rgba(0,0,0,0.7)]"><span className='font-bold'>{'Total'}</span> - {total || 0} Product{total > 2 ? 's' : ''}</span>
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
                    {selectedSortValue}
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

                    <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("name", "asc", productsData.data, "Name: A to Z") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BsSortAlphaDown />Name: A to Z</MenuItem>
                    <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("name", "desc", productsData.data, "Name: Z to A") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BsSortAlphaUp />Name: Z to A</MenuItem>
                    <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("price", "asc", productsData.data, "Price: low to high") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BiTrendingUp />Price: low to high</MenuItem>
                    <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("price", "desc", productsData.data, "Price: high to low") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BiTrendingDown />Price: high to low</MenuItem>
                    <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("rating", "asc", productsData.data, "Rating: low to high") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BiTrendingDown />Rating: low to high</MenuItem>
                    <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("rating", "desc", productsData.data, "Rating: high to low") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BiTrendingDown />Rating: high to low</MenuItem>

                  </Menu>
                </span>
              </div>
            </div>

            <div className={`grid ${itemView === 'grid' ? "grid-cols-4 md:grid-cols-4" : "grid-cols-1 md:grid-cols-1"} gap-3`}>
              {
                itemView === 'grid' ? (
                  <>
                    {
                      isLoading === true ?
                        <ProductLoadingGrid view={itemView} size={8} /> :
                        productsData?.data?.length !== 0 && productsData?.data?.map((item, index) => {
                          return (
                            <ProductItem product={item} key={index} />
                          )
                        })
                    }
                  </>
                ) : (
                  <>
                    {
                      isLoading === true ?
                        <>
                          <ProductLoadingGrid view={itemView} size={8} />
                        </>
                        :
                        productsData?.data?.length !== 0 && productsData?.data?.map((item, index) => {
                          return (
                            <ProductItemListView product={item} key={index} />
                          )
                        })
                    }
                  </>
                )
              }


              {/* {
                itemView === 'grid' ? (
                  <>
                    {isLoading ? (
                      <ProductLoadingGrid view={itemView} />
                    ) : (
                      Array.isArray(productsData) && productsData.length > 0 ? (
                        productsData.map((item, index) => <ProductItem product={item} key={index} />)
                      ) : (
                        <p>No products found.</p> // Handle empty state
                      )
                    )}
                  </>
                ) : (
                  <>
                    {isLoading ? (
                      <ProductLoadingGrid view={itemView} />
                    ) : (
                      Array.isArray(productsData) && productsData.length > 0 ? (
                        productsData.map((item, index) => <ProductItemListView product={item} key={index} />)
                      ) : (
                        <p>No products found.</p> // Handle empty state
                      )
                    )}
                  </>
                )
              } */}
            </div>

            {
              totalPages > 0 &&
              <div className="bottomPagination py-10 flex items-center justify-center">
                <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} showFirstButton showLastButton />
              </div>
            }
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProductListing
