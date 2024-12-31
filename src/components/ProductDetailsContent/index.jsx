import React, { useEffect, useState } from 'react'

import QtyBox from '../../components/QtyBox';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { IoGitCompareOutline } from 'react-icons/io5';
import { Button, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductDetailsContent = () => {

    const [productActionIndex, setProductActionIndex] = useState(null);
    const [checked, setChecked] = useState(false);
    const [totalStocks, setTotalStocks] = useState(10); // Initialize state to hold totalStocks
    const [quantity, setQuantity] = useState(totalStocks === 0 ? 0 : 1); // State to hold quantity in parent

    // Callback to handle quantity change in parent
    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity); // Update quantity in parent
    };

    // Watch totalStocks to reset productActionIndex when stocks are zero
    useEffect(() => {
        if (totalStocks === 0) {
            setProductActionIndex(null); // Reset to null when totalStocks is 0
        }
    }, [totalStocks]);

   
    return (
        <>
            <h1 className="text-[24px] text-[var(--text-dark)] font-bold mb-1 productBrand"><Link to="/">Libas</Link></h1>
            <h1 className="text-[24px] mb-1 productTitle"><Link to="/">Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</Link></h1>
            <div className="flex items-center justify-start gap-3 text-[16px] py-1">
                <Link to="/">
                    <span className="flex items-center gap-1 border px-2 hover:border-[var(--text-dark)]">
                        <span className="flex items-center gap-1 font-semibold">4.1<Rating defaultValue={1} size="small" max={1} readOnly className="!text-[var(--rating-star-color)]" /></span>
                        <span className="line !h-[15px] mx-0.5"></span>
                        <span className="flex items-center gap-1 font-semibold">{new Intl.NumberFormat("en", { notation: "compact" }).format(5100).toLowerCase()}<span className="font-normal">Ratings</span></span>
                    </span>
                </Link>
                <span className="line !h-[15px] mx-1"></span>
                <span className="cursor-pointer link">Review (5)</span>
            </div>

            <hr className="my-2" />

            <div className="flex items-center gap-3 py-1 ">
                <span className="price text-[var(--text-dark)] text-[24px] font-bold flex items-center gap-0.5">
                    ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                </span>
                <span className="oldPrice text-[var(--text-light)] text-[20px] font-normal flex items-center gap-0.5">
                    MRP<span className="line-through gap-0.5">₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span></span>
                </span>
                <span className="uppercase text-[20px] text-[var(--off-color)] font-bold">(17% OFF)</span>
                <span className="line !h-[15px] mx-0.5"></span>
                <span className="text-[var(--text-light)] text-[16px] font-normal flex items-center gap-2">Available in stocks:
                    {
                        totalStocks != 0 ?
                            <span className="font-bold text-[var(--rating-star-color)]">{`${totalStocks} Items`}</span>
                            :
                            <span className="p-1 text-[12px] bg-red-50 font-bold text-red-500 border border-red-500 capitalize">Out of Stock</span>
                    }

                </span>
            </div>

            <div className="description py-1 mb-5 mt-3">
                <p className="pr-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos fugiat repudiandae vel corrupti recusandae nesciunt vero aut quod maiores nisi quae dolor assumenda voluptatum alias earum error in doloremque enim a laudantium ducimus, tempore dolores officiis. Dignissimos voluptates culpa officiis hic, amet animi velit nihil reprehenderit totam corporis minus numquam.</p>
            </div>

            <div className="flex items-center gap-3 mb-4">
                <span className="text-[16px] font-bold">Size:</span>
                <div className="flex items-center gap-1 actions">
                    <Button
                        className={`${productActionIndex === 0 ? "!bg-[var(--bg-primary)] !text-white" : ""} ${totalStocks === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
                        onClick={() => { totalStocks !== 0 && setProductActionIndex(0) }} disableRipple={totalStocks === 0}>
                        S
                    </Button>
                    <Button
                        className={`${productActionIndex === 1 ? "!bg-[var(--bg-primary)] !text-white" : ""} ${totalStocks === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
                        onClick={() => { totalStocks !== 0 && setProductActionIndex(1) }} disableRipple={totalStocks === 0}>
                        M
                    </Button>
                    <Button
                        className={`${productActionIndex === 2 ? "!bg-[var(--bg-primary)] !text-white" : ""} ${totalStocks === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
                        onClick={() => { totalStocks !== 0 && setProductActionIndex(2) }} disableRipple={totalStocks === 0}>
                        L
                    </Button>
                    <Button
                        className={`${productActionIndex === 3 ? "!bg-[var(--bg-primary)] !text-white" : ""} ${totalStocks === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
                        onClick={() => { totalStocks !== 0 && setProductActionIndex(3) }} disableRipple={totalStocks === 0}>
                        XL
                    </Button>
                    <Button
                        className={`${productActionIndex === 4 ? "!bg-[var(--bg-primary)] !text-white" : ""} ${totalStocks === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
                        onClick={() => { totalStocks !== 0 && setProductActionIndex(4) }} disableRipple={totalStocks === 0}>
                        XXL
                    </Button>
                </div>
            </div>
            <p className="text-[14px] text-[rgba(0,0,0,0.5)]">Free Shipping (Est. Delivery Time 2-3 Days)</p>

            <div className="flex items-center my-4 gap-5">
                <div className="qtyBoxWrapper w-[95px]">
                    {/* Ensure QtyBox is updated and working with the totalStocks prop */}
                    <QtyBox totalStocks={totalStocks} onQuantityChange={handleQuantityChange} />
                </div>
                <Button
                    className={`!h-[40px] w-52 !text-[16px] flex items-center justify-center gap-1 ${totalStocks === 0 ? "!cursor-not-allowed !bg-gray-300 !text-white" : "buttonPrimaryBlack"}`}
                    onClick={() => { totalStocks !== 0 && null }} disableRipple={totalStocks === 0}>
                    <MdOutlineShoppingCart className="text-[16px]" />
                    Add To Cart
                </Button>
            </div>


            <div className="flex items-center gap-4 my-4">
                {/* The actual checkbox input */}
                <input
                    id="wishlist-checkbox"
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)} // Toggle state on change
                    className="hidden" // Hide the native checkbox for custom styling
                />

                {/* Custom icon for the checkbox */}
                <label htmlFor="wishlist-checkbox" className="flex items-center gap-1 cursor-pointer group link text-[18px]">
                    {checked ? (
                        <IoMdHeart className="text-[22px] text-red-500 transition-all duration-300 " />
                    ) : (
                        <IoMdHeartEmpty className="text-[22px] text-gray-700 group-hover:text-[var(--bg-primary)] transition-all duration-300" />
                    )}
                    <span className="transition-all duration-300">Add to Wishlist</span>
                </label>
                <span className="line !h-[15px] mx-0.5"></span>
                <span className="flex items-center gap-2 text-[18px] cursor-pointer link transition-all duration-300"><IoGitCompareOutline className="text-[20px]" />Add to Compare</span>
            </div>
            <div className="flex items-start flex-col gap-2">
                {
                    quantity >= totalStocks ? (
                        <span className="normal-case border bg-[#fff2e5] p-1 px-2 border-orange-500 text-orange-500 text-[16px] font-medium">
                            There are not enough products in stock
                        </span>
                    ) : (
                        <span className="capitalize border bg-[#e5ffe8] p-1 px-2 border-green-500 text-green-500 text-[16px] font-medium">
                            In stock
                        </span>
                    )
                }

            </div>

           
        </>
    )
}

export default ProductDetailsContent
