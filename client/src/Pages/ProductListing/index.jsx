import React, { useContext, useEffect, useState } from 'react'

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
import ProductItemListView from '../../components/ProductItemListview';
import Pagination from '@mui/material/Pagination';
import ProductLoadingGrid from './productLoadingGrid';
import { postData } from '../../utils/api';
import { MyContext } from '../../App';
import { FiFilter } from 'react-icons/fi';
import { useRef } from 'react';
import { LuFilter } from 'react-icons/lu';
import { IoIosArrowDown } from 'react-icons/io';


function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

const ProductListing = () => {

  const context = useContext(MyContext);
  const [itemView, setItemView] = useState('grid');
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedName, setSelectedName] = useState('');
  const [index, setIndex] = useState({ startIndex: 0, endIndex: 0 });
  const [selectedSortValue, setSelectedSortValue] = useState('Name: A to Z');
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarWrapper = useRef(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  // const handleMenuItemClick = (value) => {
  //   setSelectedSortValue(value); // Update the selected value
  //   handleDropdownClose(); // Close the menu
  // };

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

  useEffect(() => {
    if (context?.isSidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [context?.isSidebarOpen]);


  useEffect(() => {
    if (sidebarWrapper.current) {
      sidebarWrapper.current.scrollTo(0, 0);
    }
  }, []);

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

          {/* <div
            className={`
    sidebarWrapper fixed bottom-0 left-0 w-full !h-[70vh] lg:h-full lg:static lg:w-[22%]
    bg-white p-3 z-[102] lg:z-auto overflow-auto lg:overflow-visible customScroll
    transition-transform duration-300 ease-in-out
    ${context?.isSidebarOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
  `}
          > */}
          <div
            ref={sidebarWrapper}
            className={`
    sidebarWrapper fixed bottom-0 left-0 w-full !h-[70vh] lg:h-full lg:static lg:w-[22%]
    bg-white p-3 z-[102] lg:z-auto overflow-auto lg:overflow-visible customScroll
    transition-transform duration-300 ease-in-out
    ${context?.isSidebarOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
  `}
          >
            <div>
              <Sidebar
                productsData={productsData}
                setProductsData={setProductsData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                page={page}
                setPage={setPage}
                setTotalPages={setTotalPages}
                setTotal={setTotal}
                setSelectedName={setSelectedName}
                setIndex={setIndex}
                selectedSortValue={selectedSortValue}
                setSelectedSortValue={setSelectedSortValue}
              />
              {/* Close Button (mobile only) */}
              <div className="lg:hidden mt-4 text-center">
                <button
                  onClick={() => context?.setIsSidebarOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close Filters
                </button>
              </div>
            </div>
          </div>

          {
            context?.isSidebarOpen &&
            <div className='filter_overlay w-full !h-screen bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 z-[101]' onClick={() => context?.setIsSidebarOpen(false)}>
            </div>
          }

          <div className="rightContent w-full flex flex-col gap-2 py-3 mb-4">
            {/* View Toggle + Sorting */}
            <div className="bg-[#f1f1f1] p-2 w-full mb-3 rounded-md flex flex-col flex-wrap sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">

              {/* View Toggle & Result Info */}
              <div className="col1 flex items-center gap-1">
                <Button onClick={() => setItemView('grid')} className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full ${itemView === 'grid' ? '!bg-white' : '!bg-transparent'}`}>
                  <IoGridSharp className={`text-[20px] ${itemView === 'grid' ? '!text-[var(--bg-primary)]' : '!text-[rgba(0,0,0,0.5)]'}`} />
                </Button>
                <Button onClick={() => setItemView('list')} className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full ${itemView === 'list' ? '!bg-white' : '!bg-transparent'}`}>
                  <TfiLayoutListThumbAlt className={`text-[20px] ${itemView === 'list' ? '!text-[var(--bg-primary)]' : '!text-[rgba(0,0,0,0.5)]'}`} />
                </Button>
                <span className='font-semibold text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] sm:max-w-none'>
                  {total === 0
                    ? `No results found for ${
                    // Show search query if it exists, otherwise show selectedName, otherwise "All Products"
                    context?.searchQuery?.trim()
                      ? `"${context.searchQuery}"`
                      : selectedName?.trim()
                        ? `"${selectedName}"`
                        : `"All Products"`
                    }`
                    : index.startIndex === index.endIndex
                      ? `Showing ${index.startIndex} of ${total} results for ${context?.searchQuery?.trim()
                        ? `"${context.searchQuery}"`
                        : selectedName?.trim()
                          ? `"${selectedName}"`
                          : `"All Products"`
                      }`
                      : `Showing ${index.startIndex}–${index.endIndex} of ${total} results for ${context?.searchQuery?.trim()
                        ? `"${context.searchQuery}"`
                        : selectedName?.trim()
                          ? `"${selectedName}"`
                          : `"All Products"`
                      }`
                  }
                </span>
              </div>

              <div className={`flex items-center justify-center gap-3 ${context?.windowWidth < 992 ? "w-full" : "w-auto"}`}>
                <span className="text-sm font-medium text-gray-600 hidden lg:block">Sort By:</span>
                <div className={`w-full ${context?.windowWidth < 992 ? "block" : "hidden"}`}>
                  <Button className="!w-full !bg-primary !text-white !capitalize !h-9 !text-sm lg:!min-w-[160px] !px-4 flex items-center justify-between gap-2 hover:!bg-primary-dark transition-colors" onClick={() => context?.setIsSidebarOpen(true)}>
                    <LuFilter /> Filters
                  </Button>
                </div>
                <div className="relative w-full">
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleDropdownClick}
                    className="!w-full !bg-primary !text-white !capitalize !h-9 !text-sm lg:!min-w-[160px] !px-4 flex items-center justify-between hover:!bg-primary-dark transition-colors"
                    endIcon={<IoIosArrowDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
                  >
                    {selectedSortValue || 'Default'}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleDropdownClose}
                    MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                    className="mt-1"
                    slotProps={{ paper: { className: "!min-w-[160px] rounded-lg !shadow-lg" } }}
                  >

                    <MenuItem
                      onClick={() =>
                        Array.isArray(productsData.data)
                          ? handleSortBy("name", "asc", productsData.data, "Name: A to Z")
                          : console.error("productsData.data is not an array:", productsData.data)
                      }
                      className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"
                    >
                      <BsSortAlphaDown className="text-gray-500 mr-2" /> Name: A to Z
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        Array.isArray(productsData.data)
                          ? handleSortBy("name", "desc", productsData.data, "Name: Z to A")
                          : console.error("productsData.data is not an array:", productsData.data)
                      }
                      className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"
                    >
                      <BsSortAlphaUp className="text-gray-500 mr-2" /> Name: Z to A
                    </MenuItem>
                    <div className="border-t border-gray-100 my-1"></div>
                    <MenuItem
                      onClick={() =>
                        Array.isArray(productsData.data)
                          ? handleSortBy("price", "asc", productsData.data, "Price: low to high")
                          : console.error("productsData.data is not an array:", productsData.data)
                      }
                      className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"
                    >
                      <BiTrendingDown className="text-gray-500 mr-2" /> Price: low to high
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        Array.isArray(productsData.data)
                          ? handleSortBy("price", "desc", productsData.data, "Price: high to low")
                          : console.error("productsData.data is not an array:", productsData.data)
                      }
                      className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"
                    >
                      <BiTrendingUp className="text-gray-500 mr-2" /> Price: high to low
                    </MenuItem>
                    <div className="border-t border-gray-100 my-1"></div>
                    <MenuItem
                      onClick={() =>
                        Array.isArray(productsData.data)
                          ? handleSortBy("rating", "asc", productsData.data, "Rating: low to high")
                          : console.error("productsData.data is not an array:", productsData.data)
                      }
                      className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"
                    >
                      <BiTrendingDown className="text-gray-500 mr-2" /> Rating: low to high
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        Array.isArray(productsData.data)
                          ? handleSortBy("rating", "desc", productsData.data, "Rating: high to low")
                          : console.error("productsData.data is not an array:", productsData.data)
                      }
                      className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"
                    >
                      <BiTrendingUp className="text-gray-500 mr-2" /> Rating: high to low
                    </MenuItem>


                  </Menu>
                </div>
              </div>
            </div>

            <div className={`grid ${itemView === 'grid' ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-1"} gap-3`}>
              {
                itemView === "grid" ? (
                  <>
                    {isLoading ? (
                      <ProductLoadingGrid view={itemView} size={8} />
                    ) : productsData?.data?.length > 0 ? (
                      productsData?.data?.map((item, index) => (
                        <ProductItem product={item} key={index} />
                      ))
                    ) : (
                      <p>No products found.</p>
                    )}
                  </>
                ) : (
                  <>
                    {isLoading ? (
                      <ProductLoadingGrid view={itemView} size={8} />
                    ) : productsData?.data?.length > 0 ? (
                      productsData?.data?.map((item, index) => (
                        <ProductItemListView product={item} key={index} />
                      ))
                    ) : (
                      <p>No products found.</p>
                    )}
                  </>
                )
              }

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

    // <section className="py-0 pb-0">
    //   {/* Breadcrumbs Section */}
    //   <div className="bg-white px-4 sm:px-5 pb-2 py-3 sm:py-5 border-b">
    //     <div className="container">
    //       <Breadcrumbs separator={"/"} aria-label="breadcrumb" className="!text-[var(--text-dark)] overflow-x-auto whitespace-nowrap">
    //         <Link
    //           underline="hover"
    //           key="1" color="inherit"
    //           href="/"
    //           onClick={handleClick}
    //           className="link transition capitalize text-[12px] sm:text-[14px] hover:underline underline-offset-4">
    //           Home
    //         </Link>
    //         <Link
    //           underline="hover"
    //           key="2"
    //           color="inherit"
    //           href="/material-ui/getting-started/installation/"
    //           onClick={handleClick}
    //           className="link transition capitalize text-[12px] sm:text-[14px] hover:underline underline-offset-4"
    //         >
    //           Fashion
    //         </Link>
    //         <Link
    //           underline="hover"
    //           key="3"
    //           color="inherit"
    //           href="/material-ui/getting-started/installation/"
    //           onClick={handleClick}
    //           className="link transition capitalize text-[12px] sm:text-[14px] hover:underline underline-offset-4"
    //         >
    //           Men
    //         </Link>
    //         <Link
    //           underline="hover"
    //           key="4"
    //           color="inherit"
    //           href="/material-ui/getting-started/installation/"
    //           onClick={handleClick}
    //           className="link transition capitalize text-[12px] sm:text-[14px] font-bold text-[var(--text-dark)] hover:underline underline-offset-4"
    //         >
    //           T-Shirt
    //         </Link>
    //       </Breadcrumbs>
    //     </div>
    //   </div>

    //   {/* Main Content Section */}
    //   <div className="bg-white p-2 sm:p-3">
    //     <div className="container flex flex-col lg:flex-row gap-3">
    //       {/* Mobile Sidebar Toggle Button - Only visible on small screens */}
    //       <div className="lg:hidden flex justify-between items-center p-2 border-b">
    //         <button
    //           onClick={() => setSidebarOpen(!sidebarOpen)}
    //           className="flex items-center gap-2 text-[var(--text-dark)]"
    //         >
    //           <FiFilter className="text-lg" />
    //           <span>Filters</span>
    //         </button>
    //         <span className='font-semibold text-sm sm:text-base'>
    //           {total === 0
    //             ? `No results found for ${selectedName?.trim() ? `"${selectedName}"` : context?.searchQuery?.trim() ? `"${context?.searchQuery}"` : `"All Products"`}`
    //             : index.startIndex === index.endIndex
    //               ? `Showing ${index.startIndex} of ${total} results`
    //               : `Showing ${index.startIndex} – ${index.endIndex} of ${total} results`}
    //         </span>
    //       </div>

    //       {/* Sidebar - Responsive behavior */}
    //       <div className={`sidebarWrapper ${sidebarOpen ? 'fixed inset-0 z-50 bg-white p-4 overflow-y-auto' : 'hidden'} lg:static lg:w-[20%] lg:block`}>
    //         {sidebarOpen && (
    //           <div className="flex justify-between items-center mb-4 lg:hidden">
    //             <h3 className="text-lg font-bold">Filters</h3>
    //             <button onClick={() => setSidebarOpen(false)} className="text-2xl">
    //               &times;
    //             </button>
    //           </div>
    //         )}
    //         <Sidebar
    //           productsData={productsData}
    //           setProductsData={setProductsData}
    //           isLoading={isLoading}
    //           setIsLoading={setIsLoading}
    //           page={page}
    //           setPage={setPage}
    //           setTotalPages={setTotalPages}
    //           setTotal={setTotal}
    //           setSelectedName={setSelectedName}
    //           setIndex={setIndex}
    //         />
    //       </div>

    //       {/* Main Content Area */}
    //       <div className="rightContent w-full lg:w-[80%] flex flex-col gap-2 py-3 mb-4">
    //         {/* View Controls and Sorting - Hidden on mobile (moved to top) */}
    //         <div className="bg-[#f1f1f1] p-2 w-full mb-3 rounded-md hidden lg:flex items-center justify-between pr-5">
    //           <div className="col1 flex items-center gap-1">
    //             {/* grid view */}
    //             <Button onClick={() => setItemView('grid')} className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.8)] ${itemView === 'grid' ? '!bg-[rgb(255,255,255)]' : '!bg-[rgba(0,0,0,0)]'}`}
    //             ><IoGridSharp className={`text-[20px] ${itemView === 'grid' ? '!text-[var(--bg-primary)]' : '!text-[rgba(0,0,0,0.5)]'}`} /></Button>

    //             {/* list view */}
    //             <Button onClick={() => setItemView('list')} className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.8)] ${itemView === 'list' ? '!bg-[rgb(255,255,255)]' : '!bg-[rgba(0,0,0,0)]'}`}
    //             ><TfiLayoutListThumbAlt className={`text-[20px] ${itemView === 'list' ? '!text-[var(--bg-primary)]' : '!text-[rgba(0,0,0,0.5)]'}`} /></Button>

    //             <span className='font-semibold hidden md:block'>
    //               {total === 0
    //                 ? `No results found for ${selectedName?.trim() ? `"${selectedName}"` : context?.searchQuery?.trim() ? `"${context?.searchQuery}"` : `"All Products"`}`
    //                 : index.startIndex === index.endIndex
    //                   ? `Showing ${index.startIndex} of ${total} results for ${selectedName?.trim() ? `"${selectedName}"` : context?.searchQuery?.trim() ? `"${context?.searchQuery}"` : `"All Products"`
    //                   }`
    //                   : `Showing ${index.startIndex} – ${index.endIndex} of ${total} results for ${selectedName?.trim() ? `"${selectedName}"` : context?.searchQuery?.trim() ? `"${context?.searchQuery}"` : `"All Products"`
    //                   }`}
    //             </span>
    //           </div>

    //           <div className="col2 ml-auto flex items-center justify-end gap-2">
    //             <span className="text-[14px] font-medium pl-3 text-[rgba(0,0,0,0.7)] hidden sm:block">Sort By:</span>
    //             <span>
    //               <Button
    //                 id="basic-button"
    //                 aria-controls={open ? 'basic-menu' : undefined}
    //                 aria-haspopup="true"
    //                 aria-expanded={open ? 'true' : undefined}
    //                 onClick={handleDropdownClick}
    //                 className="!bg-[var(--bg-primary)] !text-white !capitalize !h-8 !text-[14px] !w-[160px] sm:!w-[200px] flex !justify-start"
    //               >
    //                 {selectedSortValue}
    //               </Button>
    //               <Menu
    //                 id="basic-menu"
    //                 anchorEl={anchorEl}
    //                 open={open}
    //                 onClose={handleDropdownClose}
    //                 MenuListProps={{
    //                   'aria-labelledby': 'basic-button',
    //                 }}
    //               >
    //                 <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("name", "asc", productsData.data, "Name: A to Z") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BsSortAlphaDown />Name: A to Z</MenuItem>
    //                 <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("name", "desc", productsData.data, "Name: Z to A") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BsSortAlphaUp />Name: Z to A</MenuItem>
    //                 <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("price", "asc", productsData.data, "Price: low to high") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BiTrendingUp />Price: low to high</MenuItem>
    //                 <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("price", "desc", productsData.data, "Price: high to low") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BiTrendingDown />Price: high to low</MenuItem>
    //                 <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("rating", "asc", productsData.data, "Rating: low to high") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BiTrendingDown />Rating: low to high</MenuItem>
    //                 <MenuItem onClick={() => Array.isArray(productsData.data) ? handleSortBy("rating", "desc", productsData.data, "Rating: high to low") : console.error("productsData.data is not an array:", productsData.data)} className="!text-[14px] !text-[rgba(0,0,0,0.8)] gap-1"><BiTrendingDown />Rating: high to low</MenuItem>
    //               </Menu>
    //             </span>
    //           </div>
    //         </div>

    //         {/* Product Grid */}
    //         <div className={`grid ${itemView === 'grid' ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"} gap-3`}>
    //           {itemView === "grid" ? (
    //             <>
    //               {isLoading ? (
    //                 <ProductLoadingGrid view={itemView} size={8} />
    //               ) : productsData?.data?.length > 0 ? (
    //                 productsData?.data?.map((item, index) => (
    //                   <ProductItem product={item} key={index} />
    //                 ))
    //               ) : (
    //                 <p className="col-span-full text-center py-10">No products found.</p>
    //               )}
    //             </>
    //           ) : (
    //             <>
    //               {isLoading ? (
    //                 <ProductLoadingGrid view={itemView} size={8} />
    //               ) : productsData?.data?.length > 0 ? (
    //                 productsData?.data?.map((item, index) => (
    //                   <ProductItemListView product={item} key={index} />
    //                 ))
    //               ) : (
    //                 <p className="col-span-full text-center py-10">No products found.</p>
    //               )}
    //             </>
    //           )}
    //         </div>

    //         {/* Pagination */}
    //         {totalPages > 0 &&
    //           <div className="bottomPagination py-5 sm:py-10 flex items-center justify-center">
    //             <Pagination
    //               count={totalPages}
    //               page={page}
    //               onChange={(e, value) => setPage(value)}
    //               showFirstButton
    //               showLastButton
    //               size="small"
    //               siblingCount={1}
    //               boundaryCount={1}
    //             />
    //           </div>
    //         }
    //       </div>
    //     </div>
    //   </div>
    // </section>
  )
}

export default ProductListing
