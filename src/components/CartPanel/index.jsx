import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { MdDeleteOutline } from 'react-icons/md';
import { Button, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import { MyContext } from '../../App';



const CartPanel = ({ onCartItemQtyChange }) => {

    const context = useContext(MyContext);
    // const [openCartPanel, setOpenCartPanel] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);
    const [platformFee, setPlatformFee] = useState(0);
    const [cartItemsQty, setCartItemsQty] = useState(0);

    useEffect(() => {
        onCartItemQtyChange(cartItemsQty);
    }, [cartItemsQty, onCartItemQtyChange]);

    return (
        <>
            <div className="scroll w-[400px] h-full max-h-full overflow-y-scroll customScroll overflow-x-hidden">
                <div className="cartItem w-full flex items-start gap-3 p-2">
                    <div className="cartItemImg w-[30%]">
                        <div className="w-full h-[120px] rounded-md border overflow-hidden">
                            <Link to="/productDetails/47856" onClick={context.toggleCartPanel(false)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/z3UAG5L0_e6cd3d86e0ec4ecfbd0d275b4651a52d.jpg" alt="ProductImg" className="w-full h-full object-cover rounded-md hover:scale-105 transition-all" />
                            </Link>
                        </div>
                    </div>
                    <div className="cartInfo w-[80%] pr-5 relative">
                        <h5 className="text-[13px] font-bold line-clamp-1">T-Shirt</h5>
                        <h4 className="text-[14px] line-clamp-1 leading-6"><Link to="/product/784585" className="link transition-all" onClick={context.toggleCartPanel(false)}>Nike Air Max Invigor Black Nike Air Max Invigor Black</Link></h4>
                        <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">Sold by: <span className="capitalize">BEST UNITED INDIA COMFORTS PVT LTD</span></h6>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Size: <span>XXL</span></span>
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Qty: <span>{10}</span></span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="price text-black text-[14px] font-bold flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(1499)}
                            </span>
                            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(2599)}
                            </span>
                            <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">17% OFF</span>
                        </div>
                        <Button
                            className="!w-[30px] !h-[30px] !min-w-[30px] !absolute top-0 right-0 !shadow-md !text-gray-800 hover:!bg-gray-500 hover:!text-white !rounded-full flex items-center justify-center"
                            onClick={""}
                        >
                            <MdDeleteOutline className="!text-[40px]" />
                        </Button>
                    </div>
                </div>
                <Divider />
                <div className="cartItem w-full flex items-start gap-3 p-2">
                    <div className="cartItemImg w-[30%]">
                        <div className="w-full h-[120px] rounded-md border overflow-hidden">
                            <Link to="/productDetails/47856" onClick={context.toggleCartPanel(false)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/z3UAG5L0_e6cd3d86e0ec4ecfbd0d275b4651a52d.jpg" alt="ProductImg" className="w-full h-full object-cover rounded-md hover:scale-105 transition-all" />
                            </Link>
                        </div>
                    </div>
                    <div className="cartInfo w-[80%] pr-5 relative">
                        <h5 className="text-[13px] font-bold line-clamp-1">T-Shirt</h5>
                        <h4 className="text-[14px] line-clamp-1 leading-6"><Link to="/product/784585" className="link transition-all" onClick={context.toggleCartPanel(false)}>Nike Air Max Invigor Black Nike Air Max Invigor Black</Link></h4>
                        <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">Sold by: <span className="capitalize">BEST UNITED INDIA COMFORTS PVT LTD</span></h6>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Size: <span>XXL</span></span>
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Qty: <span>{10}</span></span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="price text-black text-[14px] font-bold flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(1499)}
                            </span>
                            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(2599)}
                            </span>
                            <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">17% OFF</span>
                        </div>
                        <Button
                            className="!w-[30px] !h-[30px] !min-w-[30px] !absolute top-0 right-0 !shadow-md !text-gray-800 hover:!bg-gray-500 hover:!text-white !rounded-full flex items-center justify-center"
                            onClick={""}
                        >
                            <MdDeleteOutline className="!text-[40px]" />
                        </Button>
                    </div>
                </div>
                <Divider />
                <div className="cartItem w-full flex items-start gap-3 p-2">
                    <div className="cartItemImg w-[30%]">
                        <div className="w-full h-[120px] rounded-md border overflow-hidden">
                            <Link to="/productDetails/47856" onClick={context.toggleCartPanel(false)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/z3UAG5L0_e6cd3d86e0ec4ecfbd0d275b4651a52d.jpg" alt="ProductImg" className="w-full h-full object-cover rounded-md hover:scale-105 transition-all" />
                            </Link>
                        </div>
                    </div>
                    <div className="cartInfo w-[80%] pr-5 relative">
                        <h5 className="text-[13px] font-bold line-clamp-1">T-Shirt</h5>
                        <h4 className="text-[14px] line-clamp-1 leading-6"><Link to="/product/784585" className="link transition-all" onClick={context.toggleCartPanel(false)}>Nike Air Max Invigor Black Nike Air Max Invigor Black</Link></h4>
                        <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">Sold by: <span className="capitalize">BEST UNITED INDIA COMFORTS PVT LTD</span></h6>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Size: <span>XXL</span></span>
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Qty: <span>{10}</span></span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="price text-black text-[14px] font-bold flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(1499)}
                            </span>
                            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(2599)}
                            </span>
                            <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">17% OFF</span>
                        </div>
                        <Button
                            className="!w-[30px] !h-[30px] !min-w-[30px] !absolute top-0 right-0 !shadow-md !text-gray-800 hover:!bg-gray-500 hover:!text-white !rounded-full flex items-center justify-center"
                            onClick={""}
                        >
                            <MdDeleteOutline className="!text-[40px]" />
                        </Button>
                    </div>
                </div>
                <Divider />
                <div className="cartItem w-full flex items-start gap-3 p-2">
                    <div className="cartItemImg w-[30%]">
                        <div className="w-full h-[120px] rounded-md border overflow-hidden">
                            <Link to="/productDetails/47856" onClick={context.toggleCartPanel(false)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/z3UAG5L0_e6cd3d86e0ec4ecfbd0d275b4651a52d.jpg" alt="ProductImg" className="w-full h-full object-cover rounded-md hover:scale-105 transition-all" />
                            </Link>
                        </div>
                    </div>
                    <div className="cartInfo w-[80%] pr-5 relative">
                        <h5 className="text-[13px] font-bold line-clamp-1">T-Shirt</h5>
                        <h4 className="text-[14px] line-clamp-1 leading-6"><Link to="/product/784585" className="link transition-all" onClick={context.toggleCartPanel(false)}>Nike Air Max Invigor Black Nike Air Max Invigor Black</Link></h4>
                        <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">Sold by: <span className="capitalize">BEST UNITED INDIA COMFORTS PVT LTD</span></h6>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Size: <span>XXL</span></span>
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Qty: <span>{10}</span></span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="price text-black text-[14px] font-bold flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(1499)}
                            </span>
                            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(2599)}
                            </span>
                            <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">17% OFF</span>
                        </div>
                        <Button
                            className="!w-[30px] !h-[30px] !min-w-[30px] !absolute top-0 right-0 !shadow-md !text-gray-800 hover:!bg-gray-500 hover:!text-white !rounded-full flex items-center justify-center"
                            onClick={""}
                        >
                            <MdDeleteOutline className="!text-[40px]" />
                        </Button>
                    </div>
                </div>
                <Divider />
                <div className="cartItem w-full flex items-start gap-3 p-2">
                    <div className="cartItemImg w-[30%]">
                        <div className="w-full h-[120px] rounded-md border overflow-hidden">
                            <Link to="/productDetails/47856" onClick={context.toggleCartPanel(false)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/z3UAG5L0_e6cd3d86e0ec4ecfbd0d275b4651a52d.jpg" alt="ProductImg" className="w-full h-full object-cover rounded-md hover:scale-105 transition-all" />
                            </Link>
                        </div>
                    </div>
                    <div className="cartInfo w-[80%] pr-5 relative">
                        <h5 className="text-[13px] font-bold line-clamp-1">T-Shirt</h5>
                        <h4 className="text-[14px] line-clamp-1 leading-6"><Link to="/product/784585" className="link transition-all" onClick={context.toggleCartPanel(false)}>Nike Air Max Invigor Black Nike Air Max Invigor Black</Link></h4>
                        <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">Sold by: <span className="capitalize">BEST UNITED INDIA COMFORTS PVT LTD</span></h6>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Size: <span>XXL</span></span>
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Qty: <span>{10}</span></span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="price text-black text-[14px] font-bold flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(1499)}
                            </span>
                            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(2599)}
                            </span>
                            <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">17% OFF</span>
                        </div>
                        <Button
                            className="!w-[30px] !h-[30px] !min-w-[30px] !absolute top-0 right-0 !shadow-md !text-gray-800 hover:!bg-gray-500 hover:!text-white !rounded-full flex items-center justify-center"
                            onClick={""}
                        >
                            <MdDeleteOutline className="!text-[40px]" />
                        </Button>
                    </div>
                </div>
                <Divider />
                <div className="cartItem w-full flex items-start gap-3 p-2">
                    <div className="cartItemImg w-[30%]">
                        <div className="w-full h-[120px] rounded-md border overflow-hidden">
                            <Link to="/productDetails/47856" onClick={context.toggleCartPanel(false)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/z3UAG5L0_e6cd3d86e0ec4ecfbd0d275b4651a52d.jpg" alt="ProductImg" className="w-full h-full object-cover rounded-md hover:scale-105 transition-all" />
                            </Link>
                        </div>
                    </div>
                    <div className="cartInfo w-[80%] pr-5 relative">
                        <h5 className="text-[13px] font-bold line-clamp-1">T-Shirt</h5>
                        <h4 className="text-[14px] line-clamp-1 leading-6"><Link to="/product/784585" className="link transition-all" onClick={context.toggleCartPanel(false)}>Nike Air Max Invigor Black Nike Air Max Invigor Black</Link></h4>
                        <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">Sold by: <span className="capitalize">BEST UNITED INDIA COMFORTS PVT LTD</span></h6>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Size: <span>XXL</span></span>
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Qty: <span>{10}</span></span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="price text-black text-[14px] font-bold flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(1499)}
                            </span>
                            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(2599)}
                            </span>
                            <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">17% OFF</span>
                        </div>
                        <Button
                            className="!w-[30px] !h-[30px] !min-w-[30px] !absolute top-0 right-0 !shadow-md !text-gray-800 hover:!bg-gray-500 hover:!text-white !rounded-full flex items-center justify-center"
                            onClick={""}
                        >
                            <MdDeleteOutline className="!text-[40px]" />
                        </Button>
                    </div>
                </div>
                <Divider />
                <div className="cartItem w-full flex items-start gap-3 p-2">
                    <div className="cartItemImg w-[30%]">
                        <div className="w-full h-[120px] rounded-md border overflow-hidden">
                            <Link to="/productDetails/47856" onClick={context.toggleCartPanel(false)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/z3UAG5L0_e6cd3d86e0ec4ecfbd0d275b4651a52d.jpg" alt="ProductImg" className="w-full h-full object-cover rounded-md hover:scale-105 transition-all" />
                            </Link>
                        </div>
                    </div>
                    <div className="cartInfo w-[80%] pr-5 relative">
                        <h5 className="text-[13px] font-bold line-clamp-1">T-Shirt</h5>
                        <h4 className="text-[14px] line-clamp-1 leading-6"><Link to="/product/784585" className="link transition-all" onClick={context.toggleCartPanel(false)}>Nike Air Max Invigor Black Nike Air Max Invigor Black</Link></h4>
                        <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">Sold by: <span className="capitalize">BEST UNITED INDIA COMFORTS PVT LTD</span></h6>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Size: <span>XXL</span></span>
                            <span className="bg-gray-100 px-2 border rounded-sm font-bold text-[13px]">Qty: <span>{10}</span></span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="price text-black text-[14px] font-bold flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(1499)}
                            </span>
                            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(2599)}
                            </span>
                            <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">17% OFF</span>
                        </div>
                        <Button
                            className="!w-[30px] !h-[30px] !min-w-[30px] !absolute top-0 right-0 !shadow-md !text-gray-800 hover:!bg-gray-500 hover:!text-white !rounded-full flex items-center justify-center"
                            onClick={""}
                        >
                            <MdDeleteOutline className="!text-[40px]" />
                        </Button>
                    </div>
                </div>
                <Divider />

            </div>

            <div className="bottomInfo w-full border-t border pt-4">
                <h3 className="uppercase px-4 py-1 text-[12px] font-bold text-[var(--text-light)] pb-2">Price Details <span className="capitalize">({cartItemsQty} Item{cartItemsQty <= 1 ? ("") : ("s")})</span></h3>
                <Divider />
                <div className="flex items-center justify-between px-4 py-1">
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
                    <Link to="/checkout" className="w-[45%]"><Button className="buttonPrimaryBlack w-full" onClick={context.toggleCartPanel(false)}>Checkout</Button></Link>
                </div>
            </div>
        </>
    )
}

CartPanel.propTypes = {
    cartItemsQty: PropTypes.number.isRequired,
    onCartItemQtyChange: PropTypes.func.isRequired,
}

export default CartPanel
