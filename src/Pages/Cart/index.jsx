import React, { useContext } from 'react'
import { Button, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { MyContext } from '../../App'
import { GiReturnArrow } from 'react-icons/gi'
import { FaCaretDown } from 'react-icons/fa'
import { RiCloseLargeLine } from 'react-icons/ri'
import { IoBagCheck, IoBagCheckOutline } from 'react-icons/io5'
import CartItems from './cartItems'

const CartPage = () => {

    const context = useContext(MyContext);

    return (
        <section className="section py-5 pb-10">
            <div className="container w-[80%] max-w-[80%] flex gap-4">
                <div className="leftPart w-[70%]">
                    <div className="shadow-md rounded-md bg-white flex flex-col gap-2">
                        <div className="py-2 px-3">
                            <h2 className="font-bold">Your Cart</h2>
                            <p className="mt-0">There are <span className="font-bold text-[var(--bg-primary)]">{context.cartItemsQty}</span> product{context.cartItemsQty <= 1 ? ("") : ("s")} in your cart</p>
                        </div>
                        <Divider />
                        <div className="flex items-center flex-col p-3 gap-4">
                            <CartItems size="S" quantity="1" />
                            <CartItems size="S" quantity="1" />
                            <CartItems size="S" quantity="1" />
                            <CartItems size="S" quantity="1" />
                            <CartItems size="S" quantity="1" />
                            <CartItems size="S" quantity="1" />
                            <CartItems size="S" quantity="1" />
                            <CartItems size="S" quantity="1" />
                            <CartItems size="S" quantity="1" />
                            <CartItems size="S" quantity="1" />
                        </div>
                    </div>
                </div>

                <div className="rightPart w-[30%]">
                    <div className="shadow-md rounded-md bg-white flex flex-col gap-2">
                        <div className="cartTotals ">
                            <div className="py-2">
                                <h2 className="uppercase px-4 py-1 text-[16px] font-bold text-[var(--text-light)] pb-2">Price Details <span className="capitalize">({context.cartItemsQty} Item{context.cartItemsQty <= 1 ? ("") : ("s")})</span></h2>
                            </div>
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
                                    context.platformFee === 0 ? (
                                        <span className="price text-green-600 text-[14px] flex items-center">Free</span>
                                    ) : (
                                        <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(49)}</span>
                                    )
                                }
                            </div>
                            <div className="flex items-center justify-between px-4">
                                <span className="text-[14px]">Shipping Fee</span>
                                {
                                    context.shippingFee === 0 ? (
                                        <span className="price text-green-600 text-[14px] flex items-center gap-1"><span className="line-through !text-[var(--text-dark)]"> ₹{new Intl.NumberFormat('en-IN').format(79)}</span>Free</span>
                                    ) : (
                                        <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(79)}</span>
                                    )
                                }
                            </div>
                            <div className="flex items-center justify-between px-4 py-0 pb-5">
                                {
                                    context.shippingFee === 0 ? (
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
                                <Link to="/checkout" className="w-full"><Button className="buttonPrimaryBlack w-full flex items-center gap-1" onClick={context.toggleCartPanel(false)}><IoBagCheck />Place Order</Button></Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default CartPage
