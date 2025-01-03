import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { MdDeleteOutline } from 'react-icons/md';
import { Button, Divider, Menu, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import { MyContext } from '../../App';
import { IoBagCheck } from 'react-icons/io5';
import { FaCaretDown } from 'react-icons/fa';
import CartPanelItems from './cartPanelItems';



const CartPanel = ({ onCartItemQtyChange, onPlatformFeeChange, onShippingFeeChange }) => {

    const context = useContext(MyContext);
    // const [openCartPanel, setOpenCartPanel] = useState(false);
    const [cartItemsQty, setCartItemsQty] = useState(0);
    const [platformFee, setPlatformFee] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);

    useEffect(() => {
        onCartItemQtyChange(cartItemsQty);
        onPlatformFeeChange(platformFee);
        onShippingFeeChange(shippingFee);
    }, [cartItemsQty, platformFee, shippingFee, onCartItemQtyChange, onPlatformFeeChange, onShippingFeeChange]);

    return (
        <>
            <div className="scroll w-[400px] h-full max-h-full overflow-y-scroll customScroll overflow-x-hidden">
                <CartPanelItems size="S" quantity="1" />
                <CartPanelItems size="S" quantity="1" />
                <CartPanelItems size="S" quantity="1" />
                <CartPanelItems size="S" quantity="1" />
                <CartPanelItems size="S" quantity="1" />
                <CartPanelItems size="S" quantity="1" />
                <CartPanelItems size="S" quantity="1" />
                <CartPanelItems size="S" quantity="1" />


            </div>

            <div className="bottomInfo w-full border-t border pt-4">
                <h3 className="uppercase px-4 py-1 text-[12px] font-bold text-[var(--text-light)] pb-2">Price Details <span className="capitalize">({cartItemsQty} Item{cartItemsQty <= 1 ? ("") : ("s")})</span></h3>
                <Divider />
                <div className="flex items-center justify-between px-4 py-1 mt-1">
                    <span className="text-[14px]">Total MRP</span>
                    <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(1499)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1">
                    <span className="text-[14px]">Discount on MRP</span>
                    <span className="price text-green-600 text-[14px] flex items-center gap-1">- ₹{new Intl.NumberFormat('en-IN').format(1499)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1">
                    <span className="text-[14px]">Coupon Discount</span>
                    <span className="price text-green-600 text-[14px] flex items-center gap-1">- ₹{new Intl.NumberFormat('en-IN').format(102)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1">
                    <span className="text-[14px]">Platform Fee</span>
                    {
                        platformFee === 0 ? (
                            <span className="price text-green-600 text-[14px] flex items-center">Free</span>
                        ) : (
                            <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(49)}</span>
                        )
                    }
                </div>
                <div className="flex items-center justify-between px-4">
                    <span className="text-[14px]">Shipping Fee</span>
                    {
                        shippingFee === 0 ? (
                            <span className="price text-green-600 text-[14px] flex items-center gap-1"><span className="line-through !text-[var(--text-dark)]"> ₹{new Intl.NumberFormat('en-IN').format(79)}</span>Free</span>
                        ) : (
                            <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(79)}</span>
                        )
                    }
                </div>
                <div className="flex items-center justify-between px-4 py-0 pb-5">
                    {
                        shippingFee === 0 ? (
                            <span className="text-[12px]">Free Shipping for you</span>
                        ) : (""
                        )
                    }

                </div>
                <Divider />
                <div className="flex items-center justify-between px-4 py-4 font-bold text-[15px]">
                    <span>Total Amount:</span>
                    <span>₹{new Intl.NumberFormat('en-IN').format(2012)}</span>
                </div>
                <Divider />
                <div className="w-[100%] flex items-center justify-between bg-gray-100 p-4 ">
                    <Link to="/cart" className="w-[45%]"><Button className="buttonPrimaryBlack w-full" onClick={context.toggleCartPanel(false)}>View Cart</Button></Link>
                    <Link to="/checkout" className="w-[45%]"><Button className="buttonPrimaryWhite w-full flex items-center gap-1" onClick={context.toggleCartPanel(false)}><IoBagCheck />Checkout</Button></Link>
                </div>
            </div>
        </>
    )
}

CartPanel.propTypes = {
    cartItemsQty: PropTypes.number.isRequired,
    platformFee: PropTypes.number.isRequired,
    shippingFee: PropTypes.number.isRequired,
    onCartItemQtyChange: PropTypes.func.isRequired,
    onPlatformFeeChange: PropTypes.func.isRequired,
    onShippingFeeChange: PropTypes.func.isRequired,
}

export default CartPanel
