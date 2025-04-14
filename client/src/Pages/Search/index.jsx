import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "../../components/Sidebar";
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
import { IoIosArrowDown } from 'react-icons/io';
import { FiFilter } from 'react-icons/fi';
import { useRef } from 'react';
import { LuFilter } from 'react-icons/lu';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

const SearchPage = () => {
  const context = useContext(MyContext);
  const [itemView, setItemView] = useState('grid');
  const [productsData, setProductsData] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedName, setSelectedName] = useState('');
  const [selectedSortValue, setSelectedSortValue] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [index, setIndex] = useState({ startIndex: 0, endIndex: 0 });
  const open = Boolean(anchorEl);
  const sortedData = context?.searchData?.data || context?.filteredProductData?.data;
  const sidebarWrapper = useRef(null);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleSortBy = async (name, order, products, value) => {
    if (!Array.isArray(products)) {
      console.error("Invalid products data:", products);
      return;
    }

    setSelectedSortValue(value);

    try {
      const res = await postData(`/api/product/sortBy`, {
        data: products,
        sortBy: name,
        order: order,
      });

      if (res.success) {
        if (context?.searchData?.data) {
          context.setSearchData((prev) => ({ ...prev, data: res.data }));
          setPage(1);

        } else if (context?.filteredProductData?.data) {
          context.setFilteredProductData((prev) => ({ ...prev, data: res.data }));
          setPage(1);

        }
        setAnchorEl(null);
      } else {
        console.error("Failed to sort products:", res.message);
      }
    } catch (error) {
      console.error("Error sorting products:", error);
    }
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
      {/* Breadcrumbs */}
      <div className="bg-white px-4 sm:px-5 py-3 sm:py-4 border-b">
        <div className="container">
          <Breadcrumbs
            separator={<span className="mx-1">/</span>}
            aria-label="breadcrumb"
            className="!text-[var(--text-dark)] overflow-x-auto whitespace-nowrap py-1"
          >
            {[
              { label: "Home", href: "/" },
              { label: "Fashion", href: "/fashion" },
              { label: "Men", href: "/fashion/men" },
              { label: "T-Shirt", href: "/fashion/men/t-shirts" }
            ].map((item, index) => (
              <Link
                key={index}
                underline="hover"
                color="inherit"
                href={item.href}
                onClick={handleClick}
                className={`link transition capitalize text-xs sm:text-sm hover:underline underline-offset-2 ${index === 3 ? "font-bold text-[var(--text-dark)]" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </Breadcrumbs>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-white p-2 sm:p-3">
        <div className="container flex flex-col lg:flex-row gap-3">

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


          {/* Right Content */}
          <div className="rightContent w-full flex flex-col gap-2 py-3 mb-4">
            {/* View Toggle + Sorting */}
            <div className="bg-[#f1f1f1] p-2 w-full mb-3 rounded-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0">

              {/* View Toggle & Result Info */}
              <div className="col1 flex items-center gap-1">
                <Button onClick={() => setItemView('grid')} className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full ${itemView === 'grid' ? '!bg-white' : '!bg-transparent'}`}>
                  <IoGridSharp className={`text-[20px] ${itemView === 'grid' ? '!text-[var(--bg-primary)]' : '!text-[rgba(0,0,0,0.5)]'}`} />
                </Button>
                <Button onClick={() => setItemView('list')} className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full ${itemView === 'list' ? '!bg-white' : '!bg-transparent'}`}>
                  <TfiLayoutListThumbAlt className={`text-[20px] ${itemView === 'list' ? '!text-[var(--bg-primary)]' : '!text-[rgba(0,0,0,0.5)]'}`} />
                </Button>
                <span className='font-semibold text-sm sm:text-base'>
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

              {/* Sort Dropdown */}
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
                    <MenuItem onClick={() => handleSortBy("name", "asc", sortedData, "Name: A to Z")}>
                      <BsSortAlphaDown className="text-gray-500 mr-2" /> Name: A to Z
                    </MenuItem>
                    <MenuItem onClick={() => handleSortBy("name", "desc", sortedData, "Name: Z to A")}>
                      <BsSortAlphaUp className="text-gray-500 mr-2" /> Name: Z to A
                    </MenuItem>
                    <div className="border-t border-gray-100 my-1"></div>
                    <MenuItem onClick={() => handleSortBy("price", "asc", sortedData, "Price: low to high")}>
                      <BiTrendingDown className="text-gray-500 mr-2" /> Price: low to high
                    </MenuItem>
                    <MenuItem onClick={() => handleSortBy("price", "desc", sortedData, "Price: high to low")}>
                      <BiTrendingUp className="text-gray-500 mr-2" /> Price: high to low
                    </MenuItem>
                    <div className="border-t border-gray-100 my-1"></div>
                    <MenuItem onClick={() => handleSortBy("rating", "asc", sortedData, "Rating: low to high")}>
                      <BiTrendingDown className="text-gray-500 mr-2" /> Rating: low to high
                    </MenuItem>
                    <MenuItem onClick={() => handleSortBy("rating", "desc", sortedData, "Rating: high to low")}>
                      <BiTrendingUp className="text-gray-500 mr-2" /> Rating: high to low
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid ${itemView === 'grid' ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1"} gap-3`}>
              {isLoading ? (
                <ProductLoadingGrid view={itemView} size={8} />
              ) : (
                productsData?.data?.length > 0 ? (
                  productsData.data.map((item, index) => (
                    itemView === 'grid'
                      ? <ProductItem product={item} key={index} />
                      : <ProductItemListView product={item} key={index} />
                  ))
                ) : (
                  <p>No products found.</p>
                )
              )}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="bottomPagination py-10 flex items-center justify-center">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  showFirstButton
                  showLastButton
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

  );
};

export default SearchPage;