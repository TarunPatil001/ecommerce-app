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



  return (
    <section className="py-0 pb-0">
      <div className="bg-white px-5 pb-2 py-5 border-b">
        <div className="container flex items-center bg-white">
          <Breadcrumbs separator={"/"} aria-label="breadcrumb" className="!text-[var(--text-dark)]">
            <Link
              underline="hover"
              key="1"
              color="inherit"
              href="/"
              onClick={handleClick}
              className="link transition capitalize text-[14px] hover:underline underline-offset-4"
            >
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
              page={page}               // Current page number
              setPage={setPage}         // Function to update page
              setTotalPages={setTotalPages}
              setTotal={setTotal}
              setSelectedName={setSelectedName}
              setIndex={setIndex}
              selectedSortValue={selectedSortValue}
              setSelectedSortValue={setSelectedSortValue}
            />
          </div>

          <div className="rightContent w-[80%] flex flex-col gap-2 py-3 mb-4">
            <div className="bg-[#f1f1f1] p-2 w-full mb-3 rounded-md flex items-center justify-between pr-5">
              <div className="col1 flex items-center gap-1">
                <Button onClick={() => setItemView('grid')} className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.8)] ${itemView === 'grid' ? '!bg-[rgb(255,255,255)]' : '!bg-[rgba(0,0,0,0)]'}`}>
                  <IoGridSharp className={`text-[20px] ${itemView === 'grid' ? '!text-[var(--bg-primary)]' : '!text-[rgba(0,0,0,0.5)]'}`} />
                </Button>
                <Button onClick={() => setItemView('list')} className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.8)] ${itemView === 'list' ? '!bg-[rgb(255,255,255)]' : '!bg-[rgba(0,0,0,0)]'}`}>
                  <TfiLayoutListThumbAlt className={`text-[20px] ${itemView === 'list' ? '!text-[var(--bg-primary)]' : '!text-[rgba(0,0,0,0.5)]'}`} />
                </Button>

                <span className='font-semibold'>
                  {total === 0
                    ? `No results found for ${context?.searchQuery?.trim()
                      ? `"${context?.searchQuery}"`
                      : selectedName?.trim()
                        ? `"${selectedName}"`
                        : `"All Products"`}`
                    : index.startIndex === index.endIndex
                      ? `Showing ${index.startIndex} of ${total} results for ${context?.searchQuery?.trim()
                        ? `"${context?.searchQuery}"`
                        : selectedName?.trim()
                          ? `"${selectedName}"`
                          : `"All Products"`}`
                      : `Showing ${index.startIndex} – ${index.endIndex} of ${total} results for ${context?.searchQuery?.trim()
                        ? `"${context?.searchQuery}"`
                        : selectedName?.trim()
                          ? `"${selectedName}"`
                          : `"All Products"`}`
                  }
                </span>
              </div>

              <div className="flex items-center justify-end gap-3">
                <span className="text-sm font-medium text-gray-600">Sort By:</span>
                <div className="relative">
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleDropdownClick}
                    className="!bg-primary !text-white !capitalize !h-9 !text-sm !min-w-[200px] !px-4 flex items-center justify-between hover:!bg-primary-dark transition-colors"
                    endIcon={<IoIosArrowDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
                  >
                    {selectedSortValue || 'Default'}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleDropdownClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                    className="mt-1"
                    slotProps={{
                      paper: {
                        className: "!min-w-[200px] rounded-lg !shadow-lg" // Optional Tailwind classes
                      }
                    }}
                  >

                    <MenuItem
                      onClick={() => handleSortBy("name", "asc", sortedData, "Name: A to Z")}
                      className="!text-sm !text-gray-700 !px-4 !py-2 hover:!bg-gray-50 gap-2"
                    >
                      <BsSortAlphaDown className="text-gray-500" />
                      Name: A to Z
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSortBy("name", "desc", sortedData, "Name: Z to A")}
                      className="!text-sm !text-gray-700 !px-4 !py-2 hover:!bg-gray-50 gap-2"
                    >
                      <BsSortAlphaUp className="text-gray-500" />
                      Name: Z to A
                    </MenuItem>
                    <div className="border-t border-gray-100 my-1"></div>
                    <MenuItem
                      onClick={() => handleSortBy("price", "asc", sortedData, "Price: low to high")}
                      className="!text-sm !text-gray-700 !px-4 !py-2 hover:!bg-gray-50 gap-2"
                    >
                      <BiTrendingDown className="text-gray-500" />
                      Price: low to high
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSortBy("price", "desc", sortedData, "Price: high to low")}
                      className="!text-sm !text-gray-700 !px-4 !py-2 hover:!bg-gray-50 gap-2"
                    >
                      <BiTrendingUp className="text-gray-500" />
                      Price: high to low
                    </MenuItem>
                    <div className="border-t border-gray-100 my-1"></div>
                    <MenuItem
                      onClick={() => handleSortBy("rating", "asc", sortedData, "Rating: low to high")}
                      className="!text-sm !text-gray-700 !px-4 !py-2 hover:!bg-gray-50 gap-2"
                    >
                      <BiTrendingDown className="text-gray-500" />
                      Rating: low to high
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSortBy("rating", "desc", sortedData, "Rating: high to low")}
                      className="!text-sm !text-gray-700 !px-4 !py-2 hover:!bg-gray-50 gap-2"
                    >
                      <BiTrendingUp className="text-gray-500" />
                      Rating: high to low
                    </MenuItem>
                  </Menu>
                </div>
              </div>

            </div>


            <div className={`grid ${itemView === 'grid' ? "grid-cols-4 md:grid-cols-4" : "grid-cols-1 md:grid-cols-1"} gap-3`}>
              {isLoading ? (
                <ProductLoadingGrid view={itemView} size={8} />
              ) : (
                productsData?.data?.length > 0 ? (
                  productsData.data.map((item, index) => (
                    itemView === 'grid' ? (
                      <ProductItem product={item} key={index} />
                    ) : (
                      <ProductItemListView product={item} key={index} />
                    )
                  ))
                ) : (
                  <p>No products found.</p>
                )
              )}
            </div>

            {totalPages > 0 && (
              <div className="bottomPagination py-10 flex items-center justify-center">
                <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} showFirstButton showLastButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;