import React, { useEffect, useState } from 'react'
import QtyBox from '../../components/QtyBox';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { IoGitCompareOutline } from 'react-icons/io5';
import { Button, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductDetailsContent = (props) => {
    const [productActionIndex, setProductActionIndex] = useState(null);
    const [checked, setChecked] = useState(false);
    const [quantity, setQuantity] = useState(props?.product?.countInStock === 0 ? 0 : 1); // Default quantity

    // Calculate available stock dynamically
    const availableStock = props?.product?.countInStock - props?.product?.sale;

    // Ensure quantity does not exceed available stock
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity <= availableStock) {
            setQuantity(newQuantity);
        }
    };

    return (
        <>
            <h1 className="text-[20px] text-[var(--text-dark)] font-bold mb-1 productBrand">
                <Link to="/">{props?.product?.brand}</Link>
            </h1>
            <h1 className="text-[18px] mb-1 productTitle pr-10">
                <Link to="/">{props?.product?.name}</Link>
            </h1>

            <div className="flex items-center justify-start gap-3 text-[14px] py-1">
                <Link to="/">
                    <span className="flex items-center gap-1 border px-2 hover:border-[var(--text-dark)]">
                        <span className="flex items-center gap-1 font-semibold">
                            {props?.product?.rating}
                            <Rating defaultValue={1} max={1} size="small" readOnly className="!text-[var(--rating-star-color)]" />
                        </span>
                        <span className="line !h-[15px] mx-0.5"></span>
                        <span className="flex items-center gap-1 font-semibold">
                            {new Intl.NumberFormat("en", { notation: "compact" }).format(5100).toLowerCase()}
                            <span className="font-normal">Ratings</span>
                        </span>
                    </span>
                </Link>
                <span className="line !h-[15px] mx-1"></span>
                <span className="cursor-pointer link">Review (5)</span>
            </div>

            <hr className="my-2" />

            <div className="flex flex-col gap-3 py-1">
                <div className="flex items-center gap-3">

                    <span className="price text-[var(--text-dark)] text-[28px] font-medium flex items-center gap-0.5">
                        ₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.price}`)}</span>
                    </span>
                    <span className="oldPrice text-[var(--text-light)] text-[16px] font-medium flex items-center gap-0.5">
                        <span className="line-through gap-0.5">₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.oldPrice}`)}</span></span>
                    </span>
                    <span className="uppercase text-[16px] text-[var(--off-color)] font-medium">
                        ({`${props?.product?.discount}`}% OFF)
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="text-[16px] font-normal flex items-center gap-2">
                        Available in stocks:
                        {
                            availableStock > 0 ? (
                                <span className="font-bold text-[var(--rating-star-color)]">{`${availableStock} Items`}</span>
                            ) : (
                                <span className="p-1 text-[12px] bg-red-50 font-bold text-red-500 border border-red-500 capitalize">
                                    Out of Stock
                                </span>
                            )
                        }
                    </span>
                </div>
            </div>

            <div className="description py-1 mb-5 mt-3">
                <p className="pr-10 text-[14px] text-justify">{props?.product?.description}</p>
            </div>

            {props?.product?.size?.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[16px] font-bold">Size:</span>
                    <div className="flex items-center gap-1 actions">
                        {props?.product?.size?.map((size, index) => (
                            <Button
                                key={index}
                                className={`${productActionIndex === index ? "!bg-[var(--bg-primary)] !text-white" : ""} ${availableStock === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
                                onClick={() => { availableStock !== 0 && setProductActionIndex(index) }}
                                disableRipple={availableStock === 0}>
                                {size}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-[14px] text-[rgba(0,0,0,0.5)]">Free Shipping (Est. Delivery Time 2-3 Days)</p>

            <div className="flex items-center my-4 gap-5 rounded-md">
                <div className="qtyBoxWrapper w-[95px] rounded-md">
                    <QtyBox totalStocks={availableStock} onQuantityChange={handleQuantityChange} />
                </div>
                <Button
                    className={`!h-[40px] w-52 !text-[16px] flex items-center justify-center gap-1 ${availableStock === 0 ? "!cursor-not-allowed !bg-gray-300 !text-white" : "buttonPrimaryBlack"}`}
                    onClick={() => { availableStock !== 0 && null }} disableRipple={availableStock === 0}>
                    <MdOutlineShoppingCart className="text-[16px]" />
                    Add To Cart
                </Button>
            </div>

            <div className="flex items-center gap-4 my-4">
                <input id="wishlist-checkbox" type="checkbox" checked={checked} onChange={() => setChecked(!checked)} className="hidden" />
                <label htmlFor="wishlist-checkbox" className="flex items-center gap-1 cursor-pointer group link text-[16px]">
                    {checked ? (
                        <IoMdHeart className="text-[22px] text-red-500 transition-all duration-300" />
                    ) : (
                        <IoMdHeartEmpty className="text-[22px] text-gray-700 group-hover:text-[var(--bg-primary)] transition-all duration-300" />
                    )}
                    <span className="transition-all duration-300">Add to Wishlist</span>
                </label>
                <span className="line !h-[15px] mx-0.5"></span>
                <span className="flex items-center gap-2 text-[16px] cursor-pointer link transition-all duration-300">
                    <IoGitCompareOutline className="text-[20px]" />Add to Compare
                </span>
            </div>

            <div className="flex items-start flex-col gap-2">
                {
                    availableStock === 0 ? (
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
    );
};

export default ProductDetailsContent;
